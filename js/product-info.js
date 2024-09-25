document.addEventListener('DOMContentLoaded', function(){
    let productID = localStorage.getItem("productID")
    console.log (productID)
    let direccion =`https://japceibal.github.io/emercado-api/products/${productID}.json`
    let comentariosURL =`https://japceibal.github.io/emercado-api/products_comments/${productID}.json`
    getJSONData(direccion).then(function(respObj){
    if(respObj.status == "ok"){
        console.log(respObj.data)
        infoProduct = respObj.data
        cargarProducto(infoProduct)
        cargarCategoriaBreadcrumb(respObj.data)
    }
    getJSONData(comentariosURL).then(function(respObj){
      if(respObj.status == "ok"){
        console.log(respObj.data)
        cargarComentarios(respObj.data)
    }
    })

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

let contenedorComentario = document.getElementById('comentarios-contenedor')

function cargarComentarios(comentarios){
  contenedorComentario.innerHTML=""
  comentarios.forEach(element => {
  stars=element.score
  console.log(stars)
  let starRating =""
  if (stars<=1.2){
    starRating=`<i class="fa fa-star checked"></i>
    <i class="fa fa-star"></i>
    <i class="fa fa-star"></i>
    <i class="fa fa-star"></i>
    <i class="fa fa-star"></i>
    `
  } else if (stars>1.2 && stars<=1.7){
    starRating=`<i class="fa fa-star checked"></i>
    <i class="fa-regular fa-star-half-stroke checked"></i>
    <i class="fa fa-star"></i>
    <i class="fa fa-star"></i>
    <i class="fa fa-star"></i>
    `
  } else if (stars>1.7 && stars<=2.2){
    starRating=`<i class="fa fa-star checked"></i>
    <i class="fa fa-star checked"></i>
    <i class="fa fa-star"></i>
    <i class="fa fa-star"></i>
    <i class="fa fa-star"></i>
    `
  } else if (stars>2.2 && stars<=2.7){
    starRating=`<i class="fa fa-star checked"></i>
    <i class="fa fa-star checked"></i>
    <i class="fa-regular fa-star-half-stroke checked"></i>
    <i class="fa fa-star"></i>
    <i class="fa fa-star"></i>
    `
  } else if (stars>2.7 && stars<=3.2){
    starRating=`<i class="fa fa-star checked"></i>
    <i class="fa fa-star checked"></i>
    <i class="fa fa-star checked"></i>
    <i class="fa fa-star"></i>
    <i class="fa fa-star"></i>
    `
  } else if (stars>3.2 && stars<= 3.7){
    starRating=`<i class="fa fa-star checked"></i>
    <i class="fa fa-star checked"></i>
    <i class="fa fa-star checked"></i>
    <i class="fa-regular fa-star-half-stroke checked"></i>
    <i class="fa fa-star"></i>
    `
  } else if (stars>3.7 && stars<= 4.2){
    starRating=`<i class="fa fa-star checked"></i>
    <i class="fa fa-star checked"></i>
    <i class="fa fa-star checked"></i>
    <i class="fa fa-star checked"></i>
    <i class="fa fa-star"></i>
    `
  } else if (stars>4.2 && stars<= 4.7){
    starRating=`<i class="fa fa-star checked"></i>
    <i class="fa fa-star checked"></i>
    <i class="fa fa-star checked"></i>
    <i class="fa fa-star checked"></i>
    <i class="fa-regular fa-star-half-stroke checked"></i>
    `
  } else if (stars>4.7){
    starRating=`<i class="fa fa-star checked"></i>
    <i class="fa fa-star checked"></i>
    <i class="fa fa-star checked"></i>
    <i class="fa fa-star checked"></i>
    <i class="fa fa-star checked"></i>
    `
  }
  contenedorComentario.innerHTML +=`
  <a href="#" class="list-group-item list-group-item-action" aria-current="true">
    <div class="d-flex w-100 justify-content-between">
      <h5 class="mb-1">${element.user}</h5>
      <small>${starRating}</small>
    </div>
    <p class="mb-1">${element.description}</p>
    <small>${element.dateTime}</small>
  </a>
  `
  });
}