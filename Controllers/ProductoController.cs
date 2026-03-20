using Microsoft.AspNetCore.Mvc;
using ApiProductosEF.Data;
using ApiProductosEF.Models;
// using System.Linq;

namespace ApiProductosEF.Controllers
{
    [ApiController]
    [Route("api/productos")]
    public class ProductoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductoController(AppDbContext context)
        {
            _context = context;
        }

        // GET: obtener todos los productos
        [HttpGet]
        public IActionResult Get()
        {
            var productos = _context.Productos.ToList();
            return Ok(productos);
        }
        [HttpPost]
        public IActionResult Post([FromBody] Producto producto)
        {
            _context.Productos.Add(producto);
            _context.SaveChanges();
            return Ok(producto);
        }
        
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] Producto producto)
        {
            var productoexiste = _context.Productos.Find(id);

            if (productoexiste == null)
            {
                return NotFound();
            }
            productoexiste.Nombre = producto.Nombre;
            productoexiste.Precio = producto.Precio;
            productoexiste.Stock = producto.Stock;
            _context.SaveChanges();
            return NoContent(); // 👈 aquí estaba el vacío existencial        }
        }
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var productoexiste = _context.Productos.Find(id);

            if (productoexiste == null)
            {
                return NotFound();
            }
            _context.Productos.Remove(productoexiste);
            _context.SaveChanges();
            return Ok("Producto eliminado");
        }
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var productoexiste = _context.Productos.Find(id);

            if (productoexiste == null)
            {
                return NotFound();
            }
            return Ok(productoexiste);
        }

    }
}