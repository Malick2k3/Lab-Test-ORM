# ShelfTrack API

ShelfTrack API is a backend service for managing a book catalog with Node.js, Express, Sequelize, and MySQL.

The project started as a small ORM lab, but it is being cleaned up into something that looks more like a real backend portfolio piece. The scope is still modest, but the structure is now clearer and the API is no longer limited to just listing and creating books.

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

## What improved from the original version

- clearer project identity
- real package metadata and installable dependencies
- health route
- cleaner app/server split
- CRUD coverage instead of just list/create
- central controller and middleware structure
- safer request handling and more consistent responses

## What is still missing

- automated tests
- request-level validation middleware
- pagination on the list endpoint
- deployment setup
- authentication if this grows into a multi-user service

Those are the next logical upgrades. The project is already in a better place than a raw lab submission, but it is not pretending to be production-ready yet.
