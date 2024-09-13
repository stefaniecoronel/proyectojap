document.addEventListener('DOMContentLoaded', function(){
    let productID = localStorage.getItem("productID")
    console.log (productID)
    let direccion =`https://japceibal.github.io/emercado-api/products/${productID}.json`
    getJSONData(direccion).then(function(respObj){
    if(respObj.status == "ok"){
        console.log(respObj.data)
        infoProduct = respObj.data
        cargarProducto(infoProduct)
        cargarCategoriaBreadcrumb(respObj.data)
    }

});
});

let contenedorInfo = document.getElementById("info");
let imagenes = document.getElementById("imagenes");

function cargarProducto(producto){
    let arregloImagenes = producto.images
    imagenes.innerHTML = "" ;
    if (arregloImagenes.length>0){
        imagenes.innerHTML +=`<div class="carousel-item active">
        <img src=${arregloImagenes[0]} class="d-block w-100" alt=${producto.name}>
        </div>`
        for(let i = 1; i < arregloImagenes.length; i++){
        imagenes.innerHTML+=`<div class="carousel-item">
        <img src=${arregloImagenes[i]} class="d-block w-100" alt=${producto.name}>
        </div>`
        }
    }    
    contenedorInfo.innerHTML = `<div class="card-body">
        <h5 class="card-title">${producto.name}</h5>
        <br>
        <p class="card-text">${producto.description}</p>
        <br>
        <h5 class="card-title">${producto.currency} ${producto.cost}</h5>
        <br>
        <p class="card-text mt-auto"><small class="text-muted">${producto.soldCount} unidades vendidas.</small></p>
        </div>`
};

let contenedorBreadcrumb = document.getElementById('breadcrumb-cat')

function cargarCategoriaBreadcrumb(producto){
    contenedorBreadcrumb.innerHTML +=`<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="categories.html">Categorías</a></li>
    <li class="breadcrumb-item"><a href="products.html">${producto.category}</a></li>
    <li class="breadcrumb-item active" aria-current="page">${producto.name}</a></li>
  </ol>
</nav>`
  }
