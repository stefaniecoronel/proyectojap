let productosCarrito = JSON.parse(localStorage.getItem('producto-carrito'))
console.log(productosCarrito)

document.addEventListener('DOMContentLoaded', function(){

let contenedorProductosCarrito = document.getElementById('contenedor-productos-carrito')

if (productosCarrito == undefined){
    contenedorProductosCarrito.innerHTML = `
    <div class="alert alert-primary text-center">
    No hay productos en su carrito aún.
    </div> `
} else {contenedorProductosCarrito.innerHTML += `<div class="justify-content-center d-flex">
    <div class="card">
    <div class="row">
    <div class="col-md-4">
      <img src="${productosCarrito.image}" class="img-fluid rounded-start h-100" alt="${productosCarrito.name}">
    </div>
    <div class="col-md-8 d-flex flex-column justify-content-between">
      <div class="card-body">
        <h5 class="card-title">${productosCarrito.name}</h5>
        <h5 class="card-title">${productosCarrito.currency} ${productosCarrito.cost}</h5>
        <input type="number" id="cantidad-${productosCarrito.id}" class="form-control w-25" min="1" max="99" value="1">
        <p class="card-text">Subtotal: <span id="subtotal-${productosCarrito.id}">${productosCarrito.cost}</span></p>
        
      </div>
    </div>
    </div>
    </div>`

}



let inputCantidad = document.getElementById(`cantidad-${productosCarrito.id}`);
let subtotalElemento = document.getElementById(`subtotal-${productosCarrito.id}`);

// Escucha cambios en el input de cantidad
inputCantidad.addEventListener('input', function() {
      let cantidad = parseInt(inputCantidad.value) || 1; // Asegura que cantidad sea al menos 1
      let subtotal = productosCarrito.cost * cantidad;
      subtotalElemento.textContent = subtotal;
 });



});








