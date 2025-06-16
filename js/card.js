function createMovieCard(movie) {
  const sinopseResumida = movie.sinopse.length > 45
    ? movie.sinopse.slice(0, 45) + "..."
    : movie.sinopse;

  const notaFormatada = parseFloat(movie.notaUsuario).toFixed(1);

  return `
    <div class="col card-filme">
      <div class="card shadow-white h-100">
        <div class="position-relative">
          <div id="nota-filme" class=" badge position-absolute top-0 end-0 border border-light rounded-pill p-2 m-2 shadow-badge fw-bold">
          ${notaFormatada}
          </div>
          <img src="${movie.poster}" class="card-img-top" alt="${movie.titulo}">
          
        </div>
        <div class="card-body">
        
          <div class="d-flex justify-content-between align-items-center">
            <h5 class="card-title">${movie.titulo}
            <span class="text-body-secondary fs-6">(${movie.ano})</span></h5>
          </div>
          <h6 class="card-subtitle mb-2 text-body-secondary">${movie.diretor}</h6>
          <p class="card-text">${sinopseResumida}</p>
          <a href="ficha.html?id=${movie.id}" class="stretched-link"></a>
        </div>
        <div class="card-footer bg-transparent d-flex justify-content-between">
          <span class="text-muted">${movie.genero}</span>
          <span class="text-muted">${movie.duracao}</span>
        </div>
      </div>
    </div>
  `;
}

