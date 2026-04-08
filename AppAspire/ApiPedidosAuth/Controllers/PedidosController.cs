using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ApiPedidosEF.Data;
using ApiPedidosEF.Models;
// using System.Linq;

namespace ApiPedidosEF.Controllers
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
        [Authorize(Roles = "ADMIN,VENDEDOR")]
        [HttpGet]
        public IActionResult Get()
        {
            var pedidos = _context.Pedidos.ToList();
            return Ok(pedidos);
        }

        [Authorize(Roles = "ADMIN,VENDEDOR")]
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

         //POST registrar un producto
        [Authorize(Roles = "ADMIN")]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Pedido pedido)
        {
            //insert into producto (id,nombre,precio,stock) values(...,...);
            var httpClient = new HttpClient();
            var response = await httpClient.GetAsync($"http://clientes/api/clientes/{pedido.ClienteId}");

             if (!response.IsSuccessStatusCode)
                return BadRequest("El cliente no existe");

             response = await httpClient.GetAsync($"http://productos/api/productos/{pedido.ProductoId}");
             if (!response.IsSuccessStatusCode)
                return BadRequest("El producto no existe");
 
            _context.Pedidos.Add(pedido);
            _context.SaveChanges();
            return Ok(pedido);
        }

        [Authorize(Roles = "ADMIN")]
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

        [Authorize(Roles = "ADMIN")]
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