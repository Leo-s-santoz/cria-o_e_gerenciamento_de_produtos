//add or update product
async function submitProduct() {
  const code = form.code().value;
  const name = form.name().value;
  const price = form.price().value;

  if (!code || !name || !price) {
    alert("Preencha todos os campos!");
    return;
  }

  try {
    const response = await fetch("/submit_prod", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        name,
        price,
      }),
    });

    if (response.status === 200) {
      alert("Produto atualizado com sucesso!");
      sendSMS(code, name);
    }
    if (response.status === 201) {
      alert("Produto criado com sucesso!");
    }
  } catch (error) {
    console.error("error processing product:", error);
    alert("Erro ao processar produto!");
  }
}

//send sms if a product is updated
async function sendSMS(productCode, productName) {
  if (!productCode) {
    alert("Código do produto não encontrado!");
    return;
  }

  try {
    const response = await fetch("/send_sms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productCode,
        productName,
      }),
    });

    if (response.status === 200) {
      alert("SMS enviado com sucesso!");
    }
  } catch (error) {
    console.error("error sending SMS:", error);
    alert("Erro ao enviar SMS!");
  }
}

//delete product
async function deleteProduct() {
  const code = form.code().value;

  if (!code) {
    alert("É necessário informar o código do produto!");
    return;
  }

  try {
    const response = await fetch("/delete_prod", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
      }),
    });

    if (response.status === 200) {
      alert("Produto deletado com sucesso!");
    }
  } catch (error) {
    console.error("error processing product:", error);
    alert("Erro ao processar produto!");
  }
}

//generate a sheet with all products
async function generateProductSheet() {
  try {
    const response = await fetch("/list_prod", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      const data = await response.json();
      const products = data.data;

      // Create a new workbook and add a worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(products);

      // Append the worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, ws, "Produtos");

      // Generate a file and trigger a download
      XLSX.writeFile(wb, "produtos.xlsx");
    }
  } catch (error) {
    console.error("error processing product:", error);
    alert("Erro ao processar produto!");
  }
}

//format currency
// Jquery Dependency
$("input[data-type='currency']").on({
  keyup: function () {
    formatCurrency($(this));
  },
  blur: function () {
    formatCurrency($(this), "blur");
  },
});

function formatNumber(n) {
  // format number 1000000 to 1,234,567
  return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatCurrency(input, blur) {
  // appends $ to value, validates decimal side
  // and puts cursor back in right position.

  // get input value
  var input_val = input.val();

  // don't validate empty input
  if (input_val === "") {
    return;
  }

  // original length
  var original_len = input_val.length;

  // initial caret position
  var caret_pos = input.prop("selectionStart");

  // check for decimal
  if (input_val.indexOf(".") >= 0) {
    // get position of first decimal
    // this prevents multiple decimals from
    // being entered
    var decimal_pos = input_val.indexOf(".");

    // split number by decimal point
    var left_side = input_val.substring(0, decimal_pos);
    var right_side = input_val.substring(decimal_pos);

    // add commas to left side of number
    left_side = formatNumber(left_side);

    // validate right side
    right_side = formatNumber(right_side);

    // On blur make sure 2 numbers after decimal
    if (blur === "blur") {
      right_side += "00";
    }

    // Limit decimal to only 2 digits
    right_side = right_side.substring(0, 2);

    // join number by .
    input_val = left_side + "." + right_side;
  } else {
    // no decimal entered
    // add commas to number
    // remove all non-digits
    input_val = formatNumber(input_val);

    // final formatting
    if (blur === "blur") {
      input_val += ".00";
    }
  }

  // send updated string to input
  input.val(input_val);

  // put caret back in the right position
  var updated_len = input_val.length;
  caret_pos = updated_len - original_len + caret_pos;
  input[0].setSelectionRange(caret_pos, caret_pos);
}

//get elements from html
const form = {
  code: () => document.getElementById("productCode"),
  name: () => document.getElementById("productName"),
  price: () => document.getElementById("productPrice"),
};

//delete non numeric characters from code input
const codeInput = form.code().addEventListener("input", function () {
  this.value = this.value.replace(/\D/g, "");
});
