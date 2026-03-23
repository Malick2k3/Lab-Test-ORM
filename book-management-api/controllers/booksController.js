const { Op } = require('sequelize');
const Book = require('../models/book');

function buildBookPayload(body) {
  return {
    title: body.title?.trim(),
    author: body.author?.trim(),
    isbn: body.isbn?.trim(),
    publication_year:
      body.publication_year === undefined || body.publication_year === null || body.publication_year === ''
        ? null
        : Number(body.publication_year),
    genre: body.genre?.trim() || null,
  };
}

function validateBookPayload(payload, { partial = false } = {}) {
  const errors = [];

  if (!partial || payload.title !== undefined) {
    if (!payload.title) {
      errors.push('Title is required.');
    }
  }

  if (!partial || payload.author !== undefined) {
    if (!payload.author) {
      errors.push('Author is required.');
    }
  }

  if (!partial || payload.isbn !== undefined) {
    if (!payload.isbn) {
      errors.push('ISBN is required.');
    }
  }

  if (payload.publication_year !== null && payload.publication_year !== undefined) {
    if (!Number.isInteger(payload.publication_year) || payload.publication_year < 0) {
      errors.push('Publication year must be a valid positive integer.');
    }
  }

  return errors;
}

async function listBooks(req, res, next) {
  try {
    const { q, author, genre, sort = 'created_at', order = 'DESC' } = req.query;
    const filters = {};

    if (q) {
      filters[Op.or] = [
        { title: { [Op.like]: `%${q}%` } },
        { author: { [Op.like]: `%${q}%` } },
        { isbn: { [Op.like]: `%${q}%` } },
      ];
    }

    if (author) {
      filters.author = { [Op.like]: `%${author}%` };
    }

    if (genre) {
      filters.genre = { [Op.like]: `%${genre}%` };
    }

    const allowedSortFields = new Set(['created_at', 'updated_at', 'title', 'author', 'publication_year']);
    const safeSort = allowedSortFields.has(sort) ? sort : 'created_at';
    const safeOrder = String(order).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const books = await Book.findAll({
      where: filters,
      order: [[safeSort, safeOrder]],
    });

    res.json({
      count: books.length,
      items: books,
    });
  } catch (error) {
    next(error);
  }
}

async function getBookById(req, res, next) {
  try {
    const book = await Book.findByPk(req.params.id);

    if (!book) {
      return res.status(404).json({ error: 'Book not found.' });
    }

    return res.json(book);
  } catch (error) {
    next(error);
  }
}

async function createBook(req, res, next) {
  try {
    const payload = buildBookPayload(req.body);
    const errors = validateBookPayload(payload);

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const book = await Book.create(payload);
    return res.status(201).json(book);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'ISBN must be unique.' });
    }

    return next(error);
  }
}

async function updateBook(req, res, next) {
  try {
    const book = await Book.findByPk(req.params.id);

    if (!book) {
      return res.status(404).json({ error: 'Book not found.' });
    }

    const payload = buildBookPayload(req.body);
    const errors = validateBookPayload(payload, { partial: true });

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const updates = {};
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined) {
        updates[key] = value;
      }
    });

    await book.update(updates);
    return res.json(book);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'ISBN must be unique.' });
    }

    return next(error);
  }
}

async function deleteBook(req, res, next) {
  try {
    const book = await Book.findByPk(req.params.id);

    if (!book) {
      return res.status(404).json({ error: 'Book not found.' });
    }

    await book.destroy();
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
