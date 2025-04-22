const express = require('express');
const router = express.Router();
const Book = require('../models/book');

// GET all books
router.get('/', async (req, res) => {
    try {
        const books = await Book.findAll();
        res.json(books);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// POST a new book
router.post('/', async (req, res) => {
    try {
        const { title, author, isbn, publication_year, genre } = req.body;

        if (!title || !author || !isbn) {
            return res.status(400).json({ error: 'Title, author, and ISBN are required' });
        }

        const newBook = await Book.create({
            title,
            author,
            isbn,
            publication_year,
            genre
        });

        res.status(201).json(newBook);
    } catch (err) {
        console.error(err);
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'ISBN must be unique' });
        }
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
