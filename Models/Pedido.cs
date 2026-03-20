using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace ApiProductosEF.Models
{
using System;

    public class Pedido
    {
        public int Id { get; set; }

        public int Numero { get; set; }

        public DateTime Fecha { get; set; }

        public string Estado { get; set; }
    }
}