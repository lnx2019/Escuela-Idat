using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApiProfiles.Data;
using ApiProfiles.Models;
using ApiIdentity.Models;

namespace ApiProfiles.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EntrenadoresController : ControllerBase
{
    private readonly GimnasioDbContext _context;

    public EntrenadoresController(GimnasioDbContext context) => _context = context;

    [HttpGet]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> GetAll()
    {
        var entr = await _context.Entrenadores.Include(e => e.User).Where(e => e.IsActive)
            .Select(e => new { e.EntrenadorId, e.UserId, userName = e.User.UserName, email = e.User.Email, e.Especialidad, e.Certificaciones, e.FechaIngreso })
            .ToListAsync();
        return Ok(entr);
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "ADMIN,ENTRENADOR")]
    public async Task<IActionResult> GetById(int id)
    {
        var entr = await _context.Entrenadores.Include(e => e.User).FirstOrDefaultAsync(e => e.EntrenadorId == id);
        if (entr == null) return NotFound();
        return Ok(new { entr.EntrenadorId, entr.UserId, userName = entr.User.UserName, email = entr.User.Email, entr.Especialidad, entr.Certificaciones });
    }

    [HttpGet("mis-socios")]
    [Authorize(Roles = "ENTRENADOR")]
    public async Task<IActionResult> GetMySocios()
    {
        return Ok(new { message = "Funcionalidad en desarrollo" });
    }

    [HttpPost]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> Create([FromBody] CreateEntrenadorRequest request)
    {
        if (await _context.Users.AnyAsync(u => u.NormalizedUserName == request.UserName.ToUpper()))
            return BadRequest(new { message = "Usuario ya existe" });

        var user = new ApiIdentity.Models.Users
        {
            UserName = request.UserName,
            NormalizedUserName = request.UserName.ToUpper(),
            Email = request.Email,
            NormalizedEmail = request.Email.ToUpper(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            PhoneNumber = request.PhoneNumber,
            IsActive = true,
            CreatedAt = DateTime.Now
        };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var entr = new Models.Entrenadores { UserId = user.UserId, Especialidad = request.Especialidad, Certificaciones = request.Certificaciones, FechaIngreso = DateTime.Now, IsActive = true };
        _context.Entrenadores.Add(entr);

        // Asignar rol ENTRENADOR al usuario
        var rolEntrenador = await _context.Roles.FirstOrDefaultAsync(r => r.NormalizedName == "ENTRENADOR");
        if (rolEntrenador != null)
        {
            var userRole = new ApiIdentity.Models.UserRoles { UserId = user.UserId, RoleId = rolEntrenador.RoleId, AssignedAt = DateTime.Now };
            _context.UserRoles.Add(userRole);
        }

        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = entr.EntrenadorId }, new { entr.EntrenadorId, user.UserName, user.Email });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateEntrenadorRequest request)
    {
        var entr = await _context.Entrenadores.FindAsync(id);
        if (entr == null) return NotFound();

        if (request.Especialidad != null) entr.Especialidad = request.Especialidad;
        if (request.Certificaciones != null) entr.Certificaciones = request.Certificaciones;

        await _context.SaveChangesAsync();
        return NoContent();
    }
}

public class CreateEntrenadorRequest
{
    public string UserName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? Especialidad { get; set; }
    public string? Certificaciones { get; set; }
}

public class UpdateEntrenadorRequest
{
    public string? Especialidad { get; set; }
    public string? Certificaciones { get; set; }
}
