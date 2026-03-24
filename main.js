const container = document.querySelector(".container");

async function searchData() {
  const busca = await fetch(
    "https://raw.githubusercontent.com/FelipeSponge/DadosReserva/refs/heads/main/db.json",
  );
  const dados = await busca.json();

  const [primeiroItem] = dados;
  const data = primeiroItem.Data;
  console.log(data);

  const blocos = [...new Set(dados.map((item) => item.Bloco))];

  container.innerHTML += `
    <h1>Reservas - DIA ${data}</h1>
  `;

  function gerarLinhasTabela(blocoNome) {
    const dadosFiltrados = dados.filter((item) => item.Bloco === blocoNome);
    return dadosFiltrados
      .map((item) => {
        return `
      <tr>
        <td>${item.HorárioInicial} - ${item.HorárioFinal}</td>
        <td>${item.Espaço || item.Local}</td> 
        <td>${item.Observação || ""}</td>
        <td>${item.Insumos || ""}</td>
      </tr>
    `;
      })
      .join("");
  }

  blocos.forEach((bloco) => {
    const linhas = gerarLinhasTabela(bloco);
    container.innerHTML += `
     <div class="bloco-container">
      <div class="bloco-header">${bloco}</div>
      <div class="content">
        <div class="table-scroll-wrapper">
          <table>
            <thead>
              <tr>
                <th>Horário</th>
                <th>Local</th>
                <th>Observação</th>
                <th>Insumos</th>
              </tr>
            </thead>
            <tbody>
              ${linhas}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    `;
  });

  container.addEventListener("click", function () {
    const headers = container.querySelectorAll(".bloco-header");
    headers.forEach((header) => {
      header.addEventListener("click", function () {
        const content = this.nextElementSibling;
        this.classList.toggle("active");

        if (content.classList.contains("show")) {
          content.style.maxHeight = content.scrollHeight + "px";
          content.classList.remove("show");
          setTimeout(() => {
            content.style.maxHeight = "0px";
          }, 10);
        } else {
          content.style.maxHeight = content.scrollHeight + "px";
          setTimeout(() => {
            content.classList.add("show");
          }, 400);
        }
      });
    });
  });

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("keyup", function () {
      const filter = searchInput.value.toLowerCase();
      const containers = document.querySelectorAll(".bloco-container");

      containers.forEach((container) => {
        let hasVisibleRows = false;
        const rows = container.querySelectorAll("tbody tr");
        const header = container.querySelector(".bloco-header");
        const content = container.querySelector(".content");

        rows.forEach((row) => {
          const text = row.textContent.toLowerCase();
          if (text.includes(filter)) {
            row.style.display = "";
            hasVisibleRows = true;
          } else {
            row.style.display = "none";
          }
        });

        if (hasVisibleRows) {
          container.style.display = "";
          if (filter !== "" && !header.classList.contains("active")) {
            header.classList.add("active");
            content.style.maxHeight = content.scrollHeight + "px";
            setTimeout(() => {
              content.classList.add("show");
            }, 400);
          }
        } else {
          if (filter !== "") {
            container.style.display = "none";
          }
        }

        if (filter === "") {
          header.classList.remove("active");
          content.classList.remove("show");
          content.style.maxHeight = "0px";
          container.style.display = "";
          rows.forEach((row) => (row.style.display = ""));
        }
      });
    });
  }
}
searchData();
