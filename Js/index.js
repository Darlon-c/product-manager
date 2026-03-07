const productName = document.getElementById("productName");
const productPrice = document.getElementById("productPrice");
const productQuantity = document.getElementById("productQuantity");
const productCategories = document.getElementById("categories");
const saveProduct = document.getElementById("saveProduct");
const resumeProducts = document.getElementById("resumeProducts");
const totalValueStock = document.getElementById("totalValueStock");

let listProducts = [];
let idCount = 1;

function newProduct() {
  if (productName.value === "") {
    Swal.fire("Informe o nome do produto");
    return;
  } else if (productPrice.value === "") {
    Swal.fire("Informe o preço do produto");
    return;
  } else if (productQuantity.value === "") {
    Swal.fire("Informe a quantidade do produto");
    return;
  }

  const product = {
    id: idCount,
    name: productName.value,
    price: Number(productPrice.value),
    quantity: Number(productQuantity.value),
    category: productCategories.value,
    totalValue: Number(productPrice.value * productQuantity.value),
  };

  listProducts.push(product);
  idCount++;
  renderProducts();

  console.log(listProducts);

  productName.value = "";
  productPrice.value = "";
  productQuantity.value = "";
}

function renderProducts() {
  const render = listProducts.map((product) => {
    return `
      <div>
        <p>Nome: ${product.name}</p>
        <p>Preço: R$${product.price.toFixed(2)}</p>
        <p>Quantidade: ${product.quantity}</p>
        <p>Categoria: ${product.category}</p>
        <p>Valor total: R$${product.totalValue.toFixed(2)}</p>
        <button>Remover</button> 
      </div>
    `;
  });

  resumeProducts.innerHTML = render.join("");
  totalValueToStock()
}

function totalValueToStock() {
  const total = listProducts.reduce((acc, product) => {
    return (acc += product.totalValue);
  }, 0);

  totalValueStock.innerHTML = total
}

saveProduct.addEventListener("click", newProduct);
