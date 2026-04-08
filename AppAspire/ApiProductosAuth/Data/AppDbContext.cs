using Microsoft.EntityFrameworkCore;
using ApiProductosEF.Models;

namespace ApiProductosEF.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<Producto> Productos {get; set;}

    }
}