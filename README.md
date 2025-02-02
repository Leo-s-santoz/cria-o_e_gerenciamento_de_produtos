This project is a management system that allows uers to simulate purchases, generate reports and send notificaitons via sms, besides other functions

1- install dependencies:
npm install

2- create a .env file in src/ with the following content:
MYSQL_PASSWORD=your_mysql_password
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE=your_twilio_phone_number

3- start server:
node src/app.js

4- usage :
Adding or Updating a Product
Open the index.html file in your browser.
Fill in the product details and click "Adicionar ou Atualizar Produto".

Simulating a Purchase
Open the simulate.html file in your browser.
Fill in the purchase details and click "Simular Compra".

Generating a Report
Open the report.html file in your browser.
Enter the client's CNPJ or Razão Social and click "Gerar Relatório".

Listing All Products
Open the index.html file in your browser.
Click "Listar Produtos Cadastrados" to generate a spreadsheet with all products.
