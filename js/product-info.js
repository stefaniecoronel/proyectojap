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
        console.log(respObj.data.relatedProducts)
        cargarProductosRelacionados(respObj.data.relatedProducts)
    }
    getJSONData(comentariosURL).then(function(respObj){
      if(respObj.status == "ok"){
        console.log(respObj.data)
        cargarComentarios(respObj.data)
    }
    })
    let displayMode = localStorage.getItem('nightMode')
     if (displayMode=="enabled"){
     document.documentElement.setAttribute('data-bs-theme','dark') //agrego el atributo de bootstrap correspondiente a dark theme a todo el html
     }
     else {
      document.documentElement.setAttribute('data-bs-theme','light') //agrego el atributo de bootstrap correspondiente a light theme a todo el html
    }
    

  });
//Al hacer click en el botón enviar del formulario se evalua si hay contenido en el textarea o 
//alguna estrella seleccionada. Si algo de esto ocurre se guarda el comentario en el localStorage.
document.getElementById("enviar-comentario").addEventListener('click', function(){
  let comentarioNuevo = document.getElementById('comentario-nuevo').value
  let ratings = document.getElementsByName('rating') 
  let fechaComentario = formatearFecha()
  let nombreUsuario = localStorage.getItem('nombre')
  let producto =  localStorage.getItem('productID') // Se guarda este dato para que luego los comentarios realizados solo aparezcan en la página del producto al que corresponden.
  let userRating = 0
  if (comentarioNuevo || (document.querySelector('input[name="rating"]:checked')) ) {
    //El for se utiliza para saber cuantas estrellas se le puso al producto en función del value del radio button seleccionado.
    for (let i=0; i< ratings.length; i++){
      if (ratings[i].checked){
          userRating = ratings[i].value
          break; 
      }
    }
    //Se define un objeto con todos los datos del comentario.
    let review = {identificador:producto, usuario:nombreUsuario, comentario:comentarioNuevo, rating:userRating, fecha:fechaComentario}
    let comentariosRealizados;
    // Se chequea si hay datos guardados en el local storage con la key 'comentarios-realizados', si los hay
    // se los almacena en formato de array en la variable comentariosRealizados, si no los hay se define dicha variable
    // como un array vacío.
    if (localStorage.getItem('comentarios-realizados')){
      comentariosRealizados = JSON.parse(localStorage.getItem('comentarios-realizados'));
    } else {
      comentariosRealizados = [];
  }

    comentariosRealizados.push(review) //Se agrega el comentario realizado al array de comentarios.
    //Se guarda el array de comentarios luego de convertirlo a formato JSON en el local storage.
    localStorage.setItem('comentarios-realizados', JSON.stringify(comentariosRealizados))
    
  
   
  }
  else { 
    alert ("Debe ingresar un comentario o calificación.")
  }
  
});
agregarComentario();
});

let contenedorInfo = document.getElementById("info");
let imagenes = document.getElementById("imagenes");

//Esta función se utiliza para cargar el producto en un formato de carousel además de su información como una card.
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
        <button onclick="agregarCarrito('${producto.name}', '${producto.description}', '${producto.currency}', '${producto.cost}', '${producto.soldCount}', '${producto.images[0]}','${producto.id}' )" class="btn btn-primary">Comprar</button>
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

//Esta función se utiliza para cargar los comentarios asociados a cada producto que se encuentran en el JSON.
function cargarComentarios(comentarios){
  contenedorComentario.innerHTML=""
  comentarios.forEach(element => {
  stars=element.score
  console.log(stars)
  contenedorComentario.innerHTML +=`
  <a href="#" class="list-group-item list-group-item-action" aria-current="true">
    <div class="d-flex w-100 justify-content-between flex-wrap custom-flex">
      <h5 class="mb-1">${element.user}</h5>
      <small>${showStars(stars)}</small>
    </div>
    <p class="mb-1">${element.description}</p>
    <small>${element.dateTime}</small>
  </a>
  `
  });
}
let contenedorComentariosNuevos = document.getElementById('comentarios-nuevos-contenedor')
//Esta función se utiliza para agregar los comentarios realizados mediante la sección de enviar comentario.
//Agrega todos los comentarios que se guardaron en el local storage con la key 'comentarios-realizados'.
function agregarComentario()  {
  productoActual = localStorage.getItem('productID')
  contenedorComentariosNuevos.innerHTML = "";
  let comentariosRealizados = JSON.parse(localStorage.getItem('comentarios-realizados'));
  console.log(comentariosRealizados)
  comentariosRealizados.forEach(element => 
    {if (element.identificador==productoActual){
      contenedorComentariosNuevos.innerHTML +=`
      <a href="#" class="list-group-item list-group-item-action" aria-current="true">
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">${element.usuario}</h5>
          <small>${showStars(element.rating)}</small>
        </div>
        <p class="mb-1">${element.comentario}</p>
        <small>${element.fecha}</small>
      </a>
      `}}
  )
  };

  let contenedorProdRelacionados = document.getElementById('productos-relacionados')

//Esta función se utiliza para añadir a la página los productos relacionados mediante un formato de cards.
function cargarProductosRelacionados (prodRelacionados){
  contenedorProdRelacionados.innerHTML=""
  prodRelacionados.forEach(element => {
    contenedorProdRelacionados.innerHTML+=`
     <div class="card" onclick="setProductID(${element.id})">
    <img src="${element.image}" class="card-img-top" alt="foto ${element.name}">
    <div class="card-body">
      <h5 class="card-title">${element.name}</h5>
    </div>
    </div>
    `
  });
}

//Esta función retorna una porción de código html con la cantidad de estrellas correspondientes
//a un puntaje.
function showStars (stars) {
  let starRating ="";
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
 return starRating;
};

// Esta función permite retornar la fecha y hora de los comentarios agregados con el
//formato de fecha que utilizan los comentarios que se encuentran en el JSON.
function formatearFecha(){
 let fecha = new Date() // Se guarda fecha y hora al momento de que se hace el comentario.
 // Se obtiene cada parte de la fecha y la hora.
 let year = fecha.getFullYear();
 let month = String(fecha.getMonth() + 1).padStart(2, '0'); //Se utiliza padStart para agregar un 0 a la izquierda si es necesario.
 let day = String(fecha.getDate()).padStart(2, '0');

 let hours = String(fecha.getHours()).padStart(2, '0');
 let minutes = String(fecha.getMinutes()).padStart(2, '0');
 let seconds = String(fecha.getSeconds()).padStart(2, '0');
 //Se rearma la fecha en el formato deseado.
 let fechaFormateada = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
 return fechaFormateada
}

function setProductID(id) {
  localStorage.setItem("productID", id);
  window.location = "product-info.html"
}

//Al hacer click en el botón comprar, se ejecuta esta función que guarda los datos del producto en el localStorage y redirige a la página del carrito. 
function agregarCarrito(productName, productDescription, productCurrency, productCost, productSoldCount, productImage, productID) {
  
  let arregloProductosCarrito = JSON.parse(localStorage.getItem('producto-carrito')) || [];
  console.log(arregloProductosCarrito)

  let productoCarrito = { 
    name: productName , 
    description:productDescription , 
    currency: productCurrency , 
    cost: productCost , 
    soldCount:productSoldCount,
    image: productImage,
    id: productID
  }
  arregloProductosCarrito.push(productoCarrito)
  console.log(arregloProductosCarrito)
  localStorage.setItem ('producto-carrito', JSON.stringify(arregloProductosCarrito))
 
 window.location.href = "cart.html";
}

