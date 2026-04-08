using Microsoft.EntityFrameworkCore;
using ApiIdentity.Models;
using ApiProfiles.Models;

namespace ApiProfiles.Data;

public class GimnasioDbContext : DbContext
{
    public GimnasioDbContext(DbContextOptions<GimnasioDbContext> options) : base(options) { }

    public DbSet<Users> Users { get; set; }
    public DbSet<Roles> Roles { get; set; }
    public DbSet<UserRoles> UserRoles { get; set; }
    public DbSet<Socios> Socios { get; set; }
    public DbSet<Entrenadores> Entrenadores { get; set; }
    public DbSet<Asistencias> Asistencias { get; set; }
    public DbSet<Rutinas> Rutinas { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Users>(entity =>
        {
            entity.HasKey(e => e.UserId);
            entity.HasIndex(e => e.UserName).IsUnique();
        });

        modelBuilder.Entity<Roles>(entity =>
        {
            entity.HasKey(e => e.RoleId);
            entity.HasIndex(e => e.Name).IsUnique();
        });

        modelBuilder.Entity<UserRoles>(entity =>
        {
            entity.HasKey(e => new { e.UserId, e.RoleId });
            entity.HasOne(d => d.User).WithMany(p => p.UserRoles).HasForeignKey(d => d.UserId);
            entity.HasOne(d => d.Role).WithMany(p => p.UserRoles).HasForeignKey(d => d.RoleId);
        });

        modelBuilder.Entity<Socios>(entity =>
        {
            entity.HasKey(e => e.SocioId);
            entity.HasIndex(e => e.UserId).IsUnique();
        });

        modelBuilder.Entity<Entrenadores>(entity =>
        {
            entity.HasKey(e => e.EntrenadorId);
            entity.HasIndex(e => e.UserId).IsUnique();
        });

        modelBuilder.Entity<Asistencias>(entity =>
        {
            entity.HasKey(e => e.AsistenciaId);
            entity.HasOne(d => d.Socio).WithMany(p => p.Asistencias).HasForeignKey(d => d.SocioId);
        });

        modelBuilder.Entity<Rutinas>(entity =>
        {
            entity.HasKey(e => e.RutinaId);
            entity.HasOne(d => d.Socio).WithMany(p => p.Rutinas).HasForeignKey(d => d.SocioId);
            entity.HasOne(d => d.Entrenador).WithMany(p => p.Rutinas).HasForeignKey(d => d.EntrenadorId);
        });
    }
}
