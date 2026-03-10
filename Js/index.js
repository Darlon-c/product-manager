const productName = document.getElementById("productName");
const productPrice = document.getElementById("productPrice");
const productQuantity = document.getElementById("productQuantity");
const productCategories = document.getElementById("categories");
const saveProduct = document.getElementById("saveProduct");
const resumeProducts = document.getElementById("resumeProducts");
const totalValueStock = document.getElementById("totalValueStock");

let listProducts = [];
let idCount = 1;

function saveStorage() {
  localStorage.setItem("products", JSON.stringify(listProducts));
}

function loadInitialStorage() {
  const savedProducts = localStorage.getItem("products");

  if (savedProducts) {
    listProducts = JSON.parse(savedProducts);
    // Atualizar o idCount baseado no último id
    if (listProducts.length > 0) {
      idCount = Math.max(...listProducts.map((p) => p.id)) + 1;
    }
    renderProducts();
  }
}

function newProduct() {
  if (productName.value === "") {
    Swal.fire("Informe o nome do produto");
    return;
  } else if (productPrice.value === "" || productPrice.value <= 0) {
    Swal.fire("Informe o preço do produto");
    return;
  } else if (productQuantity.value === "" || productQuantity.value <= 0) {
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
  saveStorage();

  console.log(listProducts);

  productName.value = "";
  productPrice.value = "";
  productQuantity.value = "";
}

function renderProducts() {
  const render = listProducts.map((product) => {
    return `
      <div class="bg-white p-4 rounded-lg shadow">
        <p>Nome: ${product.name}</p>
        <p>Preço: R$${product.price.toFixed(2)}</p>
        <p>Quantidade: ${product.quantity}</p>
        <p>Categoria: ${product.category}</p>
        <p>Valor total: R$${product.totalValue.toFixed(2)}</p>
        <button class="mt-3 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" onclick="removeProduct(${product.id})">Remover</button> 
      </div>
    `;
  });

  resumeProducts.innerHTML =
    render.length > 0 ? render.join("") : "<p>Nenhum produto cadastrado.</p>";
  totalValueToStock();
}

function totalValueToStock() {
  const total = listProducts.reduce((acc, product) => {
    return acc + product.totalValue;
  }, 0);

  totalValueStock.innerHTML = `Valor total do estoque: R$${total.toFixed(2)}`;
}

function removeProduct(id) {
  listProducts = listProducts.filter((product) => {
    return product.id !== id;
  });

  renderProducts();

  saveStorage();
}

loadInitialStorage();
saveProduct.addEventListener("click", newProduct);
