




document.addEventListener ('submit',function(event){
    event.preventDefault();
    let contraseña = document.getElementById ("contraseña").value;
    let usuario = document.getElementById ("usuario").value;

    if (usuario && contraseña) {
    
        localStorage.setItem('session', 'active');
        localStorage.setItem('nombre', usuario);
        window.location.href="index.html";       
        
 
    }

    

} )


document.addEventListener ('DOMContentLoaded', function ponerUsuario(){
    let contenedorUsuario = document.getElementById("inicio");
    let usuarioInicio = localStorage.getItem ('nombre');
    const session = localStorage.getItem('session');
    if (session === 'active'){
        contenedorUsuario.innerHTML += usuarioInicio
    }
    else {
        contenedorUsuario.innerHTML += "Iniciar Sesión"

}})

function checkSession() {
    const session = localStorage.getItem('session');
    if (session === 'active') {
        console.log('Sesión activa.');

    } else {
        console.log('No hay sesión activa.');
        
            window.location.href = 'login.html'; // Redirige después de un breve retraso   
}
}


