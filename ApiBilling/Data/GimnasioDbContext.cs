using Microsoft.EntityFrameworkCore;
using ApiIdentity.Models;
using ApiBilling.Models;

namespace ApiBilling.Data;

public class GimnasioDbContext : DbContext
{
    public GimnasioDbContext(DbContextOptions<GimnasioDbContext> options) : base(options) { }

    public DbSet<Users> Users { get; set; }
    public DbSet<Membresias> Membresias { get; set; }
    public DbSet<SocioMembresia> SocioMembresia { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Users>(entity => { entity.HasKey(e => e.UserId); entity.HasIndex(e => e.UserName).IsUnique(); });
        modelBuilder.Entity<Membresias>(entity => { entity.HasKey(e => e.MembresiaId); entity.HasIndex(e => e.Nombre).IsUnique(); });
        modelBuilder.Entity<SocioMembresia>(entity => { entity.HasKey(e => e.SocioMembresiaId); entity.HasOne(d => d.Membresia).WithMany(p => p.SocioMembresia).HasForeignKey(d => d.MembresiaId); });
    }
}
