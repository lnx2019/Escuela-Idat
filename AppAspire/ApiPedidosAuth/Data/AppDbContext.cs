using Microsoft.EntityFrameworkCore;
using ApiPedidosEF.Models;

namespace ApiPedidosEF.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions <AppDbContext> options ) : base(options)
        {
        }
        public DbSet<Pedido> Pedidos {get;set;}
    }

}