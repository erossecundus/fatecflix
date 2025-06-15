// para ficha tecnica

const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id"));
const filmes = JSON.parse(localStorage.getItem("filmes")) || filmesMockados;

const filme = filmes.find(f => f.id === id);
if (filme) {
  const [ano, mes, dia] = filme.dataAdicao.split("-");
  const dataFormatada = `${dia}/${mes}/${ano}`;
  document.getElementById("titulo-filme").textContent = filme.titulo;
  document.getElementById("diretor-filme").textContent = filme.diretor;
  document.getElementById("ano-filme").textContent = filme.ano;
  document.getElementById("genero-filme").textContent = filme.genero;
  document.getElementById("duracao-filme").textContent = filme.duracao;
  document.getElementById("dataadd-filme").textContent = dataFormatada;
  document.getElementById("classificacao-filme").textContent = filme.classificacao;
  document.getElementById("nota-filme").textContent = parseFloat(filme.notaUsuario).toFixed(1);
  document.getElementById("elenco-filme").textContent = filme.elenco;
  document.getElementById("sinopse-filme").textContent = filme.sinopse;
  document.getElementById("poster-filme").src = filme.poster;
  document.getElementById("poster-filme").alt = `Poster de ${filme.titulo}`;
} else {
  alert("Filme não encontrado.");
}

document.querySelector("#btnEditar").href = `cadastro.html?id=${filme.id}`;