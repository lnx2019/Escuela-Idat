using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace ApiProductosEF.Models
{
    public class Producto
    {
        public int Id { get; set; }

        [MaxLength(200)]
        public string Nombre { get; set; }

        [Precision(10, 2)]
        public decimal Precio { get; set; }

        public int Stock { get; set; }
    }
}