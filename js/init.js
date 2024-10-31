const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function(url){
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}

document.addEventListener ('DOMContentLoaded', function (){
  let contenedorUsuario = document.getElementById("dropdown-menu-button");
  let usuarioInicio = localStorage.getItem ('nombre');
  const session = localStorage.getItem('session');
  if (session === 'active'){
      contenedorUsuario.innerHTML += usuarioInicio;
    

  }

})

//Cuando se cierra sesión se borran los datos de usuario.
document.getElementById('cerrar-sesion').addEventListener('click', function(){
  datosUsuarioCierreSesion = {
    segundoNombre:"", 
    apellido:"",
    segundoApellido:"",
    email: "",
    telefono: "" ,
    fotoPerfil: "https://via.placeholder.com/150"
}
  localStorage.setItem('datos-usuario', JSON.stringify(datosUsuarioCierreSesion))
  
})



function sumarArray(array) {
  return array.reduce((acumulador, valorActual) => acumulador + valorActual, 0);
};

function totalCarrito(){
  let productosCarrito = JSON.parse(localStorage.getItem('producto-carrito'))
  let cantidades = productosCarrito.map(({ cantidad }) => cantidad);
  let total = sumarArray(cantidades)
  return total
};


function totalCosto() {
  let productosCarrito = JSON.parse(localStorage.getItem('producto-carrito')) || [];
  let costos = productosCarrito.map(({ cost, cantidad }) => cost * cantidad);
  let total = sumarArray(costos);
  return total;
}

document.addEventListener('DOMContentLoaded', function(){
let badge = document.getElementById('badge-carrito')
let cantidadBadge = totalCarrito();
console.log(cantidadBadge)
badge.textContent = cantidadBadge > 0 ? cantidadBadge : '';

let totalCompra = totalCosto();
    console.log(totalCompra); 
    let contenedorTotalCompra = document.getElementById('total-compra');
    contenedorTotalCompra.textContent = `${productosCarrito[0]?.currency} ${totalCompra}`
});

