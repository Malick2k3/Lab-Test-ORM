# ShelfTrack API

ShelfTrack API is a small Node.js and MySQL service for managing a book catalog.

Right now the project is still early, but the goal is straightforward: expose a clean backend API for storing, listing, and managing books with Sequelize and Express.

The old repo name sounded like a classroom folder. This name matches the actual project better and gives it a more credible identity.

## Current stack

- Node.js
- Express
- Sequelize
- MySQL
- dotenv

## Current structure

```text
Lab-Test-ORM/
|-- book-management-api/
|   |-- config/
|   |-- models/
|   |-- routes/
|   `-- server.js
|-- curl_commands.txt
|-- package.json
`-- README.md
```

## What exists today

- database connection through Sequelize
- a `Book` model
- `GET /api/books`
- `POST /api/books`

## Where the project is going

The next step is to turn this from a basic lab API into a more complete backend project with:

- better project structure
- stronger API coverage
- cleaner startup flow
- better validation and error handling
- proper documentation and setup

## Planned direction

This repo is being upgraded into a cleaner backend portfolio project, not left as a minimal exercise.
