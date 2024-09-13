

document.addEventListener('DOMContentLoaded', function(){
  let catID = localStorage.getItem("catID")
  console.log (catID)
  let direccion =`https://japceibal.github.io/emercado-api/cats_products/${catID}.json`
  //Cargo en la página los artículos a través del JSON.
  getJSONData(direccion).then(function(respObj){
    if(respObj.status == "ok"){
      console.log(respObj.data.products)
      currentProductsArray = respObj.data.products
      cargarArticulos(currentProductsArray)
      cargarCategoria(respObj.data.catName)

    }
  })
  //Agrego la funcionalidad de ordenar de forma ascendente al correspondiente botón.
  document.getElementById("sortAsc").addEventListener("click", function(){
    ordenarYCargarArticulos(ORDER_ASC_BY_PRICE);
  });
  //Agrego la funcionalidad de ordenar de forma descendente al correspondiente botón.
  document.getElementById("sortDesc").addEventListener("click", function(){
    ordenarYCargarArticulos(ORDER_DESC_BY_PRICE);
  });
  //Agrego la funcionalidad de ordenar por relevancia al correspondiente botón.
  document.getElementById("sortByCount").addEventListener("click", function(){
    ordenarYCargarArticulos(ORDER_BY_PROD_REL);
  });

  document.getElementById("clearRangeFilter").addEventListener("click", function(){
    //Al hacer click en el botón limpiar minCost y maxCost pasan a ser undefined.
    document.getElementById("rangeFilterPriceMin").value = "";
    document.getElementById("rangeFilterPriceMax").value = "";

    minCost = undefined;
    maxCost = undefined;

    cargarArticulos(currentProductsArray);
  });

document.getElementById("rangeFilterCount").addEventListener("click", function(){
    //Obtengo el mínimo y máximo de los intervalos para poder filtrar por precio al usar la función cargarArticulos.
    minCost = document.getElementById("rangeFilterPriceMin").value;
    maxCost = document.getElementById("rangeFilterPriceMax").value;

    if ((minCost != undefined) && (minCost != "") && (parseInt(minCost)) >= 0){
        minCost = parseInt(minCost);
    }
    else{
        minCost = undefined;
    }

    if ((maxCost != undefined) && (maxCost != "") && (parseInt(maxCost)) >= 0){
        maxCost = parseInt(maxCost);
    }
    else{
        maxCost = undefined;
    }
    cargarArticulos(currentProductsArray);
  });
})


let contenedor=document.getElementById('listado-articulos')
//Esta función carga los artículos a partir de un arreglo.
function cargarArticulos (arreglo){
  contenedor.innerHTML = ""
  arreglo.forEach((element) =>{
    //Por cada elemento del arreglo me fijo si está definido el rango de precios y si este queda
    //dento del mismo.
    if (((minCost == undefined) || (minCost != undefined && parseInt(element.cost) >= minCost)) &&
        ((maxCost == undefined) || (maxCost != undefined && parseInt(element.cost) <= maxCost))) {
          contenedor.innerHTML += `
          <div class="col-lg-5 justify-content-center d-flex">
              <div class="card mb-2 h-100" style="max-width: 540px;">
              <div class="row g-0 h-100">
              <div class="col-md-4">
                <img src="${element.image}" class="img-fluid rounded-start h-100" alt="${element.name}">
              </div>
              <div class="col-md-8 d-flex flex-column justify-content-between">
                <div class="card-body">
                  <h5 class="card-title">${element.name}</h5>
                  <p class="card-text">${element.description}</p>
                  <h5 class="card-title">${element.currency} ${element.cost}</h5>
                  <p class="card-text mt-auto"><small class="text-muted">${element.soldCount} unidades vendidas.</small></p>
                </div>
              </div>
            </div>
          </div>`
        }

  })}
  let contenedorTitulo=document.getElementById('div-titulo-cat')
  let contenedorBreadcrumb=document.getElementById('breadcrumb-cat')
  //Esta función pone el título a la página, este corresponde a la categoría de artículos. 
  //También coloca la categoría de artículos al breadcrumb.
  function cargarCategoria(categoria){
    contenedorTitulo.innerHTML +=`<h2>${categoria}</h2>`
    contenedorBreadcrumb.innerHTML +=`<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="categories.html">Categorías</a></li>
    <li class="breadcrumb-item active" aria-current="page">${categoria}</li>
  </ol>
</nav>`
  }

  
function setProductID(id) {
  localStorage.setItem("productID", id);
  window.location = "product-info.html"
}

let busqueda = document.getElementById('buscar')

busqueda.addEventListener('input', function() {
  let buscar = busqueda.value.toLowerCase();
  let resultados = data.filter(products => 
    products.name.includes(busqueda) ||
    products.description.includes(busqueda)
  );
  
  mostrarResultados(resultados);
});

function mostrarResultados(resultados) {
  let contenedorResultados = document.getElementById('resultados');
  contenedorResultados.innerHTML = '';
  if (resultados.length === 0) {
    contenedorResultados.innerHTML = '<p>No se encontraron resultados.</p>';
  } else {
    resultados.forEach(product => {
      let div = document.createElement('div');
      div.innerHTML = `<strong>${product.name}</strong>: ${product.description}`;
      contenedorResultados.appendChild(div);
    });
  }
}