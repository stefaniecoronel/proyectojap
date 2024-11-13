// Traemos desde el localStorage la información de productos a los que se le hizo click en comprar.
let productosCarrito = JSON.parse(localStorage.getItem('producto-carrito'))
console.log(productosCarrito)

//Agregamos la propiedad cantidad a los elementos de productoCarrito si no la tienen con el valor de 1.
//No tienen esta propiedad cuando se los agrega haciendo click en el botón comprar de product-info. Si ya se encontraban en el carrito si la tienen, por eso se la llama como producto.cantidad.
if (productosCarrito && productosCarrito.length>0){
  productosCarrito = productosCarrito.map(producto => ({ ...producto, cantidad: producto.cantidad || 1 }));
}

//Actualizamos en el localStorage los productos del carrito.
localStorage.setItem('producto-carrito', JSON.stringify(productosCarrito))

//Contenedor del html donde vamos a colocar los elementos del carrito.
let contenedorProductosCarrito = document.getElementById('contenedor-productos-carrito')


document.addEventListener('DOMContentLoaded', function(){

//Al cargarse el contenido de la página, mostramos los elementos del carrito con la función cargarCarrito.
cargarCarrito ();

//En nuestro carrito decidimos colocar una sección de resumen de compra. Añadimos dinamicamente el total de articulos y el costo total,
//llamando a las funciones totalCarrito y totalCosto al cargar la página.
let contenedorTotalCompra = document.getElementById('total-compra')
let contenedorTotalArticulos= document.getElementById('cantidad-articulos')

let totalArticulos = totalCarrito()
contenedorTotalArticulos.textContent = totalArticulos > 0 ? totalArticulos: '0'

let totalCompra = totalCosto();
contenedorTotalCompra.textContent = `UYU ${totalCompra.toLocaleString('es-ES')}`

});

function cargarCarrito () {
  //Si no encuentra al array productosCarrito o es un array vacío (es decir no tenemos nada en el carrito aún),
  // se muestra un alert dando el mensaje de que nay productos en el acarrito aún.
  let productosCarrito = JSON.parse(localStorage.getItem('producto-carrito'))
  contenedorProductosCarrito.innerHTML = ''
  if (!productosCarrito  || productosCarrito.length === 0){
    contenedorProductosCarrito.innerHTML = `
    <div class="alert alert-primary text-center">
    No hay productos en su carrito aún.
    </div> `
} else {
  // En caso contrario, se inserta en el html los artículos que trajimos desde el localStorage mediante el array productosCarrito.
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
        <p class="card-text">Subtotal: ${productoCarrito.currency} <span id="subtotal-${productoCarrito.id}">${productoCarrito.cost}</span></p>
      </div>
    </div>
    </div>
    </div>
    </div>
    `

    
  });

}
//Como parte de la función cargarCarrito también llamamos a actualizarCarrito que es la que responde a eventos de cambio del input cantidad o a que se haga click en el botón para eliminar un artículo.
actualizarCarrito ();

}

function actualizarCarrito(){
  if (productosCarrito){
    productosCarrito.forEach((productoCarrito, index) => {
      let inputCantidad = document.getElementById(`cantidad-${productoCarrito.id}`);
      let subtotalElemento = document.getElementById(`subtotal-${productoCarrito.id}`);
      let botonEliminar = document.getElementById(`eliminar-${productoCarrito.id}`)
      
      //Escucha si se da click en el botón eliminar de cada artículo
      botonEliminar.addEventListener('click', function (){
        productosCarrito.splice(index, 1)
        localStorage.setItem('producto-carrito', JSON.stringify(productosCarrito))
        //Una vez actualizado los artículos en el localStorage, vuelve a cargar los artículos y actualiza los totales del resumen de compra.
        cargarCarrito ();
        updateTotals ();
        let envioSeleccionado = document.getElementById('tipo-envio').value
        costoEnvioyTotal(envioSeleccionado);
  
      })
    
      // Escucha cambios en el input de cantidad para actualizar el valor del subtotal de cada artículo.
      inputCantidad.addEventListener('input', function() {
          let cantidad = parseInt(inputCantidad.value) 
          let subtotal = productoCarrito.cost * cantidad;
          subtotalElemento.textContent = subtotal;
          
          productosCarrito[index] = { ...productosCarrito[index], cantidad };
    
          localStorage.setItem('producto-carrito', JSON.stringify(productosCarrito));
          // Llama a esta función para actualizar los valores del resumen de compra. 
          updateTotals();
          
     });
     
    
    });
  }

}

//Esta función crea un array de objetos que tienen la moneda del artículos y el costo total considerando la cantidad de ellos que se colocaron en el carrito.
//Luego suma los totales considerando si hay alguno en dolares. En este caso lo convierte en pesos trayendo desde el localStorage la cotización del dolar. Está cotización se guarda allí luego de haber hecho una solicitud a una API de conversiones de monedas.
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

//Esta función actualiza los totales en el resumen de compra llamando a las funciones totalCarrito y totalCosto.
// Luego llama a updateBadge para actualizar la cantidad de artículos en el badge de Mi Carrito.
function updateTotals() {
  let totalArticulos = 0;
  let totalCompra = 0;

  totalArticulos = totalCarrito();
  totalCompra = totalCosto();

  document.getElementById('cantidad-articulos').textContent = totalArticulos > 0 ? totalArticulos : '0';
  document.getElementById('total-compra').textContent = `UYU ${totalCompra.toLocaleString('es-ES')}`;
  updateBadge(totalArticulos);
}

//Esta función inserta en el badge la cantidad que se le ingrese como parámetro.
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

let tipoEnvio = document.getElementById('tipo-envio')

tipoEnvio.addEventListener('change', function(event){
let envioSeleccionado = event.target.value
costoEnvioyTotal (envioSeleccionado)
});

function costoEnvioyTotal (envioSeleccionado) {
let contenedorCostoEnvio = document.getElementById('costo-envio')
let contenedorCostoTotal = document.getElementById('total-compra-envio')
let subtotal = totalCosto();
if (envioSeleccionado==15){
  let costoEnvio = parseFloat((subtotal*0.15).toFixed(2))
  let costoTotal = parseFloat((parseFloat(costoEnvio) + subtotal).toFixed(2))
  contenedorCostoEnvio.textContent = `UYU ${costoEnvio.toLocaleString('es-ES')}`
  contenedorCostoTotal.textContent = `UYU ${costoTotal.toLocaleString('es-ES')}`
} else if (envioSeleccionado==7){
  let costoEnvio = parseFloat((subtotal*0.07).toFixed(2))
  let costoTotal =  parseFloat((parseFloat(costoEnvio) + subtotal).toFixed(2))
  contenedorCostoEnvio.textContent = `UYU ${costoEnvio.toLocaleString('es-ES')}`
  contenedorCostoTotal.textContent = `UYU ${costoTotal.toLocaleString('es-ES')}`
} else if (envioSeleccionado==5){
  let costoEnvio = parseFloat((subtotal*0.05).toFixed(2))
  let costoTotal = parseFloat((parseFloat(costoEnvio) + subtotal).toFixed(2))
  contenedorCostoEnvio.textContent = `UYU ${costoEnvio.toLocaleString('es-ES')}`
  contenedorCostoTotal.textContent = `UYU ${costoTotal.toLocaleString('es-ES')}`
}
 }

 let formaPago = document.getElementById('forma-pago')
 let formularioTarjeta = document.getElementById('formulario-tarjeta')
 let infoTransferencia = document.getElementById('transferencia')
 formaPago.addEventListener('change', function(){
  
  infoTransferencia.style.display = 'none';
  formularioTarjeta.style.display = 'none';

  if (formaPago.value==="tarjeta"){
    formularioTarjeta.style.display = 'block'; 
  } else if (formaPago.value==="transferencia"){
    infoTransferencia.style.display = 'block';
  }
 });