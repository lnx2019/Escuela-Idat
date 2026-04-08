using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ApiIdentity.Data;
using ApiIdentity.Models;

namespace ApiIdentity.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly GimnasioDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthController(GimnasioDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.NormalizedUserName == request.UserName.ToUpper() && u.IsActive);

        if (user == null)
            return Unauthorized(new { message = "Usuario no encontrado" });

        bool passwordValid = false;
        try
        {
            passwordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
        }
        catch
        {
            passwordValid = false;
        }

        if (!passwordValid)
            return Unauthorized(new { message = "Contraseña incorrecta" });

        user.LastLoginAt = DateTime.Now;
        await _context.SaveChangesAsync();

        var token = GenerateJwtToken(user);
        var roles = await _context.UserRoles
            .Include(ur => ur.Role)
            .Where(ur => ur.UserId == user.UserId)
            .Select(ur => ur.Role.Name)
            .ToListAsync();

        return Ok(new
        {
            token,
            expiresAt = DateTime.Now.AddMinutes(120),
            user = new
            {
                userId = user.UserId,
                userName = user.UserName,
                email = user.Email,
                roles
            }
        });
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (await _context.Users.AnyAsync(u => u.NormalizedUserName == request.UserName.ToUpper()))
            return BadRequest(new { message = "El usuario ya existe" });

        if (await _context.Users.AnyAsync(u => u.NormalizedEmail == request.Email.ToUpper()))
            return BadRequest(new { message = "El email ya existe" });

        var roleName = request.Role?.ToUpper() ?? "SOCIO";
        
        // Permitir SOCIO, ENTRENADOR o ADMIN (para crear primer usuario)
        if (roleName != "SOCIO" && roleName != "ENTRENADOR" && roleName != "ADMIN")
            return BadRequest(new { message = "Rol inválido. Solo se permite SOCIO, ENTRENADOR o ADMIN" });

        var role = await _context.Roles.FirstOrDefaultAsync(r => r.NormalizedName == roleName);
        if (role == null)
            return BadRequest(new { message = "Rol inválido" });

        var user = new Users
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

        var userRole = new UserRoles { UserId = user.UserId, RoleId = role.RoleId, AssignedAt = DateTime.Now };
        _context.UserRoles.Add(userRole);
        await _context.SaveChangesAsync();

        var token = GenerateJwtToken(user);
        return Ok(new { token, expiresAt = DateTime.Now.AddMinutes(120), user = new { user.UserId, user.UserName, user.Email, roles = new[] { role.Name } } });
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return NotFound();

        var roles = await _context.UserRoles
            .Include(ur => ur.Role)
            .Where(ur => ur.UserId == userId)
            .Select(ur => ur.Role!.Name)
            .ToListAsync();

        return Ok(new { user.UserId, user.UserName, user.Email, roles });
    }

    private string GenerateJwtToken(Users user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.UserId.ToString()),
            new(ClaimTypes.Name, user.UserName),
            new(ClaimTypes.Email, user.Email)
        };

        var roles = _context.UserRoles.Include(ur => ur.Role).Where(ur => ur.UserId == user.UserId).Select(ur => ur.Role!.Name).ToList();
        foreach (var role in roles) claims.Add(new Claim(ClaimTypes.Role, role));

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddMinutes(120),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

public class LoginRequest
{
    public string UserName { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class RegisterRequest
{
    public string UserName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? Role { get; set; }
}
