using Microsoft.EntityFrameworkCore;
using ApiIdentity.Models;
using ApiWorkouts.Models;

namespace ApiWorkouts.Data;

public class GimnasioDbContext : DbContext
{
    public GimnasioDbContext(DbContextOptions<GimnasioDbContext> options) : base(options) { }

    public DbSet<Users> Users { get; set; }
    public DbSet<Ejercicios> Ejercicios { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Users>(entity => { entity.HasKey(e => e.UserId); entity.HasIndex(e => e.UserName).IsUnique(); });
        modelBuilder.Entity<Ejercicios>(entity => { entity.HasKey(e => e.EjercicioId); entity.HasIndex(e => e.Nombre).IsUnique(); });
    }
}
