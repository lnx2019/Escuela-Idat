using Microsoft.AspNetCore.Mvc;
using ApiProductosEF.Data;
using ApiProductosEF.Models;
using Microsoft.AspNetCore.Authorization;

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
        //GET obtener todos los productos
        [Authorize(Roles = "ADMIN,SOCIO")]
        [HttpGet]
        public IActionResult Get()
        {
            var productos = _context.Productos.ToList(); // SELECT * FROM productos;
            return Ok(productos);
        }
        //POST registrar un producto
        [Authorize(Roles = "ADMIN")]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Producto producto)
        {
            //insert into producto (id,nombre,precio,stock) values(...,...);

            var httpClient = new HttpClient();

            var response = await httpClient.GetAsync($"http://categorias/api/categorias/{producto.CategoriaId}");

            if (!response.IsSuccessStatusCode)
                return BadRequest("la categoria no existe");

            _context.Productos.Add(producto);
            _context.SaveChanges();
            return Ok(producto);
        }
        //PUT
        [Authorize(Roles = "ADMIN")]
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] Producto producto)
        {
            var productoExistente = _context.Productos.Find(id); // Este va a ser el producto encontrado

            if (productoExistente == null)
            {
                return NotFound();
            }

            //Actualizar los campos
            //El dato nombre antiguo  //El dato nombre nuevo
            productoExistente.Nombre = producto.Nombre;
            productoExistente.Precio = producto.Precio;
            productoExistente.Stock = producto.Stock;
            productoExistente.CategoriaId = producto.CategoriaId;

            _context.SaveChanges();
            return Ok(productoExistente);
        }

        //Eliminar producto
        [Authorize(Roles = "ADMIN")]
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var productoExistente = _context.Productos.Find(id);
            if (productoExistente == null)
            {
                return NotFound();
            }

            _context.Productos.Remove(productoExistente);
            _context.SaveChanges();
            return Ok("Producto eliminado");
        }

        [Authorize(Roles = "ADMIN,VENDEDOR,CLIENTE")]
        [HttpGet("{id}")]
        public IActionResult GetOnly(int id)
        {
            var producto = _context.Productos.Find(id);
            if (producto == null)
            {
                return NotFound();
            }
            return Ok(producto);
        }
    }
}