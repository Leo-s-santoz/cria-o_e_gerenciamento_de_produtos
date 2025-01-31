const { Sequelize, DataTypes } = require("sequelize");
const { timeStamp } = require("console");
const database = require("../db");

const Produto = database.define(
  "Produto",
  {
    prod_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "prod_id",
      primaryKey: true,
      autoIncrement: true,
    },

    prod_code: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "prod_code",
    },

    prod_descricao: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "prod_descricao",
    },

    prod_preco: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: "prod_preco",
    },
  },
  {
    tableName: "produto",
    timestamps: false,
  }
);

module.exports = Produto;
