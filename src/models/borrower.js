const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');  
const Borrow = require('./borrow');

const Borrower = sequelize.define('Borrower', {
    borrower_id: {  
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,  
    },
    borrower_name: {
        type: DataTypes.STRING,
        allowNull: false, 
    },
    email: {
        type: DataTypes.STRING,
        unique: true,  
        allowNull: false, 
    },
    registered_date: {
        type: DataTypes.DATE,
        allowNull: true, 
        defaultValue: Date.now(),  
    },
}, {
    tableName: 'borrower',  
    timestamps: false, 
});

Borrower.hasMany(Borrow, { foreignKey: 'borrower_id' });
Borrow.belongsTo(Borrower, { foreignKey: 'borrower_id' });

module.exports = Borrower;
