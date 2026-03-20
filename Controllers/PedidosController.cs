using Microsoft.AspNetCore.Mvc;
using ApiProductosEF.Data;
using ApiProductosEF.Models;
using System.Linq;

namespace ApiProductosEF.Controllers
{
    [ApiController]
    [Route("api/pedidos")]
    public class PedidosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PedidosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Get()
        {
            var pedidos = _context.Pedidos.ToList();
            return Ok(pedidos);
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var pedido = _context.Pedidos.Find(id);

            if (pedido == null)
            {
                return NotFound();
            }
            return Ok(pedido);
        }

        [HttpPost]
        public IActionResult Post([FromBody] Pedido pedido)
        {
            _context.Pedidos.Add(pedido);
            _context.SaveChanges();
            return Ok(pedido);
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] Pedido pedido)
        {
            var pedidoExiste = _context.Pedidos.Find(id);

            if (pedidoExiste == null)
            {
                return NotFound();
            }
            pedidoExiste.Numero = pedido.Numero;
            pedidoExiste.Fecha = pedido.Fecha;
            pedidoExiste.Estado = pedido.Estado;
            _context.SaveChanges();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var pedido = _context.Pedidos.Find(id);

            if (pedido == null)
            {
                return NotFound();
            }
            _context.Pedidos.Remove(pedido);
            _context.SaveChanges();
            return Ok("Pedido eliminado");
        }
    }
}