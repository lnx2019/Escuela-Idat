var builder = DistributedApplication.CreateBuilder(args);

var categorias = builder.AddProject<Projects.ApicategoriasEF>("categorias");
var clientes = builder.AddProject<Projects.ApiClientesEF>("clientes");
var pedidos = builder.AddProject<Projects.ApiPedidosEF>("pedidos");
var productos = builder.AddProject<Projects.ApiProductosEF>("productos");
var usuarios = builder.AddProject<Projects.ApiUsuariosEF>("usuarios");

builder.Build().Run();