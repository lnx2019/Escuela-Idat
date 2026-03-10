using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/pacientes")]
public class PacientesController : ControllerBase
{
    public static List<Paciente> pacientes = new();

    [HttpGet]
    public IActionResult ObtenerPacientes()
    {
            return Ok(pacientes);
    }

    [HttpGet("{id}")]
    public IActionResult ObtenerPaciente(int id)
    {
        if(id <= 0 )
        {
            return BadRequest("El id debe ser mayor a 0");
        }
        
        foreach(Paciente p in pacientes)
        {
            if(p.Id == id)
            {
                return Ok(p);
            }
        }
        return NotFound("Paciente no registrado");
    }

    [HttpPost]
    public IActionResult RegistrarPaciente([FromBody] Paciente nuevopaciente)
    {
        if (nuevopaciente == null)
        {
            return BadRequest("Debe enviar los datos del paciente");
        }

        if (pacientes.Count == 0)
            nuevopaciente.Id = 1;
        else
            nuevopaciente.Id = pacientes.Max(p => p.Id) + 1;

        pacientes.Add(nuevopaciente);

        return Created($"api/pacientes/{nuevopaciente.Id}", nuevopaciente);
    }

    [HttpPut("{id}")]
    public IActionResult ActualizarPaciente(int id, [FromBody] Paciente pacienteactualizado)
    {
        if (id <= 0)
            return BadRequest("El id debe ser mayor a 0");

        if (pacienteactualizado == null)
            return BadRequest("Debe enviar los datos del paciente");

        var pacienteexiste = pacientes.FirstOrDefault(p => p.Id == id);

        if (pacienteexiste == null)
            return NotFound("Paciente no encontrado");

        pacienteexiste.nombre = pacienteactualizado.nombre;

        return Ok(pacienteexiste);
    }

    [HttpDelete("{id}")]
    public IActionResult EliminarPaciente(int id)
    {
        if (id <= 0)
            return BadRequest("El id debe ser mayor a 0");

        var paciente = pacientes.FirstOrDefault(p => p.Id == id);

        if (paciente == null)
            return NotFound("Paciente no registrado");

        pacientes.Remove(paciente);

        return Ok("Paciente eliminado correctamente");
    }

}