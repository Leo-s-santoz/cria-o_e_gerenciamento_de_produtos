document.addEventListener("DOMContentLoaded", function () {
  const { jsPDF } = window.jspdf;
});

async function searchClient() {
  const searchContent = document.getElementById("search").value;

  if (!searchContent) {
    return alert("Por favor preencha o campo de busca");
  }

  try {
    const response = await fetch("/search_client", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        searchContent,
      }),
    });

    const clientData = await response.json();

    if (response.status === 200 && clientData != "") {
      searchClientPurchases(clientData);
    }
  } catch (error) {
    console.error("Error generating report:", error);
    alert("Erro ao gerar relatório");
  }
}

async function searchClientPurchases(clientData) {
  const cli_id = clientData.data.cli_id;

  if (!cli_id) {
    return alert("ID do cliente não encontrado!");
  }

  try {
    const response = await fetch("/search_client_purchases", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cli_id,
      }),
    });

    const result = await response.json();
    const purchases = result.data;
    const client = clientData.data;

    if (response.status === 200 && purchases.length == 0) {
      alert("Cliente não possui compras");
    }

    if (response.status === 200 && purchases.length > 0) {
      generatePDF(client, purchases);
      //alert("Relatório gerado com sucesso");
    }

    console.log("cliente:", client, "compras:", purchases);
  } catch (error) {
    console.error("Error searching client purchases:", error);
    alert("Erro ao buscar compras do cliente");
  }
}

async function generatePDF(client, purchases) {
  const { jsPDF } = window.jspdf;

  const doc = new jsPDF();

  // Add client information
  doc.setFontSize(16);
  doc.text("Informações do Cliente", 10, 10);
  doc.setFontSize(12);
  doc.text(`ID: ${client.cli_id}`, 10, 20);
  doc.text(`Razão Social: ${client.cli_razaosocial}`, 10, 30);
  doc.text(`CNPJ: ${client.cli_cnpj}`, 10, 40);
  doc.text(`Celular: ${client.cli_celular}`, 10, 50);

  // Add purchases information
  doc.setFontSize(16);
  doc.text("Compras Realizadas", 10, 70);
  doc.setFontSize(12);

  purchases.forEach((purchase, index) => {
    const y = 80 + index * 20;
    const paymentOption =
      purchase.condpag_descricao === "0"
        ? "À vista"
        : `${purchase.condpag_descricao}x`;

    doc.text(`Produto: ${purchase.prod_id}`, 10, y);
    doc.text(`Preço: R$ ${purchase.compra_preco.toFixed(2)}`, 10, y + 10);
    doc.text(`Opção de Pagamento: ${paymentOption}`, 10, y + 20);
  });

  // Save the PDF
  doc.save("relatorio_cliente.pdf");
}
