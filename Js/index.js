const STORAGE_KEY = "my_finance";
const inputName = document.getElementById("inputName");
const inputPrice = document.getElementById("price");
const inputType = document.getElementById("type");
const inputCategories = document.getElementById("categories");
const inputDate = document.getElementById("date");
const btnRegister = document.getElementById("register");
const listOfRegister = document.getElementById("listOfRegister");
const totalBalance = document.getElementById("totalBalance");
const filterSelect = document.getElementById("filterSelect");
const ctx = document.getElementById("myChart");

// valida se já tem registro no local storage, se tiver carrega e se não começa com o array vazio
let registerList = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let idCount = 1;
let myChart = null;

// criar um novo registro e adiciona no array
function newRegister() {
  if (inputName.value === "") {
    alert("Informe uma descrição");
    return;
  } else if (inputPrice.value === "") {
    alert("Informe um valor");
    return;
  }

  const register = {
    price: Number(inputPrice.value),
    id: idCount,
    type: inputType.value,
    category: inputCategories.value,
    description: inputName.value,
    date: inputDate.value,
  };

  registerList.push(register);
  idCount++;
  reloadRegister();
  renderRegister();

  inputName.value = "";
  inputPrice.value = "";
  console.log(registerList);
}
// exibir na tela
function renderRegister(listToRender = registerList) {
  const render = listToRender.map((register) => {
    // Lógica para cor e ícone baseada no tipo
    const isEntry = register.type === "entry";
    const colorClass = isEntry ? "text-emerald-600" : "text-rose-600";
    const bgIcon = isEntry
      ? "bg-emerald-100 text-emerald-600"
      : "bg-rose-100 text-rose-600";
    const icon = isEntry ? "fa-arrow-up" : "fa-arrow-down";
    // formatação da data para o padrão br
    const formattedDate = new Date(register.date).toLocaleDateString("pt-BR", {
      timeZone: "UTC",
    });

    return `
      <div class="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border-l-4 ${isEntry ? "border-emerald-500" : "border-rose-500"} hover:shadow-md transition-shadow">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 ${bgIcon} rounded-full flex items-center justify-center">
            <i class="fa-solid ${icon}"></i>
          </div>
          <div>
            <h3 class="font-bold text-slate-700 capitalize">${register.description}</h3>
            <div class="flex gap-2 text-xs text-slate-400 items-center">
              <span class="bg-slate-100 px-2 py-0.5 rounded">${register.category}</span>
              <span>${formattedDate}</span>
            </div>
          </div>
        </div>
        
        <div class="flex items-center gap-6">
          <span class="font-bold ${colorClass}">
            ${isEntry ? "+" : "-"} R$ ${register.price.toFixed(2)}
          </span>
          <button onclick="removeRegister(${register.id})" class="text-slate-300 hover:text-rose-500 transition-colors">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
    `;
  });

  listOfRegister.innerHTML =
    render.length > 0
      ? render.join("")
      : `<p class="text-center text-slate-400 py-10">Nenhum registro encontrado.</p>`;

  showTotalValue(listToRender);
  showGraphic();
}

// remover registro
function removeRegister(id) {
  registerList = registerList.filter((register) => {
    return register.id !== id;
  });
  reloadRegister();
  renderRegister();
}

// valor total
function showTotalValue(list = registerList) {
  const totalValue = list.reduce((acc, register) => {
    if (register.type === "entry") {
      acc += register.price;
    } else {
      acc -= register.price;
    }

    return acc;
  }, 0);

  totalBalance.innerHTML = `Valor total: R$ ${totalValue.toFixed(2)}`;
}
// Filtros
function filtered() {
  const filter = filterSelect.value;

  if (filter === "all") {
    renderRegister(registerList);
  } else if (filter === "entry") {
    const entry = registerList.filter((register) => register.type === "entry");
    renderRegister(entry);
  } else if (filter === "exit") {
    const exit = registerList.filter((register) => register.type === "exit");
    renderRegister(exit);
  } else if (filter === "alimentação") {
    const food = registerList.filter(
      (register) => register.category === "alimentação",
    );
    renderRegister(food);
  } else if (filter === "lazer") {
    const lazer = registerList.filter(
      (register) => register.category === "lazer",
    );
    renderRegister(lazer);
  } else if (filter === "transporte") {
    const transport = registerList.filter(
      (register) => register.category === "transporte",
    );
    renderRegister(transport);
  }
}

// LocalStorage
function reloadRegister() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(registerList));
}

// Gráfico

function showGraphic() {
  const ctx = document.getElementById("myChart").getContext("2d");

  if (myChart) {
    myChart.destroy();
  }

  const categories = ["alimentação", "transporte", "lazer", "outros"];
  const categoryData = categories.map((cat) => {
    const total = registerList
      .filter((r) => r.category === cat)
      .reduce((acc, r) => {
        if (r.type === "entry") {
          return acc + r.price;
        } else {
          return acc - r.price;
        }
      }, 0);
    return Math.abs(total); // Usar valor absoluto para o gráfico
  });
  myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: categories.map((c) => c.charAt(0).toUpperCase() + c.slice(1)), // Capitalizar
      datasets: [
        {
          label: "Saldo por Categoria (R$)",
          data: categoryData,
          backgroundColor: [
            "rgba(255, 99, 132, 0.5)",
            "rgba(54, 162, 235, 0.5)",
            "rgba(255, 206, 86, 0.5)",
            "rgba(75, 192, 192, 0.5)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return "R$ " + value.toFixed(2);
            },
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              return "R$ " + context.raw.toFixed(2);
            },
          },
        },
      },
    },
  });
}

// eventos e chamada das funçoes
renderRegister();
btnRegister.addEventListener("click", newRegister);
filterSelect.addEventListener("change", filtered);
