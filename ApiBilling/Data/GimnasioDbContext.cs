using Microsoft.EntityFrameworkCore;
using ApiBilling.Models;

namespace ApiBilling.Data;

public class GimnasioDbContext : DbContext
{
    public GimnasioDbContext(DbContextOptions<GimnasioDbContext> options) : base(options) { }

    public DbSet<Membresias> Membresias { get; set; }
    public DbSet<SocioMembresia> SocioMembresia { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Membresias>(entity => 
        { 
            entity.HasKey(e => e.MembresiaId); 
            entity.HasIndex(e => e.Nombre).IsUnique(); 
        });
        
        modelBuilder.Entity<SocioMembresia>(entity =>
        {
            entity.HasKey(e => e.SocioMembresiaId);
        });
    }
}
