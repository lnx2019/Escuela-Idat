using Microsoft.EntityFrameworkCore;
using ApiCategoriasEF.Models;

namespace ApiCategoriasEF.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<Categoria> Categorias {get; set;}
    }
}