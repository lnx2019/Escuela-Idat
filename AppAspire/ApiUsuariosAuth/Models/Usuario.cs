using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace ApiUsuariosEF.Models
{
using System;

    public class Usuario
        {
            public int Id { get; set; }
            public string Username { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
            public string Rol { get; set; } = string.Empty; // ADMIN, VENDROR, CLIENTE
        }
}