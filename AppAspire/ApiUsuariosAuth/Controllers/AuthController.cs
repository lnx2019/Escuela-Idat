// using Microsoft.AspNetCore.Mvc;
// using Microsoft.IdentityModel.Tokens;
// using System.IdentityModel.Tokens.Jwt;
// using ApiUsuariosEF.Data;
// using ApiUsuariosEF.Models;
// using System.Security.Claims;
// using System.Text;

// namespace ApiUsuariosEF.Controllers
// {
//     [ApiController]
//     [Route("api/auth")]
//     public class AuthController : ControllerBase
//     {
//         private readonly AppDbContext _context;
//         private readonly IConfiguration _config;

//         public AuthController(AppDbContext context, IConfiguration config)
//         {
//             _context = context;
//             _config = config;
//         }

//         [HttpPost("login")]
//         public IActionResult Login([FromBody] Usuario login)
//         {
//             var user = _context.Usuarios
//                 .FirstOrDefault(u => u.Username == login.Username && u.Password == login.Password);

//             if (user == null)
//                 return Unauthorized("Credenciales inválidas");

//             var claims = new[]
//             {
//                 new Claim(ClaimTypes.Name, user.Username),
//                 new Claim(ClaimTypes.Role, user.Rol)
//             };

//             var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
//             var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

//             var token = new JwtSecurityToken(
//                 issuer: _config["Jwt:Issuer"],
//                 audience: _config["Jwt:Audience"],
//                 claims: claims,
//                 expires: DateTime.UtcNow.AddHours(2),
//                 signingCredentials: creds
//             );
            
//             return Ok(new
//             {
//                 token = new JwtSecurityTokenHandler().WriteToken(token)
//             });
//         }
//     }
// }