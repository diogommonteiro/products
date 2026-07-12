using Microsoft.EntityFrameworkCore;
using WebApplication.Models;

public static class DbSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        if (await context.Products.AnyAsync())
            return;

        var products = new List<Product>
        {
            new()
            {
                Id = Guid.NewGuid().ToString(),
                Name = "Laptop",
                Stock = 12,
            },
            new()
            {
                Id = Guid.NewGuid().ToString(),
                Name = "Keyboard",
                Stock = 35,
            },
            new()
            {
                Id = Guid.NewGuid().ToString(),
                Name = "Mouse",
                Stock = 50,
            },
            new()
            {
                Id = Guid.NewGuid().ToString(),
                Name = "Monitor",
                Stock = 8,
            },
        };

        context.Products.AddRange(products);

        await context.SaveChangesAsync();
    }
}
