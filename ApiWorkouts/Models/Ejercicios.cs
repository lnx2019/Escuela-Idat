using System;
using System.Collections.Generic;

namespace ApiWorkouts.Models;

public class Ejercicios
{
    public int EjercicioId { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public string? GrupoMuscular { get; set; }
    public bool IsActive { get; set; } = true;
}
