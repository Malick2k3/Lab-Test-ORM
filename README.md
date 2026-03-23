# Book Management API

Book Management API is a backend service for managing a book catalog with Node.js, Express, Sequelize, and MySQL.

## What it does

- connects to MySQL through Sequelize
- exposes a REST API for books
- supports listing, filtering, creating, updating, deleting, and fetching books by id
- includes a health endpoint for quick service checks
- uses central error handling instead of scattering error responses in every route file

## Stack

- Node.js
- Express
- Sequelize
- MySQL
- dotenv
- nodemon

## Project structure

```text
Lab-Test-ORM/
|-- book-management-api/
|   |-- config/
|   |   `-- db.js
|   |-- controllers/
|   |   `-- booksController.js
|   |-- middleware/
|   |   |-- errorHandler.js
|   |   `-- notFound.js
|   |-- models/
|   |   `-- book.js
|   |-- routes/
|   |   `-- books.js
|   |-- app.js
|   `-- server.js
|-- .env.example
|-- curl_commands.txt
|-- package.json
`-- README.md
```

## API routes

Base URL: `http://localhost:3001`

- `GET /api/health`
- `GET /api/books`
- `GET /api/books/:id`
- `POST /api/books`
- `PUT /api/books/:id`
- `DELETE /api/books/:id`

The list route also supports basic query filters:

- `q` for text search across title, author, and ISBN
- `author`
- `genre`
- `sort`
- `order`

Example:

```bash
GET /api/books?q=ber&sort=title&order=ASC
```

## Local setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create the environment file

```bash
copy .env.example .env
```

### 3. Fill in your MySQL credentials

Update the values in `.env`:

- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`

### 4. Start the API

```bash
npm run dev
```

If the database connection works, the service will start on `http://localhost:3001`.

## Useful scripts

```bash
npm run dev
npm run start
npm run check:syntax
```
