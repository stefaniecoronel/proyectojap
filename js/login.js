let form= document.querySelector("form")


form.addEventListener ('submit',function(event){
    event.preventDefault();
    let usuario = document.getElementById ("usuario").value;
    let contraseña = document.getElementById ("contraseña").value;
    if (usuario && contraseña) {
        form.submit();
        window.location.href="index.html";

    }
} )

<<<<<<< Updated upstream
=======

function checkSession() {
    const session = localStorage.getItem('session');
    if (session === 'active') {
        console.log('Sesión activa.');
        window.location.href="index.html";
    } else {
        console.log('No hay sesión activa.');
        
            window.location.href = 'login.html'; // Redirige después de un breve retraso   
}
}
window.onload = checkSession;
>>>>>>> Stashed changes
