using System;
using System.Collections.Generic;
using ApiIdentity.Models;

namespace ApiProfiles.Models;

public class Socios
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
    public virtual ICollection<Asistencias> Asistencias { get; set; } = new List<Asistencias>();
    public virtual ICollection<Rutinas> Rutinas { get; set; } = new List<Rutinas>();
}
