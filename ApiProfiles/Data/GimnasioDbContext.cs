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
    public DbSet<SocioEntrenador> SocioEntrenador { get; set; }
    public DbSet<Asistencias> Asistencias { get; set; }
    public DbSet<Rutinas> Rutinas { get; set; }
    public DbSet<RutinaEjercicios> RutinaEjercicios { get; set; }
    public DbSet<SocioMembresia> SocioMembresia { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Tablas de ApiIdentity — solo lectura, no crear en migraciones
        modelBuilder.Entity<Users>(entity =>
        {
            entity.HasKey(e => e.UserId);
            entity.ToTable("Users", tb => tb.ExcludeFromMigrations());
        });

        modelBuilder.Entity<Roles>(entity =>
        {
            entity.HasKey(e => e.RoleId);
            entity.ToTable("Roles", tb => tb.ExcludeFromMigrations());
        });

        modelBuilder.Entity<UserRoles>(entity =>
        {
            entity.HasKey(e => new { e.UserId, e.RoleId });
            entity.HasOne(d => d.User).WithMany(p => p.UserRoles).HasForeignKey(d => d.UserId);
            entity.HasOne(d => d.Role).WithMany(p => p.UserRoles).HasForeignKey(d => d.RoleId);
            entity.ToTable("UserRoles", tb => tb.ExcludeFromMigrations());
        });

        // Tabla de ApiWorkouts — solo lectura, no crear en migraciones
        modelBuilder.Entity<ApiWorkouts.Models.Ejercicios>(entity =>
        {
            entity.HasKey(e => e.EjercicioId);
            entity.ToTable("Ejercicios", tb => tb.ExcludeFromMigrations());
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

        modelBuilder.Entity<SocioEntrenador>(entity =>
        {
            entity.HasKey(e => new { e.SocioId, e.EntrenadorId });
            entity.HasOne(d => d.Socio).WithMany(p => p.SocioEntrenador).HasForeignKey(d => d.SocioId).OnDelete(DeleteBehavior.NoAction);
            entity.HasOne(d => d.Entrenador).WithMany(p => p.SocioEntrenador).HasForeignKey(d => d.EntrenadorId).OnDelete(DeleteBehavior.NoAction);
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

        modelBuilder.Entity<RutinaEjercicios>(entity =>
        {
            entity.HasKey(e => new { e.RutinaId, e.EjercicioId });
            entity.HasOne(d => d.Rutina).WithMany(p => p.RutinaEjercicios).HasForeignKey(d => d.RutinaId);
            entity.HasOne(d => d.Ejercicio).WithMany().HasForeignKey(d => d.EjercicioId);
        });

        modelBuilder.Entity<SocioMembresia>(entity =>
        {
            entity.HasKey(e => e.SocioMembresiaId);
            entity.HasOne(d => d.Socio).WithMany(p => p.SocioMembresia).HasForeignKey(d => d.SocioId);
        });
    }
}
