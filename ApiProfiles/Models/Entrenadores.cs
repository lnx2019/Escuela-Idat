using System;
using System.Collections.Generic;
using ApiIdentity.Models;

namespace ApiProfiles.Models;

public class Entrenadores
{
    public int EntrenadorId { get; set; }
    public int UserId { get; set; }
    public string? Especialidad { get; set; }
    public string? Certificaciones { get; set; }
    public DateTime FechaIngreso { get; set; } = DateTime.Now;
    public bool IsActive { get; set; } = true;

    public virtual Users User { get; set; } = null!;
    public virtual ICollection<Rutinas> Rutinas { get; set; } = new List<Rutinas>();
    public virtual ICollection<SocioEntrenador> SocioEntrenador { get; set; } = new List<SocioEntrenador>();
}
