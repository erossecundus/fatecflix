// pega id pela URL se for editar
const params = new URLSearchParams(window.location.search);
const idFilme = params.get("id");

// variavel para guardar imagem
let imagemBase64 = "";

// funçao para gerar um id
function gerarNovoId(lista) {
  if (filmesSalvos.length === 0) return 1;
  return filmesSalvos[filmesSalvos.length - 1].id + 1;
}

// carrega filmes do localStorage ou mockados
const filmesSalvos = JSON.parse(localStorage.getItem("filmes")) || [];

// Se for edição, carrega os dados no formulário
if (idFilme) {
  const filme = filmesSalvos.find(f => f.id == idFilme);
  if (filme) {
    document.getElementById("inputTitulo").value = filme.titulo;
    document.getElementById("inputAno").value = filme.ano;
    document.getElementById("inputClassificacao").value = filme.classificacao;
    document.getElementById("inputGenero").value = filme.genero;
    document.getElementById("inputDuracao").value = filme.duracao;
    document.getElementById("inputNota").value = filme.notaUsuario;
    document.getElementById("inputDirecao").value = filme.diretor;
    document.getElementById("inputElenco").value = filme.elenco;
    document.getElementById("inputSinopse").value = filme.sinopse;

    const img = document.getElementById("previewImage");
    img.classList.remove("d-none");
    img.src = filme.poster;
    document.getElementById("uploadIcon").classList.add("d-none");


    // Habilita botão Alterar / Excluir
    document.getElementById("btnCadastrar").disabled = true;
    document.getElementById("btnAlterar").disabled = false;
    document.getElementById("btnExcluir").disabled = false;
  }
}

function mostrarPreview(event) {
  const input = event.target;
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      imagemBase64 = e.target.result;

      const img = document.getElementById("previewImage");
      img.src = imagemBase64;
      img.classList.remove("d-none");

      // Esconde ícone
      document.getElementById("uploadIcon").classList.add("d-none");
    };
    reader.readAsDataURL(file);
  }
}

// salvando um filme
document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();

  const hoje = new Date();
  const dataAdicao = hoje.toISOString().slice(0, 10);

  const filme = {
    id: gerarNovoId(filmesSalvos),
    dataAdicao: dataAdicao,
    titulo: document.getElementById("inputTitulo").value,
    ano: document.getElementById("inputAno").value,
    classificacao: document.getElementById("inputClassificacao").value,
    genero: document.getElementById("inputGenero").value,
    duracao: document.getElementById("inputDuracao").value,
    notaUsuario: document.getElementById("inputNota").value,
    diretor: document.getElementById("inputDirecao").value,
    elenco: document.getElementById("inputElenco").value,
    sinopse: document.getElementById("inputSinopse").value,
    poster: imagemBase64 // aqui vai o base64
  };

  // Adiciona novo filme
  filmesSalvos.push(filme);

  // Salva de volta
  localStorage.setItem("filmes", JSON.stringify(filmesSalvos));

  alert("Filme salvo com sucesso!");
  window.location.href = "index.html";
});

// alterando um filme
document.getElementById("btnAlterar").addEventListener("click", function () {
  const index = filmesSalvos.findIndex(f => f.id == idFilme);
  if (index === -1) {
    alert("Filme não encontrado.");
    return;
  }

  filmesSalvos[index] = {
    ...filmesSalvos[index], // preserva dataAdicao e outros dados
    titulo: document.getElementById("inputTitulo").value,
    ano: document.getElementById("inputAno").value,
    classificacao: document.getElementById("inputClassificacao").value,
    genero: document.getElementById("inputGenero").value,
    duracao: document.getElementById("inputDuracao").value,
    notaUsuario: document.getElementById("inputNota").value,
    diretor: document.getElementById("inputDirecao").value,
    elenco: document.getElementById("inputElenco").value,
    sinopse: document.getElementById("inputSinopse").value,
    poster: imagemBase64 || filmesSalvos[index].poster // mantém imagem antiga se não alterar
  };

  localStorage.setItem("filmes", JSON.stringify(filmesSalvos));
  alert("Filme alterado com sucesso!");
  window.location.href = "index.html";
});

// excluindo um filme
document.getElementById("btnExcluir").addEventListener("click", function () {
  if (!idFilme) return;

  if (!confirm("Tem certeza que deseja excluir este filme?")) return;

  const novosFilmes = filmes.filter(f => f.id != idFilme);

  localStorage.setItem("filmes", JSON.stringify(novosFilmes));

  alert("Filme excluído com sucesso!");
  window.location.href = "index.html";
});

// buscando na API TMDB
const API_KEY = "2036b4a76c04beed6fa3660aff15f9ea";
const resultadoTMDB = document.getElementById("resultadoTMDB");

document.getElementById("inputSearchTMDB").addEventListener("input", async () => {
  const query = document.getElementById("inputSearchTMDB").value.trim();
  if (!query) return;

  const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}`;

  try {
    const resposta = await fetch(url);
    const dados = await resposta.json();

    resultadoTMDB.innerHTML = "";
    dados.results.slice(0, 5).forEach(filme => {
      const item = document.createElement("li");
      item.classList.add("list-group-item", "list-group-item-action");
      item.textContent = `${filme.title} (${filme.release_date?.split("-")[0] || "?"})`;
      item.addEventListener("click", () => carregarFilmeTMDB(filme.id));
      resultadoTMDB.appendChild(item);
    });
  } catch (erro) {
    console.error("Erro ao buscar filmes na TMDB:", erro);
  }
});

async function carregarFilmeTMDB(idTMDB) {
  const urlDetalhes = `https://api.themoviedb.org/3/movie/${idTMDB}?api_key=${API_KEY}&language=pt-BR`;
  const urlCreditos = `https://api.themoviedb.org/3/movie/${idTMDB}/credits?api_key=${API_KEY}&language=pt-BR`;

  try {
    const resposta = await fetch(urlDetalhes);
    const filme = await resposta.json();

    // Preenche os campos
    document.getElementById("inputTitulo").value = filme.title || "";
    document.getElementById("inputAno").value = filme.release_date?.split("-")[0] || "";
    document.getElementById("inputClassificacao").value = filme.adult ? "18" : "Livre";
    document.getElementById("inputGenero").value = filme.genres?.map(g => g.name).join(", ") || "";
    document.getElementById("inputDuracao").value = filme.runtime || "";
    document.getElementById("inputNota").value = filme.vote_average?.toFixed(1) || "";
    document.getElementById("inputSinopse").value = filme.overview || "";

    // Créditos (direção e elenco)
    const respostaCreditos = await fetch(urlCreditos);
    const creditos = await respostaCreditos.json();

    // Diretor (filtra pelo cargo "Director")
    const diretor = creditos.crew.find(p => p.job === "Director");
    document.getElementById("inputDirecao").value = diretor ? diretor.name : "";

    // Elenco (pega os primeiros 4 atores)
    const elenco = creditos.cast.slice(0, 4).map(a => a.name).join(", ");
    document.getElementById("inputElenco").value = elenco;

    // Poster
    if (filme.poster_path) {
      const posterUrl = `https://image.tmdb.org/t/p/w500${filme.poster_path}`;
      const img = document.getElementById("previewImage");
      img.src = posterUrl;
      img.classList.remove("d-none");
      document.getElementById("uploadIcon").classList.add("d-none");

      // Converte a imagem em Base64
      const respostaImg = await fetch(posterUrl);
      const blob = await respostaImg.blob();
      const reader = new FileReader();
      reader.onloadend = function () {
        imagemBase64 = reader.result;
      };
      reader.readAsDataURL(blob);
    }

    // Oculta os resultados da busca
    resultadoTMDB.innerHTML = "";

  } catch (erro) {
    console.error("Erro ao carregar detalhes do filme:", erro);
  }
}