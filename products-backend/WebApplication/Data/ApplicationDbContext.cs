using Microsoft.EntityFrameworkCore;
using WebApplication.Models;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : DbContext(options)
{
    public DbSet<Product> Products => Set<Product>();
}
