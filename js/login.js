let button =  document.getElementById ("botonLogin2");
let usuario = document.getElementById ("usuario").value;
let contraseña = document.getElementById ("contraseña").value;

button.addEventListener ('click',function(){
    if (usuario && contraseña) {
        window.location.href="index.html";
    }
} )

