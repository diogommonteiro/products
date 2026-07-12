using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using WebApplication.Models;
using WebApplication.Services;

namespace WebApplication.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController(ProductsService productService, ILogger<ProductsController> logger)
    : ControllerBase
{
    private readonly ProductsService _productsService = productService;
    private readonly ILogger<ProductsController> _logger = logger;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetAll()
    {
        var products = await _productsService.GetAllProducts();
        return Ok(products);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProductDto>> GetById(string id)
    {
        var product = await _productsService.GetById(id);

        if (product is null)
        {
            return NotFound();
        }

        return Ok(product);
    }

    [HttpPost]
    public async Task<ActionResult<ProductDto>> Create(ProductRequest request)
    {
        var product = await _productsService.Create(request);

        return product;
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ProductDto>> Update(string id, ProductRequest request)
    {
        var product = await _productsService.Update(id, request);

        if (product is null)
        {
            return NotFound();
        }

        return Ok(product);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ProductDto>> Delete(string id)
    {
        var product = await _productsService.Delete(id);

        if (product is null)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpPost("{id}/decrement-stock/{quantity:int}")]
    public async Task<ActionResult<ProductDto>> DecrementStock(string id, int quantity)
    {
        var product = await _productsService.DecrementStock(id, quantity);

        if (product is null)
        {
            return NotFound();
        }

        return Ok(product);
    }

    [HttpPost("{id}/add-to-stock/{quantity:int}")]
    public async Task<ActionResult<ProductDto>> AddToStock(string id, int quantity)
    {
        var product = await _productsService.AddToStock(id, quantity);

        if (product is null)
        {
            return NotFound();
        }

        return Ok(product);
    }

    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<ProductDto>>> Search([FromQuery] string name)
    {
        var products = await _productsService.Search(name);

        return Ok(products);
    }

    [HttpGet("stock-level")]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetByStockLevel(
        [FromQuery] int min,
        [FromQuery] int max
    )
    {
        var products = await _productsService.GetByStockLevel(min, max);

        return Ok(products);
    }
}

public class ProductRequest
{
    [Required]
    public int Id { get; set; }

    [Required]
    public string Name { get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "Stock cannot be negative.")]
    public int Stock { get; set; }
}
