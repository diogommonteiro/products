using Microsoft.EntityFrameworkCore;
using WebApplication.Controllers;
using WebApplication.Interfaces;
using WebApplication.Models;

namespace WebApplication.Services;

public class ProductsService(ApplicationDbContext context) : IProductsService
{
    private readonly ApplicationDbContext _context = context;

    public async Task<IEnumerable<ProductDto>> GetAllProducts()
    {
        return await _context
            .Products.OrderBy(product => product.Name)
            .Select(product => new ProductDto()
            {
                Id = product.Id,
                Name = product.Name,
                Stock = product.Stock,
            })
            .ToListAsync();
    }

    public async Task<ProductDto?> GetById(string id)
    {
        if (String.IsNullOrEmpty(id))
        {
            throw new ArgumentException("Product ID cannot be null or empty.");
        }

        var product = await _context.Products.FindAsync(id);

        if (product is null)
        {
            return null;
        }

        return new ProductDto()
        {
            Id = product.Id,
            Name = product.Name,
            Stock = product.Stock,
        };
    }

    public async Task<ProductDto> Create(ProductRequest request)
    {
        var name = request.Name.Trim();
        await ValidateProductNameAsync(name);

        var product = new Product()
        {
            Id = GenerateProductId(),
            Name = name,
            Stock = request.Stock,
            CreatedAt = DateTime.UtcNow,
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return new ProductDto()
        {
            Id = product.Id,
            Name = product.Name,
            Stock = product.Stock,
        };
    }

    public async Task<ProductDto?> Update(string id, ProductRequest request)
    {
        if (String.IsNullOrEmpty(id))
        {
            throw new ArgumentException("Product ID cannot be null or empty.");
        }

        var product = await _context.Products.FindAsync(id);

        if (product is null)
        {
            return null;
        }

        var name = request.Name.Trim();
        if (!product.Name.Equals(name, StringComparison.InvariantCultureIgnoreCase))
        {
            await ValidateProductNameAsync(name);
        }

        product.Name = name;
        product.Stock = request.Stock;
        product.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return new ProductDto()
        {
            Id = product.Id,
            Name = product.Name,
            Stock = product.Stock,
        };
    }

    public async Task<ProductDto?> Delete(string id)
    {
        if (String.IsNullOrEmpty(id))
        {
            throw new ArgumentException("Product ID cannot be null or empty.");
        }

        var product = await _context.Products.FindAsync(id);

        if (product is null)
        {
            return null;
        }

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();

        return new ProductDto()
        {
            Id = product.Id,
            Name = product.Name,
            Stock = product.Stock,
        };
    }

    public async Task<ProductDto?> AddToStock(string id, int quantity)
    {
        if (String.IsNullOrEmpty(id))
        {
            throw new ArgumentException("Product ID cannot be null or empty.");
        }

        if (quantity <= 0)
        {
            throw new ArgumentException("Quantity to decrement must be greater than zero.");
        }

        var product = await _context.Products.FindAsync(id);

        if (product is null)
        {
            return null;
        }

        product.Stock += quantity;
        product.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return new ProductDto()
        {
            Id = product.Id,
            Name = product.Name,
            Stock = product.Stock,
        };
    }

    public async Task<ProductDto?> DecrementStock(string id, int quantity)
    {
        if (String.IsNullOrEmpty(id))
        {
            throw new ArgumentException("Product ID cannot be null or empty.");
        }

        if (quantity <= 0)
        {
            throw new ArgumentException("Quantity to decrement must be greater than zero.");
        }

        var product = await _context.Products.FindAsync(id);

        if (product is null)
        {
            return null;
        }

        if (product.Stock < quantity)
        {
            throw new InvalidOperationException("Insufficient stock to decrement.");
        }

        product.Stock -= quantity;
        product.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return new ProductDto()
        {
            Id = product.Id,
            Name = product.Name,
            Stock = product.Stock,
        };
    }

    public async Task<IEnumerable<Product>> Search(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            return [];
        }

        name = name.Trim();

        return await _context.Products.Where(product => product.Name.Contains(name)).ToListAsync();
    }

    public async Task<IEnumerable<Product>> GetByStockLevel(int min, int max)
    {
        if (min < 0)
        {
            throw new ArgumentException("Minimum stock cannot be negative.");
        }

        if (max < min)
        {
            throw new ArgumentException("Maximum stock must be greater than minimum stock.");
        }

        return await _context
            .Products.Where(product => product.Stock >= min && product.Stock <= max)
            .OrderBy(product => product.Stock)
            .ToListAsync();
    }

    private async Task ValidateProductNameAsync(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException("Product name cannot be empty.");
        }

        var alreadyExists = await _context.Products.AnyAsync(product =>
            product.Name.ToLower() == name.ToLower()
        );

        if (alreadyExists)
        {
            throw new InvalidOperationException("A product with the same name already exists.");
        }
    }

    private static string GenerateProductId()
    {
        // Guid ensures no collision for a distributed environment with multiple instances
        return Guid.NewGuid().ToString();
    }
}
