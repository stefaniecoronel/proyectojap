



document.addEventListener ('submit',function(event){
    event.preventDefault();
    let usuario = document.getElementById ("usuario").value;
    let contraseña = document.getElementById ("contraseña").value;
    if (usuario && contraseña) {
    
        localStorage.setItem('session', 'active');
        window.location.href="index.html";

    }

    const session = localStorage.getItem('session');
    const nombreUsuario = document.getElementById(NombreUsuario)
    if (session === 'active'){
        nombreUsuario.innerHTML += `
    }
})

function checkSession() {
    const session = localStorage.getItem('session');
    if (session === 'active') {
        console.log('Sesión activa.');
    } else {
        console.log('No hay sesión activa.');
        
            window.location.href = 'login.html'; // Redirige después de un breve retraso   
}
}



