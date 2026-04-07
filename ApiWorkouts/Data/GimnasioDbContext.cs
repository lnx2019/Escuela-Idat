using Microsoft.EntityFrameworkCore;
using ApiIdentity.Models;
using ApiWorkouts.Models;

namespace ApiWorkouts.Data;

public class GimnasioDbContext : DbContext
{
    public GimnasioDbContext(DbContextOptions<GimnasioDbContext> options) : base(options) { }

    public DbSet<Users> Users { get; set; }
    public DbSet<Roles> Roles { get; set; }
    public DbSet<UserRoles> UserRoles { get; set; }
    public DbSet<Ejercicios> Ejercicios { get; set; }

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
            entity.ToTable("UserRoles", tb => tb.ExcludeFromMigrations());
        });

        modelBuilder.Entity<Ejercicios>(entity =>
        {
            entity.HasKey(e => e.EjercicioId);
            entity.HasIndex(e => e.Nombre).IsUnique();
        });
    }
}
