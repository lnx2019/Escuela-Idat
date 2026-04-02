using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApiBilling.Data;
using ApiBilling.Models;

namespace ApiBilling.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MembresiasController : ControllerBase
{
    private readonly GimnasioDbContext _context;

    public MembresiasController(GimnasioDbContext context) => _context = context;

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll()
    {
        var result = await _context.Membresias.Where(m => m.IsActive)
            .Select(m => new { m.MembresiaId, m.Nombre, m.Descripcion, m.DuracionDias, m.Precio, m.EsRenovable })
            .ToListAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(int id)
    {
        var m = await _context.Membresias.FindAsync(id);
        if (m == null || !m.IsActive) return NotFound();
        return Ok(new { m.MembresiaId, m.Nombre, m.Descripcion, m.DuracionDias, m.Precio, m.EsRenovable });
    }

    [HttpPost]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> Create([FromBody] CreateMembresiaRequest request)
    {
        if (await _context.Membresias.AnyAsync(m => m.Nombre.ToUpper() == request.Nombre.ToUpper()))
            return BadRequest(new { message = "Ya existe" });

        var m = new Models.Membresias { Nombre = request.Nombre, Descripcion = request.Descripcion, DuracionDias = request.DuracionDias, Precio = request.Precio, EsRenovable = request.EsRenovable, IsActive = true, CreatedAt = DateTime.Now };
        _context.Membresias.Add(m);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = m.MembresiaId }, new { m.MembresiaId, m.Nombre, m.Precio });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateMembresiaRequest request)
    {
        var m = await _context.Membresias.FindAsync(id);
        if (m == null) return NotFound();
        if (request.Nombre != null) m.Nombre = request.Nombre;
        if (request.Descripcion != null) m.Descripcion = request.Descripcion;
        if (request.DuracionDias.HasValue) m.DuracionDias = request.DuracionDias.Value;
        if (request.Precio.HasValue) m.Precio = request.Precio.Value;
        await _context.SaveChangesAsync();
        return NoContent();
    }
}

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SocioMembresiaController : ControllerBase
{
    private readonly GimnasioDbContext _context;

    public SocioMembresiaController(GimnasioDbContext context) => _context = context;

    [HttpGet("socio/{socioId}")]
    [Authorize(Roles = "ADMIN,ENTRENADOR")]
    public async Task<IActionResult> GetBySocio(int socioId)
    {
        var result = await _context.SocioMembresia.Include(sm => sm.Membresia)
            .Where(sm => sm.SocioId == socioId)
            .OrderByDescending(sm => sm.FechaInicio)
            .Select(sm => new { sm.SocioMembresiaId, sm.SocioId, sm.MembresiaId, membresiaNombre = sm.Membresia.Nombre, sm.FechaInicio, sm.FechaFin, sm.Estado, sm.MontoPagado })
            .ToListAsync();
        return Ok(result);
    }

    [HttpGet("mi-membresia")]
    [Authorize(Roles = "SOCIO")]
    public async Task<IActionResult> GetMyMembership()
    {
        var userId = int.Parse(User.Claims.First(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier").Value);
        return Ok(new List<object>());
    }

    [HttpPost]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> Create([FromBody] CreateSocioMembresiaRequest request)
    {
        var membresia = await _context.Membresias.FindAsync(request.MembresiaId);
        if (membresia == null || !membresia.IsActive) return BadRequest(new { message = "Membresía inválida" });

        var fechaFin = request.FechaInicio.AddDays(membresia.DuracionDias);
        var estado = fechaFin >= DateTime.Now ? "ACTIVA" : "VENCIDA";

        var sm = new Models.SocioMembresia { SocioId = request.SocioId, MembresiaId = request.MembresiaId, FechaInicio = request.FechaInicio, FechaFin = fechaFin, Estado = estado, MontoPagado = request.MontoPagado, Notas = request.Notas, CreatedAt = DateTime.Now };
        _context.SocioMembresia.Add(sm);
        await _context.SaveChangesAsync();
        return Ok(new { sm.SocioMembresiaId, sm.Estado, sm.FechaFin });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateSocioMembresiaRequest request)
    {
        var sm = await _context.SocioMembresia.FindAsync(id);
        if (sm == null) return NotFound();
        if (request.Estado != null) sm.Estado = request.Estado;
        if (request.Notas != null) sm.Notas = request.Notas;
        await _context.SaveChangesAsync();
        return NoContent();
    }
}

public class CreateMembresiaRequest
{
    public string Nombre { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public int DuracionDias { get; set; }
    public decimal Precio { get; set; }
    public bool EsRenovable { get; set; } = true;
}

public class UpdateMembresiaRequest
{
    public string? Nombre { get; set; }
    public string? Descripcion { get; set; }
    public int? DuracionDias { get; set; }
    public decimal? Precio { get; set; }
}

public class CreateSocioMembresiaRequest
{
    public int SocioId { get; set; }
    public int MembresiaId { get; set; }
    public DateTime FechaInicio { get; set; }
    public decimal MontoPagado { get; set; }
    public string? Notas { get; set; }
}

public class UpdateSocioMembresiaRequest
{
    public string? Estado { get; set; }
    public string? Notas { get; set; }
}
