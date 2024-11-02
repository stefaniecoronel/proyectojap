let productosCarrito = JSON.parse(localStorage.getItem('producto-carrito'))
console.log(productosCarrito)

if (productosCarrito){
  productosCarrito = productosCarrito.map(producto => ({ ...producto, cantidad: producto.cantidad || 1 }));
}

localStorage.setItem('producto-carrito', JSON.stringify(productosCarrito))

let contenedorProductosCarrito = document.getElementById('contenedor-productos-carrito')


document.addEventListener('DOMContentLoaded', function(){

cargarCarrito ();

let contenedorTotalCompra = document.getElementById('total-compra')
let contenedorTotalArticulos= document.getElementById('cantidad-articulos')

let totalArticulos = totalCarrito()
contenedorTotalArticulos.textContent = totalArticulos > 0 ? totalArticulos: '0'

let totalCompra = totalCosto();
contenedorTotalCompra.textContent = `UYU ${totalCompra.toLocaleString('es-ES')}`

});

function cargarCarrito () {
  let productosCarrito = JSON.parse(localStorage.getItem('producto-carrito'))
  contenedorProductosCarrito.innerHTML = ''
  if (!productosCarrito  || productosCarrito.length === 0){
    contenedorProductosCarrito.innerHTML = `
    <div class="alert alert-primary text-center">
    No hay productos en su carrito aún.
    </div> `
} else {

  productosCarrito.forEach((productoCarrito, index) => { 
    contenedorProductosCarrito.innerHTML += `<div class="justify-content-center d-flex">
    <div class="card">
    <div class="card position-relative">
    <i class="fas fa-trash-alt text-secondary position-absolute" id="eliminar-${productoCarrito.id}" style="top: 10px; right: 10px; cursor: pointer;"></i>
    <div class="row">
    <div class="col-md-4">
      <img src="${productoCarrito.image}" class="img-fluid rounded-start h-100" alt="${productoCarrito.name}">
    </div>
    <div class="col-md-8 d-flex flex-column justify-content-between">
      <div class="card-body">
        <h5 class="card-title">${productoCarrito.name}</h5>
        <h5 class="card-title">${productoCarrito.currency} ${productoCarrito.cost}</h5>
        <input type="number" id="cantidad-${productoCarrito.id}" class="form-control w-25" min="1"  value="${productoCarrito.cantidad}">
        <p class="card-text">Subtotal: <span id="subtotal-${productoCarrito.id}">${productoCarrito.cost}</span></p>
      </div>
    </div>
    </div>
    </div>
    </div>
    `

    
  });

}

actualizarCarrito ();

}

function actualizarCarrito(){
  if (productosCarrito){
    productosCarrito.forEach((productoCarrito, index) => {
      let inputCantidad = document.getElementById(`cantidad-${productoCarrito.id}`);
      let subtotalElemento = document.getElementById(`subtotal-${productoCarrito.id}`);
      let botonEliminar = document.getElementById(`eliminar-${productoCarrito.id}`)
      
      //Escucha si se da click en el botón eliminar el artículo
      botonEliminar.addEventListener('click', function (){
        productosCarrito.splice(index, 1)
        localStorage.setItem('producto-carrito', JSON.stringify(productosCarrito))
        cargarCarrito ();
        updateTotals ();
  
      })
    
      // Escucha cambios en el input de cantidad
      inputCantidad.addEventListener('input', function() {
          let cantidad = parseInt(inputCantidad.value) || 1; // Asegura que cantidad sea al menos 1
          let subtotal = productoCarrito.cost * cantidad;
          subtotalElemento.textContent = subtotal;
          
          productosCarrito[index] = { ...productosCarrito[index], cantidad };
    
          localStorage.setItem('producto-carrito', JSON.stringify(productosCarrito));
    
          updateTotals();
          
     });
     
    
    });
  }

}

function totalCosto() {
  let productosCarrito = JSON.parse(localStorage.getItem('producto-carrito')) || [];
  let costos = productosCarrito.map(({ currency, cost, cantidad }) => ({prodCurrency: currency, totalCost: cost * cantidad}));
  
  let costosPesosUy = 0
  let conversion = parseFloat(localStorage.getItem('conversion'))
  console.log(conversion)

  if (costos.some(element => element.prodCurrency === 'USD')){
    costosPesosUy = costos.map((element) => 
      element.prodCurrency === 'USD'
      ? (element.totalCost)*conversion
      : (element.totalCost)
    )
  } else {
    costosPesosUy = costos.map(({ totalCost }) => totalCost)
  }
  console.log(costosPesosUy)
  let total = parseFloat(sumarArray(costosPesosUy).toFixed(2));
  return total;
}


function updateTotals() {
  let totalArticulos = 0;
  let totalCompra = 0;

  totalArticulos = totalCarrito();
  totalCompra = totalCosto();

  document.getElementById('cantidad-articulos').textContent = totalArticulos > 0 ? totalArticulos : '0';
  document.getElementById('total-compra').textContent = `UYU ${totalCompra.toLocaleString('es-ES')}`;
  updateBadge(totalArticulos);
}


function updateBadge(totalArticulos) {
  let badgeElement = document.getElementById('badge-carrito');
  badgeElement.textContent = totalArticulos > 0 ? totalArticulos : '0';
}



//Solicitud a API para obtener valor de conversión de dólares a pesos uruguayos dado que en la página tenemos artículos con ambas monedas.
fetch('https://v6.exchangerate-api.com/v6/63fb12f25259372da4224fab/latest/USD')
  .then(response => {
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  })
  .then(data => {
    let usdToUyu = data.conversion_rates.UYU;
    console.log(`1 USD = ${usdToUyu} UYU`);
    localStorage.setItem ('conversion', usdToUyu)
    
  })
  .catch(error => {
    console.error('Error fetching exchange rate:', error);
    
  });

