async function simulatePurchase() {
  const cli_id = document.getElementById("clientId").value;
  const productCode = document.getElementById("productCode").value;
  const paymentOption = document.getElementById("paymentOption").value;

  if (!cli_id || !productCode || !paymentOption) {
    alert("Preencha todos os campos corretamente");
  }

  try {
    const response = await fetch("/simulate_purchase", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        cli_id,
        productCode,
        paymentOption,
      }),
    });

    const result = await response.json();
    console.log("server response:", result);
  } catch (error) {
    console.error("Error to simulate purchase:", error);
  }
}
