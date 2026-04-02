using System;
using ApiWorkouts.Models;

namespace ApiProfiles.Models;

public class RutinaEjercicios
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
