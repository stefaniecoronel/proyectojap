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

//Esta función trae el array de productos desde el localStorage y crea uno nuevo solo con las cantidades de cada artículo.
//Luego, utiliza sumarArray para sumar cada uno de los elementos y devolver ese total de artículos que hay en el carrito.
function totalCarrito(){
  let productosCarrito = JSON.parse(localStorage.getItem('producto-carrito'))
  if (productosCarrito && productosCarrito.length>0) {
    let cantidades = productosCarrito.map(({ cantidad }) => cantidad);
    let total = sumarArray(cantidades)
    return total
  }
  
};



// Este fragmento de código es utilizado para insertar en el badge la cantidad correspondiente de artículos en el carrito.
//El badge está en el dropdown de la nav-bar que vemos en casi todas las páginas del sitio. Por eso colocamos este código en el js init, que se encuentra asociado a cada una de ellas. 
document.addEventListener('DOMContentLoaded', function(){
let badge = document.getElementById('badge-carrito')
let cantidadBadge = totalCarrito();
badge.textContent = cantidadBadge > 0 ? cantidadBadge : '';


});

document.addEventListener('DOMContentLoaded', function(){
  let displayMode = localStorage.getItem('nightMode')
  if (displayMode=="enabled"){
  document.documentElement.setAttribute('data-bs-theme','dark') //agrego el atributo de bootstrap correspondiente a dark theme a todo el html
  }
  else {
   document.documentElement.setAttribute('data-bs-theme','light') //agrego el atributo de bootstrap correspondiente a light theme a todo el html
 }

});