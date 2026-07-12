using System.Text.Json;

namespace WebApplication.Middleware;

public sealed class BadRequestExceptionMiddleware(RequestDelegate next)
{
    private readonly RequestDelegate _next = next;

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            if (context.Response.HasStarted)
            {
                throw;
            }

            context.Response.StatusCode = StatusCodes.Status400BadRequest;
            context.Response.ContentType = "application/json";

            var response = JsonSerializer.Serialize(new { message = ex.Message });
            await context.Response.WriteAsync(response);
        }
    }
}
