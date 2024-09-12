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

let contenedorProducto = document.getElementById("containerProduct");
let imagenes = document.getElementById("imagenes");

function cargarProducto(producto){
    let arregloImagenes = producto.images
    arregloImagenes.forEach((element) => {
        imagenes.innerHTML+=`<div class="carousel-item active">
        <img src=${element} class="d-block w-100" alt="auto">
        </div>`
    });
};

//<div class="carousel-item">
//<img src="" class="d-block w-100" alt="...">
//</div>