using System.ComponentModel.DataAnnotations;

public class Paciente
{
    public int Id { get; set; }

    [Required(ErrorMessage = "El nombre del paciente es obligatorio")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "El nombre debe tener entre 3 y 100 caracteres")]
    [RegularExpression(@"^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$", ErrorMessage = "El nombre solo debe contener letras")]
    public string nombre { get; set; } = string.Empty;

    [Required(ErrorMessage = "El DNI es obligatorio")]
    [RegularExpression(@"^[0-9]{8}$", ErrorMessage = "El DNI debe tener 8 dígitos")]
    public string DNI { get; set; } = string.Empty;

    [Required(ErrorMessage = "El teléfono es obligatorio")]
    [Phone(ErrorMessage = "El teléfono no tiene un formato válido")]
    [StringLength(15, MinimumLength = 7, ErrorMessage = "El teléfono debe tener entre 7 y 15 caracteres")]
    public string Telefono { get; set; } = string.Empty;

    [Required(ErrorMessage = "La fecha de nacimiento es obligatoria")]
    [DataType(DataType.Date)]
    public DateTime FechaNacimiento { get; set; }

    [Required(ErrorMessage = "La dirección es obligatoria")]
    [StringLength(150, MinimumLength = 5, ErrorMessage = "La dirección debe tener entre 5 y 150 caracteres")]
    public string Direccion { get; set; } = string.Empty;
}