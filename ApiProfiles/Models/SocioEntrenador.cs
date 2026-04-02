using System;

namespace ApiProfiles.Models;

public class SocioEntrenador
{
    public int SocioId { get; set; }
    public int EntrenadorId { get; set; }
    public DateTime FechaAsignacion { get; set; } = DateTime.Now;
    public bool Activo { get; set; } = true;

    public virtual Socios Socio { get; set; } = null!;
    public virtual Entrenadores Entrenador { get; set; } = null!;
}
