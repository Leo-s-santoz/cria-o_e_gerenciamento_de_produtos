require("dotenv").config({ path: "./.env" });
const mysqlPassword = process.env.MYSQL_PASSWORD;

const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("sistema_pagamentos", "root", mysqlPassword, {
  dialect: "mysql",
  host: "localhost",
  port: "3306",
});

module.exports = sequelize;
