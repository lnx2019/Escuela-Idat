using Microsoft.AspNetCore.Mvc;
using ApiCategoriasEF.Data;
using ApiCategoriasEF.Models;

namespace ApiCategoriasEF.Controllers
{
    [ApiController]
    [Route("api/categorias")]
    public class CategoriaController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoriaController(AppDbContext context)
        {
            _context = context;
        }
        //GET obtener todos los categorias
        [HttpGet]
        public IActionResult Get()
        {
            var categorias = _context.Categorias.ToList(); // SELECT * FROM categoria;
            return Ok(categorias);
        }

        //POST registrar una categoria
        [HttpPost]
        public IActionResult Post([FromBody] Categoria categoria)
        {
            _context.Categorias.Add(categoria);
            _context.SaveChanges();
            return Ok(categoria);
        }

        [HttpGet("{id}")]
        public IActionResult GetOnly(int id)
        {
            var categoria = _context.Categorias.Find(id);
            if (categoria == null)
            {
                return NotFound();
            }
            return Ok(categoria);
        }

    }
}