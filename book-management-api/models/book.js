const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Book = sequelize.define('books', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isbn: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    publication_year: {
        type: DataTypes.INTEGER
    },
    genre: {
        type: DataTypes.STRING
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'books',
    timestamps: true,  
    createdAt: 'created_at',  
    updatedAt: 'updated_at'   
});

module.exports = Book;
