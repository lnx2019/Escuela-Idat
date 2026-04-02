using ApiPedidosEF.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// 🔹 DB
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddHttpClient();

builder.Services.AddControllers();


// 🔐 👉 AQUÍ VA JWT (ANTES de builder.Build())
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = "velrob-auth",
            ValidAudience = "velrob-api",
            IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes("ESTA_ES_UNA_CLAVE_SUPER_SECRETA_123456"))
        };
    });

builder.Services.AddAuthorization();


// 🔥 BUILD
var app = builder.Build();


// 🔐 👉 ESTO VA DESPUÉS de Build (orden IMPORTANTE)
app.UseAuthentication();
app.UseAuthorization();


app.MapControllers();

app.Run();
