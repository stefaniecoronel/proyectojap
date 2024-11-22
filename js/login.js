document.addEventListener ('submit',function(event){
    event.preventDefault();
    let contraseña = document.getElementById ("contraseña").value;
    let usuario = document.getElementById ("usuario").value;

    if (usuario && contraseña) {
    
        localStorage.setItem('session', 'active');
        localStorage.setItem('nombre', usuario);
        localStorage.setItem('nightMode', 'disabled'); //por defecto dejamos el modo noche desactivado     

        //Solicitud POST para generar TOKEN.
        let username = usuario;
        let password = contraseña;

        fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
            .then(response => {
                if (response.ok) {
                    return response.json(); 
                } else {
                    return response.json().then(error => {
                        throw new Error(error.error || 'Error al iniciar sesión');
                    });
                }
            })
            .then(data => {
                alert('Login exitoso.');

                // Redirigir al usuario
                window.location.href = "index.html";
            })
            .catch(err => {
                console.error('Error al enviar la solicitud:', err);
                alert('Ocurrió un error: ' + err.message);
            });
        
        
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