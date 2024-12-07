using Microsoft.EntityFrameworkCore;
using backend; 
using backend.Database;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddDbContext<UserDbContext>(options =>
    options.UseNpgsql(builder.Configuration["Data:DbContext:ConnectionStrings:UserConnectionString"]));

builder.Services.AddDbContext<CredentialDbContext>(options =>
    options.UseNpgsql(builder.Configuration["Data:DbContext:ConnectionStrings:CredentialsConnectionString"]));

builder.Services.AddTransient<UserDbSeeder>();
builder.Services.AddTransient<CredentialDbSeeder>();
builder.Services.AddTransient<Seeder>();
builder.Services.AddScoped<UserDatabaseController>();
builder.Services.AddScoped<CredentialDatabaseController>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var seeder = scope.ServiceProvider.GetRequiredService<Seeder>();
    await seeder.SeedAsync(scope.ServiceProvider);
}

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

