using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/citas")]
public class CitasController : ControllerBase
{
    public static List<Cita> citas = new();

    [HttpGet]
    public IActionResult ObtenerCitas()
    {
        return Ok(citas);
    }

    [HttpGet("{id}")]
    public IActionResult ObtenerCita(int id)
    {
            if(id <= 0 )
            {
                return BadRequest("El id debe ser mayor a 0");
            }
            
            foreach(Cita c in citas)
            {
                if(c.Id == id)
                {
                    return Ok(c);
                }
            }
            return NotFound("Cita no registrada");
    }

    [HttpPost]
    public IActionResult RegistrarCitas([FromBody] Cita nuevacita)
    {
        var paciente = PacientesController.pacientes
            .FirstOrDefault(p => p.Id == nuevacita.PacienteId);

        if (paciente == null)
            return BadRequest("Paciente no existe");

        var medico = MedicosController.medicos
            .FirstOrDefault(m => m.Id == nuevacita.MedicoId);

        if (medico == null)
            return BadRequest("Medico no existe");

        if (nuevacita == null)
        {
            return BadRequest("Debe enviar los datos para la Cita");
        }
        if (citas.Count == 0)
            nuevacita.Id = 1;
        else
            nuevacita.Id = citas.Max(m => m.Id) + 1;

        nuevacita.FechaHora = DateTime.Now;
        citas.Add(nuevacita);

        return Created($"api/citas/{nuevacita.Id}", nuevacita);
    }

    [HttpPut("{id}")]
    public IActionResult ActualizarCitas(int id, [FromBody] Cita citaactualizada)
    {
        if (id <= 0)
            return BadRequest("El id debe ser mayor a 0");

        if (citaactualizada == null)
            return BadRequest("Debe enviar los datos para la cita");

        var citaexiste = citas.FirstOrDefault(c => c.Id == id);

        if (citaexiste == null)
            return NotFound("Cita no encontrada");

        var paciente = PacientesController.pacientes
            .FirstOrDefault(p => p.Id == citaactualizada.PacienteId);

        if (paciente == null)
            return BadRequest("Paciente no existe");

        var medico = MedicosController.medicos
            .FirstOrDefault(m => m.Id == citaactualizada.MedicoId);

        if (medico == null)
            return BadRequest("Medico no existe");

        citaexiste.PacienteId = citaactualizada.PacienteId;
        citaexiste.MedicoId = citaactualizada.MedicoId;
        citaexiste.FechaHora = citaactualizada.FechaHora;
        citaexiste.DuracionMinutos = citaactualizada.DuracionMinutos;
        citaexiste.Estado = citaactualizada.Estado;
        citaexiste.Motivo = citaactualizada.Motivo;
        citaexiste.Observaciones = citaactualizada.Observaciones;
        return Ok(citaexiste);
    }
    
    [HttpDelete("{id}")]
    public IActionResult EliminarCitas(int id)
    {
        if (id <= 0)
            return BadRequest("El id debe ser mayor a 0");

        var cita = citas.FirstOrDefault(c => c.Id == id);

        if (cita == null)
            return NotFound("Cita no registrado");

        citas.Remove(cita);

        return Ok("Cita eliminada correctamente");
    }

}