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
public class SociosController : ControllerBase
{
    private readonly GimnasioDbContext _context;

    public SociosController(GimnasioDbContext context) => _context = context;

    [HttpGet]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> GetAll()
    {
        var socios = await _context.Socios.Include(s => s.User).Where(s => s.IsActive)
            .Select(s => new { s.SocioId, s.UserId, userName = s.User.UserName, email = s.User.Email, s.FechaNacimiento, s.Genero, s.AlturaCm, s.PesoKg, s.EmergenciaNombre, s.EmergenciaTelefono, s.FechaRegistro })
            .ToListAsync();
        return Ok(socios);
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "ADMIN,ENTRENADOR")]
    public async Task<IActionResult> GetById(int id)
    {
        var socio = await _context.Socios.Include(s => s.User).FirstOrDefaultAsync(s => s.SocioId == id);
        if (socio == null) return NotFound();
        return Ok(new { socio.SocioId, socio.UserId, userName = socio.User.UserName, email = socio.User.Email, socio.FechaNacimiento, socio.Genero, socio.AlturaCm, socio.PesoKg, socio.EmergenciaNombre, socio.EmergenciaTelefono });
    }

    [HttpGet("mi-perfil")]
    [Authorize(Roles = "SOCIO")]
    public async Task<IActionResult> GetMyProfile()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var socio = await _context.Socios.Include(s => s.User).FirstOrDefaultAsync(s => s.UserId == userId);
        if (socio == null) return NotFound();
        return Ok(new { socio.SocioId, socio.UserId, userName = socio.User.UserName, email = socio.User.Email, socio.FechaNacimiento, socio.Genero, socio.AlturaCm, socio.PesoKg });
    }

    [HttpPost]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> Create([FromBody] CreateSocioRequest request)
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

        var socio = new Models.Socios { UserId = user.UserId, FechaNacimiento = request.FechaNacimiento, Genero = request.Genero, AlturaCm = request.AlturaCm, PesoKg = request.PesoKg, FechaRegistro = DateTime.Now, IsActive = true };
        _context.Socios.Add(socio);
        await _context.SaveChangesAsync();

        var role = await _context.Roles.FirstOrDefaultAsync(r => r.NormalizedName == "SOCIO");
        if (role != null)
        {
            _context.UserRoles.Add(new ApiIdentity.Models.UserRoles { UserId = user.UserId, RoleId = role.RoleId, AssignedAt = DateTime.Now });
            await _context.SaveChangesAsync();
        }

        return CreatedAtAction(nameof(GetById), new { id = socio.SocioId }, new { socio.SocioId, user.UserName, user.Email });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateSocioRequest request)
    {
        var socio = await _context.Socios.FindAsync(id);
        if (socio == null) return NotFound();

        if (request.FechaNacimiento.HasValue) socio.FechaNacimiento = request.FechaNacimiento;
        if (request.Genero != null) socio.Genero = request.Genero;
        if (request.AlturaCm.HasValue) socio.AlturaCm = request.AlturaCm;
        if (request.PesoKg.HasValue) socio.PesoKg = request.PesoKg;
        if (request.EmergenciaNombre != null) socio.EmergenciaNombre = request.EmergenciaNombre;
        if (request.EmergenciaTelefono != null) socio.EmergenciaTelefono = request.EmergenciaTelefono;

        await _context.SaveChangesAsync();
        return NoContent();
    }
}

public class CreateSocioRequest
{
    public string UserName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public DateTime? FechaNacimiento { get; set; }
    public string? Genero { get; set; }
    public decimal? AlturaCm { get; set; }
    public decimal? PesoKg { get; set; }
    public string? EmergenciaNombre { get; set; }
    public string? EmergenciaTelefono { get; set; }
}

public class UpdateSocioRequest
{
    public DateTime? FechaNacimiento { get; set; }
    public string? Genero { get; set; }
    public decimal? AlturaCm { get; set; }
    public decimal? PesoKg { get; set; }
    public string? EmergenciaNombre { get; set; }
    public string? EmergenciaTelefono { get; set; }
}
