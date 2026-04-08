using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ApiClientesEF.Data;
using ApiClientesEF.Models;
//using System.Linq;

namespace ApiClientesEF.Controllers
{
    [ApiController]
    [Route("api/clientes")]
    public class ClientesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ClientesController(AppDbContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "ADMIN")]
        [HttpGet]
        public IActionResult Get()
        {
            var clientes = _context.Clientes.ToList();
            return Ok(clientes);
        }

        [Authorize(Roles = "ADMIN,VENDEDOR")]
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var cliente = _context.Clientes.Find(id);

            if (cliente == null)
            {
                return NotFound();
            }
            return Ok(cliente);
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPost]
        public IActionResult Post([FromBody] Cliente cliente)
        {
            _context.Clientes.Add(cliente);
            _context.SaveChanges();
            return Ok(cliente);
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] Cliente cliente)
        {
            var clienteExiste = _context.Clientes.Find(id);

            if (clienteExiste == null)
            {
                return NotFound();
            }

            clienteExiste.Nombre = cliente.Nombre;
            clienteExiste.Apellido = cliente.Apellido;
            clienteExiste.Edad = cliente.Edad;
            _context.SaveChanges();
            return NoContent();
        }

        [Authorize(Roles = "ADMIN")]
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var cliente = _context.Clientes.Find(id);

            if (cliente == null)
            {
                return NotFound();
            }
            _context.Clientes.Remove(cliente);
            _context.SaveChanges();
            return Ok("Cliente eliminado");
        }
    }
}