document.addEventListener ('submit',function(event){
    event.preventDefault();
    let contraseña = document.getElementById ("contraseña").value;
    let usuario = document.getElementById ("usuario").value;

    if (usuario && contraseña) {
    
        localStorage.setItem('session', 'active');
        localStorage.setItem('nombre', usuario);
        window.location.href="index.html"; 
        localStorage.setItem('nightMode', 'disabled'); //por defecto dejamos el modo noche desactivado     
       
 
    }
} )

function checkSession() {
    const session = localStorage.getItem('session');
    if (session === 'active') {
        console.log('Sesión activa.');

    } else {
        console.log('No hay sesión activa.');
        
            window.location.href = 'login.html'; // Redirige después de un breve retraso   
}
}