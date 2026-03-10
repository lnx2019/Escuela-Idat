using System.ComponentModel.DataAnnotations;

public class Medico
{
    public int Id { get; set; }

    [Required(ErrorMessage = "El nombre del médico es obligatorio")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "El nombre debe tener entre 3 y 100 caracteres")]
    [RegularExpression(@"^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$", ErrorMessage = "El nombre solo debe contener letras")]
    public string nombre { get; set; } = string.Empty;

    [Required(ErrorMessage = "La especialidad es obligatoria")]
    [StringLength(80, MinimumLength = 3, ErrorMessage = "La especialidad debe tener entre 3 y 80 caracteres")]
    [RegularExpression(@"^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$", ErrorMessage = "La especialidad solo debe contener letras")]
    public string Especialidad { get; set; } = string.Empty;

    [Required(ErrorMessage = "El CMP es obligatorio")]
    [RegularExpression(@"^[0-9]{5,7}$", ErrorMessage = "El CMP debe contener entre 5 y 7 números")]
    public string CMP { get; set; } = string.Empty;

    [Required(ErrorMessage = "El teléfono es obligatorio")]
    [Phone(ErrorMessage = "El teléfono no tiene un formato válido")]
    [StringLength(15, MinimumLength = 7, ErrorMessage = "El teléfono debe tener entre 7 y 15 caracteres")]
    public string Telefono { get; set; } = string.Empty;

    [EmailAddress(ErrorMessage = "El correo no tiene un formato válido")]
    public string Email { get; set; } = string.Empty;

}