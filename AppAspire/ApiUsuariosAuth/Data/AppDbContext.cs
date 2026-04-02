using Microsoft.EntityFrameworkCore;
using ApiUsuariosEF.Models;

namespace ApiUsuariosEF.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<Usuario> Usuarios { get; set; }
    }
}