using System;
using System.Collections.Generic;

namespace ApiProfiles.Models;

public class Rutinas
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
