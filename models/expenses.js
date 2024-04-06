const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const User = require('./users'); // Import the Users model

const Expenses = sequelize.define('expenses', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    expense: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    category: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: User, // Specify the referenced model (Users)
            key: 'id'   // Specify the referenced column (id)
        }
    }
});

module.exports = Expenses;
