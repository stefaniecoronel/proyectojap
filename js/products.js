
document.addEventListener('DOMContentLoaded', function(){
  let catID = localStorage.getItem("catID")
  console.log (catID)
  let direccion =`https://japceibal.github.io/emercado-api/cats_products/${catID}.json`
  let productos = []
  getJSONData(direccion).then(function(respObj){
    if(respObj.status == "ok"){
      console.log(respObj.data.products)
      productos = respObj.data.products
      cargarArticulos(productos)
      cargarCategoria(respObj.data.catName)

    }
  })
  document.getElementById("clearRangeFilter").addEventListener("click", function(){
    document.getElementById("rangeFilterPriceMin").value = "";
    document.getElementById("rangeFilterPriceMax").value = "";

    minCost = undefined;
    maxCost = undefined;

    cargarArticulos(productos);
  });

document.getElementById("rangeFilterCount").addEventListener("click", function(){
    //Obtengo el mínimo y máximo de los intervalos para filtrar por precio.
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

    cargarArticulos(productos);
  });
})


let contenedor=document.getElementById('listado-articulos')
function cargarArticulos (arreglo){
  contenedor.innerHTML = ""
  arreglo.forEach((element) =>{
    if (((minCost == undefined) || (minCost != undefined && parseInt(element.cost) >= minCost)) &&
        ((maxCost == undefined) || (maxCost != undefined && parseInt(element.cost) <= maxCost))) {
          contenedor.innerHTML = `
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
  function cargarCategoria(categoria){
    contenedorTitulo.innerHTML +=`<h2>${categoria}</h2>`
    contenedorBreadcrumb.innerHTML +=`<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="categories.html">Categorías</a></li>
    <li class="breadcrumb-item active" aria-current="page">${categoria}</li>
  </ol>
</nav>`
  }

  const ORDER_ASC_BY_PRICE = "Az";
  const ORDER_DESC_BY_PRICE = "Za";
  const ORDER_BY_PROD_REL = "Rel";
  let currentCategoriesArray = [];
  let currentSortCriteria = undefined;
  let minCost = undefined;
  let maxCost = undefined;
  
  function sortCategories(criteria, array){
      let result = [];
      if (criteria === ORDER_ASC_BY_PRICE)
      {
          result = array.sort(function(a, b) {
              if ( a.cost < b.cost ){ return -1; }
              if ( a.cost > b.cost ){ return 1; }
              return 0;
          });
      }else if (criteria === ORDER_DESC_BY_PRICE){
          result = array.sort(function(a, b) {
              if ( a.cost > b.cost ){ return -1; }
              if ( a.cost < b.cost ){ return 1; }
              return 0;
          });
      }else if (criteria === ORDER_BY_PROD_REL){
          result = array.sort(function(a, b) {
              let aCount = parseInt(a.soldCount);
              let bCount = parseInt(b.soldCount);
  
              if ( aCount > bCount ){ return -1; }
              if ( aCount < bCount ){ return 1; }
              return 0;
          });
      }
  
      return result;
  } 

  