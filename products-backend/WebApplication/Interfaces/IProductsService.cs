using WebApplication.Controllers;
using WebApplication.Models;

namespace WebApplication.Interfaces
{
    public interface IProductsService
    {
        Task<IEnumerable<ProductDto>> GetAllProducts();
        Task<ProductDto?> GetById(string id);
        Task<ProductDto> Create(ProductRequest request);
        Task<ProductDto?> Update(string id, ProductRequest request);
        Task<ProductDto?> Delete(string id);
        Task<ProductDto?> AddToStock(string id, int quantity);
        Task<ProductDto?> DecrementStock(string id, int quantity);
        Task<IEnumerable<Product>> Search(string name);
        Task<IEnumerable<Product>> GetByStockLevel(int min, int max);
    }
}
