using ApiProductosEF.Data;
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

var app = builder.Build();
app.UseAuthentication(); // AUTORIZACIÓN
app.UseAuthorization(); // AUTORIZACIÓN
app.MapControllers();

app.Run();
