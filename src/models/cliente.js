const { Sequelize, DataTypes } = require("sequelize");
const { timeStamp } = require("console");
const database = require("../db");

const Cliente = database.define(
  "Cliente",
  {
    cli_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "cli_id",
      primaryKey: true,
      autoIncrement: true,
    },

    cli_cnpj: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "cli_cnpj",
    },

    cli_razaosocial: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "cli_razaosocial",
    },

    cli_celular: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "cli_celular",
    },
  },
  {
    tableName: "cliente",
    timestamps: false,
  }
);

module.exports = Cliente;
