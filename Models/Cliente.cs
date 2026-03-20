using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace ApiProductosEF.Models
{
    public class Cliente
    {
        public int Id { get; set; }

        [MaxLength(200)]
        public string Nombre { get; set; }

        [MaxLength(200)]
        public string Apellido { get; set; }

        public int Edad { get; set; }
    }
}