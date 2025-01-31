const { Sequelize, DataTypes } = require("sequelize");
const { timeStamp, table } = require("console");
const database = require("../db");
const Produto = require("./produto");
const Cliente = require("./cliente");

const Compras = database.define(
  "Compras",
  {
    hist_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "hist_id",
      primaryKey: true,
      autoIncrement: true,
    },

    cli_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "cli_id",
      references: {
        model: Cliente,
        key: "cli_id",
      },
    },

    prod_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "prod_id",
      references: {
        model: Produto,
        key: "prod_id",
      },
    },

    compra_preco: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: "compra_preco",
    },

    condpag_descricao: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "condpag_descricao",
    },
  },
  {
    tableName: "compras",
    timestamps: true,
    updatedAt: false,
  }
);

module.exports = Compras;
