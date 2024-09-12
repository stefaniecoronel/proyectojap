document.addEventListener('DOMContentLoaded', function(){
    let productID = localStorage.getItem("productID")
    console.log (productID)
    let direccion =`https://japceibal.github.io/emercado-api/products/${productID}.json`
    //Cargo en la página los artículos a través del JSON.
    getJSONData(direccion).then(function(respObj){
    if(respObj.status == "ok"){
        console.log(respObj.data)
        infoProduct = respObj.data
        cargarProducto(infoProduct)
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
        <img src=${arregloImagenes[0]} class="d-block w-100" alt="auto">
        </div>`
        for(let i = 1; i < arregloImagenes.length; i++){
        imagenes.innerHTML+=`<div class="carousel-item">
        <img src=${arregloImagenes[i]} class="d-block w-100" alt="auto">
        </div>`
        }
    }    
    contenedorInfo.innerHTML = `<div class="card-body">
        <h5 class="card-title">${producto.name}</h5>
        <p class="card-text">${producto.description}</p>
        <h5 class="card-title">${producto.currency} ${producto.cost}</h5>
        <p class="card-text mt-auto"><small class="text-muted">${producto.soldCount} unidades vendidas.</small></p>
        </div>`
};


