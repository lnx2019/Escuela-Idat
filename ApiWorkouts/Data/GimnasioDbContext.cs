using Microsoft.EntityFrameworkCore;
using ApiWorkouts.Models;

namespace ApiWorkouts.Data;

public class GimnasioDbContext : DbContext
{
    public GimnasioDbContext(DbContextOptions<GimnasioDbContext> options) : base(options) { }

    public DbSet<Ejercicios> Ejercicios { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Ejercicios>(entity => 
        { 
            entity.HasKey(e => e.EjercicioId); 
            entity.HasIndex(e => e.Nombre).IsUnique(); 
        });
    }
}