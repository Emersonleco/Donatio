const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

allSideMenu.forEach(item => {
    const li = item.parentElement;

    item.addEventListener('click', function () {
        allSideMenu.forEach(i => {
            i.parentElement.classList.remove('active');
        })
        li.classList.add('active');
    })
});

// TOGGLE SIDEBAR
const sidebar = document.getElementById('sidebar');
const menuButton = document.querySelector('.bx-menu');

menuButton.addEventListener('click', (e) => {
    e.stopPropagation(); // impede que o clique no botão feche o menu imediatamente
    sidebar.classList.toggle('hide');
});

// Fecha a sidebar se clicar fora dela
document.addEventListener('click', (e) => {
    const isClickInsideSidebar = sidebar.contains(e.target);
    const isClickOnMenuButton = menuButton.contains(e.target);

    if (!isClickInsideSidebar && !isClickOnMenuButton) {
        sidebar.classList.add('hide');
    }
});

// Ajusta barra lateral no carregamento da página e alterações de tamanho
function adjustSidebar() {
    if (window.innerWidth <= 576) {
        sidebar.classList.add('hide');  
    } else {
        sidebar.classList.remove('hide');  
    }
}

// Definir o estado da barra lateral quando a página for carregada e o tamanho da janela for alterado
window.addEventListener('load', adjustSidebar);
window.addEventListener('resize', adjustSidebar);

// Alternar o botão de pesquisa
const searchButton = document.querySelector('#content nav form .form-input button');
const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
const searchForm = document.querySelector('#content nav form');

searchButton.addEventListener('click', function (e) {
    if (window.innerWidth < 768) {
        e.preventDefault();
        searchForm.classList.toggle('show');
        if (searchForm.classList.contains('show')) {
            searchButtonIcon.classList.replace('bx-search', 'bx-x');
        } else {
            searchButtonIcon.classList.replace('bx-x', 'bx-search');
        }
    }
})

// Dark Mode Switch
const switchMode = document.getElementById('switch-mode');

switchMode.addEventListener('change', function () {
    console.log("Switch mode toggled:", this.checked);
    if (this.checked) {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
})

// Notification Menu Toggle
document.querySelector('.notification').addEventListener('click', function () {
    document.querySelector('.notification-menu').classList.toggle('show');
    document.querySelector('.profile-menu').classList.remove('show'); // Close profile menu if open
});

// Profile Menu Toggle
document.querySelector('.profile').addEventListener('click', function () {
    document.querySelector('.profile-menu').classList.toggle('show');
    document.querySelector('.notification-menu').classList.remove('show'); // Close notification menu if open
});

// Close menus if clicked outside
window.addEventListener('click', function (e) {
    if (!e.target.closest('.notification') && !e.target.closest('.profile')) {
        document.querySelector('.notification-menu').classList.remove('show');
        document.querySelector('.profile-menu').classList.remove('show');
    }
});


    // Başlangıçta tüm menüleri kapalı tut
document.addEventListener("DOMContentLoaded", function() {
    var allMenus = document.querySelectorAll('.menu');
    allMenus.forEach(function(menu) {
        menu.style.display = 'none';
      });
});

///// Modal Adicionar

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modalDoacao");
  const openBtn = document.querySelector(".bx-plus");
  const closeBtn = document.getElementById("closeModal");

  openBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });

  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  });

const form = document.getElementById("formDoacao");
  form.addEventListener("submit", async function(e) {
  e.preventDefault();

  const doador = document.getElementById("doador").value;
  const valor = document.getElementById("valor").value;
  const data = document.getElementById("data").value;

  try {
      const resposta = await fetch("/doacoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ doador, valor, data })
      });

      if (!resposta.ok) throw new Error("Erro ao registrar doação");

      // Atualiza tabela após salvar
      form.reset();
      modal.classList.add("hidden");
      carregarDoacoes(); // recarrega a tabela
    } catch (err) {
      alert("Erro ao enviar doação.");
      console.error(err);
    }
  });
});


async function carregarDoacoes() {
  const tabela = document.querySelector("table tbody");
  tabela.innerHTML = ""; // limpa tabela

  try {
    const resposta = await fetch("/doacoes");
    const doacoes = await resposta.json();

    doacoes.forEach(doacao => {
      const linha = document.createElement("tr");
      linha.innerHTML = `
        <td>${doacao.doador}</td>
        <td>R$ ${parseFloat(doacao.valor).toFixed(2)}</td>
        <td>${new Date(doacao.data).toLocaleDateString()}</td>
      `;
      tabela.appendChild(linha);
    });
  } catch (err) {
    console.error("Erro ao carregar doações:", err);
  }
}

carregarDoacoes(); // chamada ao carregar a página

// MODAL FILTRO
const filtroModal = document.getElementById("modalFiltro");
const filtroBtn = document.querySelector(".bx-filter");
const closeFiltro = document.getElementById("closeFiltro");

filtroBtn.addEventListener("click", () => {
  filtroModal.classList.remove("hidden");
});

closeFiltro.addEventListener("click", () => {
  filtroModal.classList.add("hidden");
});

window.addEventListener("click", (e) => {
  if (e.target === filtroModal) {
    filtroModal.classList.add("hidden");
  }
});

// FILTRAR TABELA
document.getElementById("formFiltro").addEventListener("submit", function(e) {
  e.preventDefault();

  const doadorFiltro = document.getElementById("filtroDoador").value.toLowerCase();
  const dataInicio = document.getElementById("filtroDataInicio").value;
  const dataFim = document.getElementById("filtroDataFim").value;
  const valorMin = parseFloat(document.getElementById("filtroValorMin").value) || 0;
  const valorMax = parseFloat(document.getElementById("filtroValorMax").value) || Infinity;

  const rows = document.querySelectorAll("table tbody tr");

  rows.forEach(row => {
    const doador = row.cells[0].innerText.toLowerCase();
    const valor = parseFloat(row.cells[1].innerText.replace("R$ ", "").replace(",", ".")) || 0;
    const dataTexto = row.cells[2].innerText;
    const partesData = dataTexto.split('/');
    const data = new Date(`${partesData[2]}-${partesData[1]}-${partesData[0]}`);

    let exibir = true;

    if (doadorFiltro && !doador.includes(doadorFiltro)) exibir = false;
    if (dataInicio && data < new Date(dataInicio)) exibir = false;
    if (dataFim && data > new Date(dataFim)) exibir = false;
    if (valor < valorMin || valor > valorMax) exibir = false;

    row.style.display = exibir ? "" : "none";
  });

  filtroModal.classList.add("hidden");
});



