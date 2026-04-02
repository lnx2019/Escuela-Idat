using System;
using ApiIdentity.Models;

namespace ApiProfiles.Models;

public class Asistencias
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
