const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../app');
const Book = require('../models/book');

const originalMethods = {
  findAll: Book.findAll,
  findByPk: Book.findByPk,
  create: Book.create,
};

function restoreBookMethods() {
  Book.findAll = originalMethods.findAll;
  Book.findByPk = originalMethods.findByPk;
  Book.create = originalMethods.create;
}

async function runTest(name, fn) {
  try {
    restoreBookMethods();
    await fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    console.error(error);
    process.exitCode = 1;
  }
}

async function main() {
  await runTest('GET /api/health returns service metadata', async () => {
    const response = await request(app).get('/api/health');

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, {
      status: 'ok',
      service: 'Book Management API',
    });
  });

  await runTest('GET /api/books returns books and count', async () => {
    const books = [
      { id: 1, title: 'Berserk', author: 'Kentaro Miura' },
      { id: 2, title: 'Dune', author: 'Frank Herbert' },
    ];

    let capturedQuery = null;
    Book.findAll = async (query) => {
      capturedQuery = query;
      return books;
    };

    const response = await request(app).get('/api/books?q=be&sort=title&order=ASC');

    assert.equal(response.status, 200);
    assert.equal(response.body.count, 2);
    assert.deepEqual(response.body.items, books);
    assert.deepEqual(capturedQuery.order, [['title', 'ASC']]);
  });

  await runTest('POST /api/books validates required fields', async () => {
    const response = await request(app)
      .post('/api/books')
      .send({ title: 'Berserk' });

    assert.equal(response.status, 400);
    assert.deepEqual(response.body.errors, ['Author is required.', 'ISBN is required.']);
  });

  await runTest('POST /api/books creates a book with trimmed values', async () => {
    let capturedPayload = null;
    Book.create = async (payload) => {
      capturedPayload = payload;
      return { id: 7, ...payload };
    };

    const response = await request(app)
      .post('/api/books')
      .send({
        title: '  Berserk  ',
        author: '  Kentaro Miura  ',
        isbn: ' 978-4560000118 ',
        publication_year: 1989,
        genre: '  Dark Fantasy ',
      });

    assert.equal(response.status, 201);
    assert.deepEqual(capturedPayload, {
      title: 'Berserk',
      author: 'Kentaro Miura',
      isbn: '978-4560000118',
      publication_year: 1989,
      genre: 'Dark Fantasy',
    });
    assert.equal(response.body.title, 'Berserk');
  });

  await runTest('GET /api/books/:id returns 404 when the book does not exist', async () => {
    Book.findByPk = async () => null;

    const response = await request(app).get('/api/books/999');

    assert.equal(response.status, 404);
    assert.deepEqual(response.body, { error: 'Book not found.' });
  });

  await runTest('PUT /api/books/:id updates an existing book', async () => {
    const book = {
      id: 1,
      title: 'Berserk',
      author: 'Kentaro Miura',
      isbn: '978-4560000118',
      publication_year: 1989,
      genre: 'Dark Fantasy',
      async update(updates) {
        Object.assign(this, updates);
        return this;
      },
    };

    Book.findByPk = async () => book;

    const response = await request(app)
      .put('/api/books/1')
      .send({
        genre: 'Seinen Fantasy',
        publication_year: 1990,
      });

    assert.equal(response.status, 200);
    assert.equal(response.body.genre, 'Seinen Fantasy');
    assert.equal(response.body.publication_year, 1990);
  });

  await runTest('DELETE /api/books/:id removes an existing book', async () => {
    let destroyed = false;
    Book.findByPk = async () => ({
      async destroy() {
        destroyed = true;
      },
    });

    const response = await request(app).delete('/api/books/1');

    assert.equal(response.status, 204);
    assert.equal(response.text, '');
    assert.equal(destroyed, true);
  });

  restoreBookMethods();

  if (process.exitCode && process.exitCode !== 0) {
    process.exit(process.exitCode);
  }
}

main().catch((error) => {
  console.error('FAIL test runner');
  console.error(error);
  process.exit(1);
});
