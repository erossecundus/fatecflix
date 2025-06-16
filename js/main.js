// script principal da aplicação

// carrega filmes do localStorage ou mockados
const filmesSalvos = JSON.parse(localStorage.getItem("filmes")) || [];

if (filmesSalvos.length > 0) {
  document.getElementById("btnComece").classList.add("d-none");
}

// Carregar e exibir cards
const container = document.getElementById("movie-list");
filmesSalvos.forEach(filme => {
  container.innerHTML += createMovieCard(filme);
});

// filtrando pela busca
document.getElementById("inputSearchMyMovies").addEventListener("input", function () {
  const busca = this.value.toLowerCase();
  const cards = document.querySelectorAll(".card-filme"); // ou o seletor usado

  cards.forEach(card => {
    const titulo = card.querySelector(".card-title").textContent.toLowerCase();
    if (titulo.includes(busca)) {
      card.classList.remove("d-none");
    } else {
      card.classList.add("d-none");
    }
  });
});