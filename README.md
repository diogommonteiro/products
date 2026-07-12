Diogo Monteiro

diogomiguelmonteiro1@gmail.com

# Run the frontend and backend

This guide explains how to run both the frontend application and the backend API locally.

## Frontend

### Prerequisites
- Node.js 18 or higher
- npm

### Install dependencies
From the project root, run:

```bash
npm install
```

### Start the application
To run the Angular frontend locally:

```bash
npm start
```

The application will start in development mode and is usually available at:

```text
http://localhost:4200
```

### Run unit tests
To execute the frontend unit tests:

```bash
npm test -- --watch=false
```

## Backend

### Prerequisites
- .NET SDK 10.0 or later
- SQL Server installed and running locally
- A SQL Server instance named `SQLEXPRESS` available

### Steps
1. Open the terminal at the project root.
2. Restore the backend dependencies:

```bash
dotnet restore
```

3. Build the backend:

```bash
dotnet build
```

4. Run the backend application:

```bash
dotnet run --project WebApplication
```

5. The API should start, and you can open Swagger at:

```text
http://localhost:5030/swagger
```

### Database connection string
The backend uses the connection string defined in [WebApplication/Program.cs](WebApplication/Program.cs). If your local SQL Server setup is different, update the connection string in that file, especially at line 11, before starting the backend.

