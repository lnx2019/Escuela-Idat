using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/medicos")]
public class MedicosController : ControllerBase
{
    public static List<Medico> medicos = new();

    [HttpGet]
    public IActionResult ObtenerMedicos()
    {
        return Ok(medicos);
    }

    [HttpGet("{id}")]
    public IActionResult ObtenerMedico(int id)
    {
        if(id <= 0 )
        {
            return BadRequest("El id debe ser mayor a 0");
        }
        
        foreach(Medico m in medicos)
        {
            if(m.Id == id)
            {
                return Ok(m);
            }
        }
        return NotFound("Medico no registrado");
    }

    [HttpPost]
    public IActionResult RegistrarPaciente([FromBody] Medico nuevomedico)
    {
        if (nuevomedico == null)
        {
            return BadRequest("Debe enviar los datos del paciente");
        }

        if (medicos.Count == 0)
            nuevomedico.Id = 1;
        else
            nuevomedico.Id = medicos.Max(m => m.Id) + 1;

        medicos.Add(nuevomedico);

        return Created($"api/pacientes/{nuevomedico.Id}", nuevomedico);
    }

    [HttpPut("{id}")]
    public IActionResult ActualizarMedicos(int id, [FromBody] Medico medicoactualizado)
    {
        if (id <= 0)
            return BadRequest("El id debe ser mayor a 0");

        if (medicoactualizado == null)
            return BadRequest("Debe enviar los datos del Medico");

        var medicoexiste = medicos.FirstOrDefault(m => m.Id == id);

        if (medicoexiste == null)
            return NotFound("Medico no encontrado");

        medicoexiste.nombre = medicoactualizado.nombre;

        return Ok(medicoactualizado);
    }

    [HttpDelete("{id}")]
    public IActionResult EliminarMedicos(int id)
    {
        if (id <= 0)
            return BadRequest("El id debe ser mayor a 0");

        var medico = medicos.FirstOrDefault(m => m.Id == id);

        if (medico == null)
            return NotFound("Medico no registrado");

        medicos.Remove(medico);

        return Ok("Medico eliminado correctamente");
    }

}
