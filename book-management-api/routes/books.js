const express = require('express');
const router = express.Router();
const {
    listBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
} = require('../controllers/booksController');

router.get('/', listBooks);
router.get('/:id', getBookById);
router.post('/', createBook);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

module.exports = router;
