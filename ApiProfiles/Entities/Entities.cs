using System;
using System.Collections.Generic;

namespace ApiProfiles.Entities;

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
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public virtual Socios? Socios { get; set; }
    public virtual Entrenadores? Entrenadores { get; set; }
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
    public DateTime FechaRegistro { get; set; }
    public bool IsActive { get; set; } = true;

    public virtual Users User { get; set; } = null!;
    public virtual ICollection<Asistencias> Asistencias { get; set; } = new List<Asistencias>();
    public virtual ICollection<Rutinas> Rutinas { get; set; } = new List<Rutinas>();
    public virtual ICollection<SocioEntrenador> SocioEntrenador { get; set; } = new List<SocioEntrenador>();
    public virtual ICollection<SocioMembresia> SocioMembresia { get; set; } = new List<SocioMembresia>();
}

public partial class Entrenadores
{
    public int EntrenadorId { get; set; }
    public int UserId { get; set; }
    public string? Especialidad { get; set; }
    public string? Certificaciones { get; set; }
    public DateTime FechaIngreso { get; set; }
    public bool IsActive { get; set; } = true;

    public virtual Users User { get; set; } = null!;
    public virtual ICollection<Rutinas> Rutinas { get; set; } = new List<Rutinas>();
    public virtual ICollection<SocioEntrenador> SocioEntrenador { get; set; } = new List<SocioEntrenador>();
}

public partial class SocioEntrenador
{
    public int SocioId { get; set; }
    public int EntrenadorId { get; set; }
    public DateTime FechaAsignacion { get; set; }
    public bool Activo { get; set; } = true;

    public virtual Socios Socio { get; set; } = null!;
    public virtual Entrenadores Entrenador { get; set; } = null!;
}

public partial class Asistencias
{
    public int AsistenciaId { get; set; }
    public int SocioId { get; set; }
    public DateTime FechaHoraEntrada { get; set; }
    public DateTime? FechaHoraSalida { get; set; }
    public string? Observaciones { get; set; }
    public int? RegistradaPorUserId { get; set; }

    public virtual Socios Socio { get; set; } = null!;
    public virtual Users? RegistradaPorUser { get; set; }
}

public partial class Rutinas
{
    public int RutinaId { get; set; }
    public int SocioId { get; set; }
    public int? EntrenadorId { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string? Objetivo { get; set; }
    public DateTime FechaInicio { get; set; }
    public DateTime? FechaFin { get; set; }
    public bool Activa { get; set; } = true;
    public DateTime CreatedAt { get; set; }

    public virtual Socios Socio { get; set; } = null!;
    public virtual Entrenadores? Entrenador { get; set; }
    public virtual ICollection<RutinaEjercicios> RutinaEjercicios { get; set; } = new List<RutinaEjercicios>();
}

public partial class RutinaEjercicios
{
    public int RutinaId { get; set; }
    public int EjercicioId { get; set; }
    public int Orden { get; set; }
    public int? Series { get; set; }
    public int? Repeticiones { get; set; }
    public decimal? PesoObjetivoKg { get; set; }
    public int? DuracionSegundos { get; set; }
    public int? DescansoSegundos { get; set; }
    public string? Notas { get; set; }

    public virtual Rutinas Rutina { get; set; } = null!;
    public virtual Ejercicios Ejercicio { get; set; } = null!;
}

public partial class Ejercicios
{
    public int EjercicioId { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public string? GrupoMuscular { get; set; }
    public bool IsActive { get; set; } = true;

    public virtual ICollection<RutinaEjercicios> RutinaEjercicios { get; set; } = new List<RutinaEjercicios>();
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
    public DateTime CreatedAt { get; set; }

    public virtual Socios Socio { get; set; } = null!;
    public virtual Membresias Membresia { get; set; } = null!;
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
    public DateTime CreatedAt { get; set; }

    public virtual ICollection<SocioMembresia> SocioMembresia { get; set; } = new List<SocioMembresia>();
}
