using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApiWorkouts.Data;
using ApiWorkouts.Models;

namespace ApiWorkouts.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EjerciciosController : ControllerBase
{
    private readonly GimnasioDbContext _context;

    public EjerciciosController(GimnasioDbContext context) => _context = context;

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll()
    {
        var result = await _context.Ejercicios.Where(e => e.IsActive).Select(e => new { e.EjercicioId, e.Nombre, e.Descripcion, e.GrupoMuscular }).ToListAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(int id)
    {
        var e = await _context.Ejercicios.FindAsync(id);
        if (e == null || !e.IsActive) return NotFound();
        return Ok(new { e.EjercicioId, e.Nombre, e.Descripcion, e.GrupoMuscular });
    }

    [HttpPost]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> Create([FromBody] CreateEjercicioRequest request)
    {
        if (await _context.Ejercicios.AnyAsync(e => e.Nombre.ToUpper() == request.Nombre.ToUpper()))
            return BadRequest(new { message = "Ya existe" });

        var e = new Models.Ejercicios { Nombre = request.Nombre, Descripcion = request.Descripcion, GrupoMuscular = request.GrupoMuscular, IsActive = true };
        _context.Ejercicios.Add(e);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = e.EjercicioId }, new { e.EjercicioId, e.Nombre });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateEjercicioRequest request)
    {
        var e = await _context.Ejercicios.FindAsync(id);
        if (e == null) return NotFound();
        if (request.Nombre != null) e.Nombre = request.Nombre;
        if (request.Descripcion != null) e.Descripcion = request.Descripcion;
        if (request.GrupoMuscular != null) e.GrupoMuscular = request.GrupoMuscular;
        await _context.SaveChangesAsync();
        return NoContent();
    }
}

public class CreateEjercicioRequest
{
    public string Nombre { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public string? GrupoMuscular { get; set; }
}

public class UpdateEjercicioRequest
{
    public string? Nombre { get; set; }
    public string? Descripcion { get; set; }
    public string? GrupoMuscular { get; set; }
}