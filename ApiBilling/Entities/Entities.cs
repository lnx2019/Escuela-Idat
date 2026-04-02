using System;
using System.Collections.Generic;

namespace ApiBilling.Entities;

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
    public DateTime FechaRegistro { get; set; }
    public bool IsActive { get; set; }

    public virtual Users User { get; set; } = null!;
    public virtual ICollection<SocioMembresia> SocioMembresia { get; set; } = new List<SocioMembresia>();
}

public partial class Users
{
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string NormalizedUserName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string NormalizedEmail { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public bool IsActive { get; set; }
    public DateTime? LastLoginAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public virtual Socios? Socios { get; set; }
    public virtual Entrenadores? Entrenadores { get; set; }
}

public partial class Entrenadores
{
    public int EntrenadorId { get; set; }
    public int UserId { get; set; }
    public string? Especialidad { get; set; }
    public string? Certificaciones { get; set; }
    public DateTime FechaIngreso { get; set; }
    public bool IsActive { get; set; }

    public virtual Users User { get; set; } = null!;
}

public partial class Membresias
{
    public int MembresiaId { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public int DuracionDias { get; set; }
    public decimal Precio { get; set; }
    public bool EsRenovable { get; set; } = true;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public virtual ICollection<SocioMembresia> SocioMembresia { get; set; } = new List<SocioMembresia>();
}

public partial class SocioMembresia
{
    public int SocioMembresiaId { get; set; }
    public int SocioId { get; set; }
    public int MembresiaId { get; set; }
    public DateTime FechaInicio { get; set; }
    public DateTime FechaFin { get; set; }
    public string Estado { get; set; } = string.Empty;
    public decimal MontoPagado { get; set; }
    public string? Notas { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public virtual Socios Socio { get; set; } = null!;
    public virtual Membresias Membresia { get; set; } = null!;
}
