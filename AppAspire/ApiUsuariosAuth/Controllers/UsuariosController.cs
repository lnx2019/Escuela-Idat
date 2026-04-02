using Microsoft.AspNetCore.Mvc;
using ApiUsuariosEF.Data;
using ApiUsuariosEF.Models;
using Microsoft.AspNetCore.Authorization;

namespace ApiUsuariosEF.Controllers
{
    [ApiController]
    [Route("api/usuarios")]
    public class UsuariosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsuariosController(AppDbContext context)
        {
            _context = context;
        }

        // 🔹 Obtener todos los usuarios (solo ADMIN)
        [Authorize(Roles = "ADMIN")]
        [HttpGet]
        public IActionResult Get()
        {
            var usuarios = _context.Usuarios.ToList();
            return Ok(usuarios);
        }

        // 🔹 Obtener usuario por ID
        [Authorize(Roles = "ADMIN")]
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var usuario = _context.Usuarios.Find(id);

            if (usuario == null)
                return NotFound();

            return Ok(usuario);
        }

        // 🔹 Registrar usuario (público o solo ADMIN, tú decides)
        [AllowAnonymous]
        [HttpPost]
        public IActionResult Post([FromBody] Usuario usuario)
        {
            var rolesPermitidos = new[] { "VENDEDOR", "CLIENTE" };

            if (!rolesPermitidos.Contains(usuario.Rol))
            {
                return BadRequest("Solo se permite CLIENTE o VENDEDOR");
            }

            _context.Usuarios.Add(usuario);
            _context.SaveChanges();

            return Ok(usuario);
        }
        // 🔹 Actualizar usuario
        [Authorize(Roles = "ADMIN")]
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] Usuario usuario)
        {
            var usuarioExistente = _context.Usuarios.Find(id);

            if (usuarioExistente == null)
                return NotFound();

            usuarioExistente.Username = usuario.Username;
            usuarioExistente.Password = usuario.Password;
            usuarioExistente.Rol = usuario.Rol;

            _context.SaveChanges();

            return Ok(usuarioExistente);
        }

        // 🔹 Eliminar usuario
        [Authorize(Roles = "ADMIN")]
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var usuario = _context.Usuarios.Find(id);

            if (usuario == null)
                return NotFound();

            _context.Usuarios.Remove(usuario);
            _context.SaveChanges();

            return Ok("Usuario eliminado");
        }
    }
}