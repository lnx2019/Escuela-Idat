using System;
using System.Collections.Generic;

namespace ApiIdentity.Entities;

public partial class Users
{
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string NormalizedUserName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string NormalizedEmail { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime? LastLoginAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<UserRoles> UserRoles { get; set; } = new List<UserRoles>();
    public virtual Socios? Socios { get; set; }
    public virtual Entrenadores? Entrenadores { get; set; }
}

public partial class Roles
{
    public int RoleId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string NormalizedName { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public virtual ICollection<UserRoles> UserRoles { get; set; } = new List<UserRoles>();
}

public partial class UserRoles
{
    public int UserId { get; set; }
    public int RoleId { get; set; }
    public DateTime AssignedAt { get; set; } = DateTime.Now;

    public virtual Users User { get; set; } = null!;
    public virtual Roles Role { get; set; } = null!;
}

public partial class Socios
{
    public int SocioId { get; set; }
    public int UserId { get; set; }
    public DateTime? FechaNacimiento { get; set; }
    public string? Genero { get; set; }
    public decimal? AlturaCm { get; set; }
    public decimal? PesoKg { get; set; }
    public string? EmergenciaNombre { get; set; }
    public string? EmergenciaTelefono { get; set; }
    public DateTime FechaRegistro { get; set; } = DateTime.Now;
    public bool IsActive { get; set; } = true;

    public virtual Users User { get; set; } = null!;
}

public partial class Entrenadores
{
    public int EntrenadorId { get; set; }
    public int UserId { get; set; }
    public string? Especialidad { get; set; }
    public string? Certificaciones { get; set; }
    public DateTime FechaIngreso { get; set; } = DateTime.Now;
    public bool IsActive { get; set; } = true;

    public virtual Users User { get; set; } = null!;
}
