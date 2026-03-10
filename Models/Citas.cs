using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

public enum EstadoCita
{
    Programada,
    Confirmada,
    Cancelada,
    Atendida
}

public class Cita
{
    public int Id { get; set; }

    [Required(ErrorMessage = "El PacienteId es obligatorio")]
    [Range(1, int.MaxValue, ErrorMessage = "El PacienteId debe ser mayor a 0")]
    public int PacienteId { get; set; }

    [Required(ErrorMessage = "El MedicoId es obligatorio")]
    [Range(1, int.MaxValue, ErrorMessage = "El MedicoId debe ser mayor a 0")]
    public int MedicoId { get; set; }

    [Required(ErrorMessage = "La fecha y hora de la cita es obligatoria")]
    [DataType(DataType.DateTime)]
    public DateTime FechaHora { get; set; }

    [Required(ErrorMessage = "La duración de la cita es obligatoria")]
    [Range(10, 240, ErrorMessage = "La duración debe estar entre 10 y 240 minutos")]
    public int DuracionMinutos { get; set; }

    [Required(ErrorMessage = "El estado de la cita es obligatorio")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public EstadoCita Estado { get; set; } = EstadoCita.Programada;

    [StringLength(200, ErrorMessage = "El motivo no debe superar 200 caracteres")]
    public string Motivo { get; set; } = string.Empty;

    [StringLength(500, ErrorMessage = "Las observaciones no deben superar 500 caracteres")]
    public string Observaciones { get; set; } = string.Empty;

    public DateTime FechaCreacion { get; set; } = DateTime.Now;
}