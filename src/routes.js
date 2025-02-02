const express = require("express");
const Sequelize = require("sequelize");
const { Op } = Sequelize;
const router = express.Router();
router.use(express.json());
const twilio = require("twilio");
require("dotenv").config({ path: "./.env" });

//models
const Produto = require("./models/produto");
const Cliente = require("./models/cliente");
const Compras = require("./models/compras");

//twillio config
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE;

//routes

//submit new product or update product
router.post("/submit_prod", async (req, res) => {
  const { code, name, price } = req.body;

  if (!name || !price || !code) {
    return res.status(400).json({ error: "missing information" });
  }

  try {
    const productExist = await Produto.findOne({
      where: {
        prod_code: code,
      },
    });

    if (productExist) {
      //check for product code
      await productExist.update({
        prod_descricao: name,
        prod_preco: price,
      });
      return res
        .status(200)
        .json({ message: "product updated", data: productExist });
    } else {
      //create product otherwise
      const newProduct = await Produto.create({
        prod_code: code,
        prod_descricao: name,
        prod_preco: price,
        createdAt: new Date(),
      });
      return res
        .status(201)
        .json({ message: "product created", data: newProduct });
    }
  } catch (error) {
    console.error("error processing product:", error);
    return res.status(500).json({ error: "internal server error" });
  }
});

//simulate purchase
router.post("/simulate_purchase", async (req, res) => {
  const { cli_id, productCode, paymentOption } = req.body;

  if (!cli_id || !productCode || !paymentOption) {
    return res.status(400).json({ error: "missing information" });
  }

  try {
    const productExist = await Produto.findOne({
      where: {
        prod_code: productCode,
      },
    });

    if (!productExist) {
      return res.status(404).json({ error: "Product not found" });
    }

    const clientExist = await Cliente.findOne({
      where: {
        cli_id: cli_id,
      },
    });

    if (!clientExist) {
      return res.status(404).json({ error: "Client not found" });
    }

    const productPriceData = await Produto.findOne({
      where: {
        prod_code: productCode,
      },
      attributes: ["prod_preco"],
    });

    const productDescription = await Produto.findOne({
      where: {
        prod_code: productCode,
      },
      attributes: ["prod_descricao"],
    });

    console.log(productDescription);

    if (!productPriceData) {
      return res.status(500).json({ error: "Error retrieving product price" });
    }

    const productPrice = productPriceData.prod_preco;

    const newPurchase = await Compras.create({
      cli_id: cli_id,
      prod_id: productCode,
      prod_descricao: productDescription.prod_descricao,
      compra_preco: productPrice,
      condpag_descricao: paymentOption,
    });

    return res
      .status(201)
      .json({ message: "purchase created", data: newPurchase });
  } catch (error) {
    console.error("Error processing purchase:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

//check who bought at a higher price and send sms
router.post("/send_sms", async (req, res) => {
  const { productCode, productName } = req.body;

  if (!productCode) {
    return res.status(400).json({ error: "missing information" });
  }

  try {
    const productExist = await Produto.findOne({
      where: { prod_code: productCode },
      attributes: ["prod_preco"],
    });

    if (!productExist) {
      return res.status(404).json({ error: "Product not found" });
    }

    const currentPrice = productExist.prod_preco;

    const purchases = await Compras.findAll({
      where: {
        prod_id: productCode,
        compra_preco: {
          [Sequelize.Op.gt]: currentPrice,
        },
      },
      attributes: ["cli_id"],
    });

    const clientIds = purchases.map((purchase) => purchase.cli_id);

    if (clientIds.length === 0) {
      return res.status(200).json({ message: "No clients to notify" });
    }

    // Send SMS to all clients
    const twilioClient = twilio(accountSid, authToken);

    for (const cli_id of clientIds) {
      const client = await Cliente.findOne({ where: { cli_id } });

      if (client) {
        const formattedPhoneNumber = `+55${client.cli_celular}`;

        await twilioClient.messages.create({
          body: `o preço do produto ${productName} diminuiu para ${currentPrice}.`,
          from: twilioPhone,
          to: formattedPhoneNumber,
        });
      }
    }

    return res.status(200).json({ message: "SMS sent to clients", clientIds });
  } catch (error) {
    console.error("Error sending SMS:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

//search client information
router.post("/search_client", async (req, res) => {
  const { searchContent } = req.body;

  if (!searchContent) {
    return res.status(400).json({ error: "missing information" });
  }

  try {
    const client = await Cliente.findOne({
      where: {
        [Op.or]: [
          { cli_razaosocial: { [Op.like]: `%${searchContent}%` } },
          { cli_cnpj: { [Op.like]: `%${searchContent}%` } },
        ],
      },
    });

    return res.status(200).json({ data: client });
  } catch (error) {
    console.error("Error searching client:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

//search client purchases
router.post("/search_client_purchases", async (req, res) => {
  const { cli_id } = req.body;

  if (!cli_id) {
    return res.status(400).json({ error: "missing information" });
  }

  try {
    const purchases = await Compras.findAll({
      where: {
        cli_id,
      },
    });

    return res.status(200).json({ data: purchases });
  } catch (error) {
    console.error("Error searching client purchases:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

//list all products
router.get("/list_prod", async (req, res) => {
  try {
    const products = await Produto.findAll();

    return res.status(200).json({ data: products });
  } catch (error) {
    console.error("Error listing products:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

//delete product
router.delete("/delete_prod", async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "missing information" });
  }

  try {
    const product = await Produto.findOne({
      where: {
        prod_code: code,
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    await product.destroy();

    return res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
