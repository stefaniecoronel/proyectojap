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
  if (productosCarrito && productosCarrito.length>0){
    productosCarrito.forEach((productoCarrito, index) => {
      let inputCantidad = document.getElementById(`cantidad-${productoCarrito.id}`);
      let subtotalElemento = document.getElementById(`subtotal-${productoCarrito.id}`);
      let botonEliminar = document.getElementById(`eliminar-${productoCarrito.id}`)
      
      if (botonEliminar){
          //Escucha si se da click en el botón eliminar de cada artículo
      botonEliminar.addEventListener('click', function (){
        productosCarrito.splice(index, 1)
        localStorage.setItem('producto-carrito', JSON.stringify(productosCarrito))
        //Una vez actualizado los artículos en el localStorage, vuelve a cargar los artículos y actualiza los totales del resumen de compra.
        cargarCarrito ();
        updateTotals ();
        let envioSeleccionado = document.getElementById('tipo-envio').value
        costoEnvioyTotal(envioSeleccionado);
        mensajeCompra.innerHTML = "";
  
      })
      }
      
     if(inputCantidad){
         // Escucha cambios en el input de cantidad para actualizar el valor del subtotal de cada artículo.
      inputCantidad.addEventListener('input', function() {
        let cantidad = parseInt(inputCantidad.value) 
        let subtotal = productoCarrito.cost * cantidad;
        subtotalElemento.textContent = subtotal;
        
        productosCarrito[index] = { ...productosCarrito[index], cantidad };
  
        localStorage.setItem('producto-carrito', JSON.stringify(productosCarrito));
        // Llama a esta función para actualizar los valores del resumen de compra. 
        updateTotals();
        let envioSeleccionado = document.getElementById('tipo-envio').value
        costoEnvioyTotal(envioSeleccionado);
        mensajeCompra.innerHTML = "";
        
   });
     }
     
     
    
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


//Al seleccionar un tipo de envio se realizan y muestran los montos de costo de envio y total.
tipoEnvio.addEventListener('change', function(event){
let envioSeleccionado = event.target.value
costoEnvioyTotal (envioSeleccionado)
mensajeCompra.innerHTML = ""
});


//Función que se fija que tipo de envio se seleccionó, calcula el costo de envio y total y los muestra en el resumen de compra. 
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

 //Según la forma de pago seleccionada la información que se muestra: formulario para tarjeta o info para la transferencia.
 formaPago.addEventListener('change', function(){
  
  infoTransferencia.style.display = 'none';
  formularioTarjeta.style.display = 'none';

  if (formaPago.value==="tarjeta"){
    formularioTarjeta.style.display = 'block'; 
  } else if (formaPago.value==="transferencia"){
    infoTransferencia.style.display = 'block';
  }
 });


//Se inicializan las variables donde se guardará la información que el usuario complete.
 let departamento = ""
 let localidad = ""
 let calle = ""
 let numero = ""
 let esquina = ""
 let numeroTarjeta = ""
 let fecha = ""
 let codigo = ""
 let nombre = ""
 let apellido = ""
 let formaPagoSeleccionada = ""

//Se traen los distintos campos que el usuario llenará.
 let guardarDatos = document.getElementById('guardar-datos')
 let infoDepartamento = document.getElementById('departamento')
 let infoLocalidad = document.getElementById('localidad')
 let infoCalle = document.getElementById('calle')
 let infoNumero = document.getElementById('numero')
 let infoEsquina = document.getElementById('esquina')
 let infoNumeroTarjeta = document.getElementById('numero-tarjeta')
 let infoFechaTarjeta = document.getElementById('fecha-tarjeta')
 let infoCodigo = document.getElementById('codigo-tarjeta')
 let infoNombre = document.getElementById('nombre-tarjeta')
 let infoApellido = document.getElementById('apellido-tarjeta')
 
 //Al hacer click en el botón de guardar datos, lo que el usuario escribió o seleccionó en los campos del modal se guarda en las variables inicializadas previamente.
 guardarDatos.addEventListener('click', function(){

  departamento = infoDepartamento.value
  localidad = infoLocalidad.value
  calle = infoCalle.value
  numero = infoNumero.value
  esquina = infoEsquina.value

  formaPagoSeleccionada = formaPago.value

  if (formaPago.value==="tarjeta"){
    numeroTarjeta = infoNumeroTarjeta.value
    fecha = infoFechaTarjeta.value
    codigo = infoCodigo.value
    nombre = infoNombre.value
    apellido = infoApellido.value
  }

 });

 let finalizarCompra = document.getElementById('finalizar-compra')
 let mensajeCompra = document.getElementById('mensaje-compra')

//Al hacer click en finalizar compra se chequea que el carrito tenga artículos, que se haya seleccionado tipo de envío, forma de pago e info asociada si corresponde y direccion de envío. Se muestra un mensaje indicativo de lo que falta si es que falta algo al momento de hacer click, en caso contrario se muestra un mensaje de compra exitosa.
 finalizarCompra.addEventListener('click', function (){
      mensajeCompra.innerHTML = ""
    if (!productosCarrito  || productosCarrito.length === 0){
      contenedorProductosCarrito.innerHTML = ""
      mensajeCompra.innerHTML = `<div class="alert alert-warning alert-overlay text-center" role="alert">
        No se puede finalizar la compra porque no hay productos en su carrito.
        </div>`
    } else if (tipoEnvio.value===""){
      mensajeCompra.innerHTML = `<div class="alert alert-warning alert-overlay text-center" role="alert">
      Seleccione un tipo de envío.
      </div>`
    } else if (formaPago.value===""){
      mensajeCompra.innerHTML = `<div class="alert alert-warning alert-overlay text-center" role="alert">
      Seleccione forma de pago.
      </div>`
    } else if (formaPago.value==="tarjeta"&&(numeroTarjeta===""||(numeroTarjeta.length!=16)||(codigo.length!=3)|| fecha===""||codigo===""||nombre===""||apellido==="")){
      mensajeCompra.innerHTML = `<div class="alert alert-warning alert-overlay text-center" role="alert">
      Complete los datos de la tarjeta o revise que sean correctos.
      </div>`
    } else if (departamento==="" || localidad==="" || calle==="" || numero==="" || esquina===""){
      mensajeCompra.innerHTML = `<div class="alert alert-warning alert-overlay text-center" role="alert">
      Complete los datos de dirección de envío.
      </div>`
    } else {
      mensajeCompra.innerHTML = `<div class="alert alert-success alert-overlay text-center" role="alert">
      ¡Compra finalizada con éxito!
      </div>`
      registrarCompra();
      vaciarCarrito();
    }
 });


let openModal =  document.getElementById('pago-direccion')

openModal.addEventListener('click', function(){
mensajeCompra.innerHTML = ""
});

//Esta función toma el ID y la cantidad de cada uno de los productos del carrito y realizar una solicitud POST para que se registre la compra en la tabla compras de la base de datos del ecommerce.
function registrarCompra(){
 
  let contenidoCarrito = productosCarrito.map(producto => ({
    productoID: producto.id,
    unidadesVendidas: producto.cantidad
  }))

  let cartData = {
    NombreUsuario: localStorage.getItem('nombre'),
    items: contenidoCarrito
  };


  fetch(CART_URL, { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', 
    },
    body: JSON.stringify(cartData), 
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Respuesta del servidor:', data);
    })
    .catch(error => {
      console.error('Error:', error);
    });


};

//Esta función se utiliza para vaciar el carrito una vez que se finaliza de forma correcta la compra. 
function vaciarCarrito(){
  let productosCarrito = []
  localStorage.setItem('producto-carrito', JSON.stringify(productosCarrito))
  cargarCarrito ();
        updateTotals ();
        let envioSeleccionado = document.getElementById('tipo-envio').value
        costoEnvioyTotal(envioSeleccionado);
      
}