document.addEventListener('DOMContentLoaded', function () {
let contenedor = document.getElementById('listado-articulos');

fetch("https://japceibal.github.io/emercado-api/cats_products/101.json")
.then(response => response.json())
.then(data => {
    data.products.forEach( articulo => {
        const columna = document.createElement('div');
        columna.className = 'col-md-4';
        columna.innerHTML = `
        <div class="card mb-3" style="max-width: 540px;">
        <div class="row g-0">
        <div class="col-md-4">
          <img src="${articulo.image}" class="img-fluid rounded-start" alt="${articulo.name}">
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">${articulo.name}</h5>
            <p class="card-text">${articulo.description}</p>
            <h5 class="card-title">${articulo.currency}${articulo.cost}</h5>
            <p class="card-text"><small class="text-muted">${articulo.soldCount} unidades vendidas.</small></p>
          </div>
        </div>
      </div>
    </div>`;
    contenedor.appendChild(columna);
   
    });
})
});