using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace ApiCategoriasEF.Models
{
    public class Categoria
    {
        public int Id { get; set; }
        [MaxLength(200)]
        public string Nombre { get; set; } = "";
    }
}