using System;

namespace ApiProfiles.Models;

public class SocioMembresia
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
}
