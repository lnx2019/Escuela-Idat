using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApiProfiles.Data;
using ApiProfiles.Models;

namespace ApiProfiles.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class RutinasController : ControllerBase
{
    private readonly GimnasioDbContext _context;

    public RutinasController(GimnasioDbContext context) => _context = context;

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll([FromQuery] int? socioId, [FromQuery] bool? activa)
    {
        var query = _context.Rutinas.Include(r => r.Socio).ThenInclude(s => s.User).AsQueryable();
        
        if (socioId.HasValue)
            query = query.Where(r => r.SocioId == socioId.Value);
        
        if (activa.HasValue)
            query = query.Where(r => r.Activa == activa.Value);
        
        var result = await query
            .OrderByDescending(r => r.FechaInicio)
            .Select(r => new { 
                r.RutinaId, 
                r.SocioId, 
                socioNombre = r.Socio.User.UserName,
                r.Nombre, 
                r.Objetivo, 
                r.FechaInicio, 
                r.FechaFin, 
                r.Activa 
            })
            .ToListAsync();
        
        return Ok(result);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(int id)
    {
        var r = await _context.Rutinas
            .Include(r => r.Socio).ThenInclude(s => s.User)
            .FirstOrDefaultAsync(rut => rut.RutinaId == id);
        
        if (r == null) return NotFound();
        
        return Ok(new { 
            r.RutinaId, 
            r.SocioId, 
            socioNombre = r.Socio.User.UserName,
            r.Nombre, 
            r.Objetivo, 
            r.FechaInicio, 
            r.FechaFin, 
            r.Activa 
        });
    }

    [HttpPost]
    [Authorize(Roles = "ADMIN,ENTRENADOR")]
    public async Task<IActionResult> Create([FromBody] CreateRutinaRequest request)
    {
        var socio = await _context.Socios.FindAsync(request.SocioId);
        if (socio == null || !socio.IsActive)
            return BadRequest(new { message = "Socio inválido" });

        int? entrenadorId = null;
        if (User.IsInRole("ENTRENADOR"))
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var entr = await _context.Entrenadores.FirstOrDefaultAsync(e => e.UserId == userId);
            if (entr != null) entrenadorId = entr.EntrenadorId;
        }

        var rutina = new Rutinas
        {
            SocioId = request.SocioId,
            EntrenadorId = entrenadorId,
            Nombre = request.Nombre,
            Objetivo = request.Objetivo,
            FechaInicio = DateTime.Now,
            FechaFin = request.FechaFin,
            Activa = true,
            CreatedAt = DateTime.Now
        };

        _context.Rutinas.Add(rutina);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = rutina.RutinaId }, new { rutina.RutinaId, rutina.Nombre });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "ADMIN,ENTRENADOR")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateRutinaRequest request)
    {
        var r = await _context.Rutinas.FindAsync(id);
        if (r == null) return NotFound();

        if (request.Nombre != null) r.Nombre = request.Nombre;
        if (request.Objetivo != null) r.Objetivo = request.Objetivo;
        if (request.FechaFin != null) r.FechaFin = request.FechaFin;
        if (request.Activa.HasValue) r.Activa = request.Activa.Value;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "ADMIN,ENTRENADOR")]
    public async Task<IActionResult> Delete(int id)
    {
        var r = await _context.Rutinas.FindAsync(id);
        if (r == null) return NotFound();

        r.Activa = false;
        await _context.SaveChangesAsync();
        return NoContent();
    }
}

public class CreateRutinaRequest
{
    public int SocioId { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string? Objetivo { get; set; }
    public DateTime? FechaFin { get; set; }
    public List<CreateRutinaEjercicioRequest>? Ejercicios { get; set; }
}

public class CreateRutinaEjercicioRequest
{
    public int EjercicioId { get; set; }
    public int Orden { get; set; }
    public int? Series { get; set; }
    public int? Repeticiones { get; set; }
    public decimal? PesoObjetivoKg { get; set; }
    public int? DuracionSegundos { get; set; }
    public int? DescansoSegundos { get; set; }
}

public class UpdateRutinaRequest
{
    public string? Nombre { get; set; }
    public string? Objetivo { get; set; }
    public DateTime? FechaFin { get; set; }
    public bool? Activa { get; set; }
}