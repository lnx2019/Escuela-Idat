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
public class AsistenciasController : ControllerBase
{
    private readonly GimnasioDbContext _context;

    public AsistenciasController(GimnasioDbContext context) => _context = context;

    [HttpGet]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> GetAll([FromQuery] DateTime? fecha)
    {
        var query = _context.Asistencias.Include(a => a.Socio).ThenInclude(s => s.User).AsQueryable();
        if (fecha.HasValue) query = query.Where(a => a.FechaHoraEntrada.Date == fecha.Value.Date);

        var result = await query.OrderByDescending(a => a.FechaHoraEntrada)
            .Select(a => new { a.AsistenciaId, a.SocioId, socioNombre = a.Socio.User.UserName, a.FechaHoraEntrada, a.FechaHoraSalida, a.Observaciones })
            .ToListAsync();
        return Ok(result);
    }

    [HttpGet("socio/{socioId}")]
    [Authorize(Roles = "ADMIN,ENTRENADOR")]
    public async Task<IActionResult> GetBySocio(int socioId)
    {
        var result = await _context.Asistencias.Include(a => a.Socio).ThenInclude(s => s.User)
            .Where(a => a.SocioId == socioId)
            .OrderByDescending(a => a.FechaHoraEntrada)
            .Select(a => new { a.AsistenciaId, a.SocioId, socioNombre = a.Socio.User.UserName, a.FechaHoraEntrada, a.FechaHoraSalida })
            .ToListAsync();
        return Ok(result);
    }

    [HttpGet("mi-historial")]
    [Authorize(Roles = "SOCIO")]
    public async Task<IActionResult> GetMyHistory()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var socio = await _context.Socios.FirstOrDefaultAsync(s => s.UserId == userId);
        if (socio == null) return NotFound();

        var result = await _context.Asistencias.Where(a => a.SocioId == socio.SocioId)
            .OrderByDescending(a => a.FechaHoraEntrada)
            .Select(a => new { a.AsistenciaId, a.FechaHoraEntrada, a.FechaHoraSalida, a.Observaciones })
            .ToListAsync();
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "ADMIN,ENTRENADOR")]
    public async Task<IActionResult> Create([FromBody] CreateAsistenciaRequest request)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var socio = await _context.Socios.FindAsync(request.SocioId);
        if (socio == null || !socio.IsActive) return BadRequest(new { message = "Socio inválido" });

        var asistencia = new Models.Asistencias { SocioId = request.SocioId, FechaHoraEntrada = DateTime.Now, Observaciones = request.Observaciones, RegistradaPorUserId = userId };
        _context.Asistencias.Add(asistencia);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAll), new { id = asistencia.AsistenciaId }, new { asistencia.AsistenciaId, asistencia.FechaHoraEntrada });
    }

    [HttpPut("{id}/salida")]
    [Authorize(Roles = "ADMIN,ENTRENADOR")]
    public async Task<IActionResult> RegisterExit(int id)
    {
        var asistencia = await _context.Asistencias.FindAsync(id);
        if (asistencia == null) return NotFound();
        if (asistencia.FechaHoraSalida.HasValue) return BadRequest(new { message = "Salida ya registrada" });

        asistencia.FechaHoraSalida = DateTime.Now;
        await _context.SaveChangesAsync();
        return NoContent();
    }
}

public class CreateAsistenciaRequest
{
    public int SocioId { get; set; }
    public string? Observaciones { get; set; }
}
