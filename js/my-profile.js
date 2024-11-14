document.addEventListener('DOMContentLoaded', function(){

    //Código para evitar que se pueda ingresar a my-profile si no se está logueado.
    let sessionStatus=localStorage.getItem('session')
    if (sessionStatus!='active'){
        window.location.href = 'login.html'
    }
   
    let switchNightMode = document.getElementById('SwitchNightMode');
    let profileForm = document.getElementById('profileForm');

    let switchNightModeStatus = localStorage.getItem('nightMode')
    
    //Muestro el botón switch en el último estado que dejó el usuario al guardar cambios 
    if(switchNightModeStatus === 'enabled'){
        switchNightMode.checked = true; 
    } else {
        switchNightMode.checked = false; 
    }

    let datosUsuarioGuardados = JSON.parse(localStorage.getItem('datos-usuario'))
    if (datosUsuarioGuardados != undefined){
        document.getElementById('second-name').value = datosUsuarioGuardados.segundoNombre
        document.getElementById('lastname').value = datosUsuarioGuardados.apellido
        document.getElementById('second-lastname').value = datosUsuarioGuardados.segundoApellido
        document.getElementById('email').value =  datosUsuarioGuardados.email
        document.getElementById('phone').value =  datosUsuarioGuardados.telefono
        document.getElementById('profileImage').src = datosUsuarioGuardados.fotoPerfil
    }
    
    profileForm.addEventListener('submit', function(event){
            event.preventDefault();
            let contenedorAlerta = document.getElementById('alert')
            contenedorAlerta.innerHTML = ""
            //La parte del código que da una advertencia si no se completan todos los campos obligatorios no aparece nunca porque aparecen las advertencias del navegador que indican cuales campos hay que completar.
         if (!profileForm.checkValidity()){
                console.log("el formulario no es valido")
                contenedorAlerta.className = 'alert alert-danger alert-dismissible fade show'
                contenedorAlerta.innerHTML = `Debe Completar todos los campos. <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`
            } else {
                contenedorAlerta.className = 'alert alert-success alert-dismissible fade show'
                contenedorAlerta.innerHTML = `Datos guardados con éxito. <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`
                let datosUsuario ={
                    segundoNombre:document.getElementById ('second-name').value, 
                    apellido:document.getElementById ('lastname').value,
                    segundoApellido: document.getElementById ('second-lastname').value,
                    email: document.getElementById('email').value,
                    telefono: document.getElementById('phone').value, 
                    fotoPerfil: localStorage.getItem('foto-perfil')
                }
                localStorage.setItem('datos-usuario', JSON.stringify(datosUsuario))
            }
       // Guardo lo que el usuario envie como preferencia de modo (día o noche) en el local storage
            if (switchNightMode.checked){
            localStorage.setItem('nightMode', 'enabled');
        }
        else {
            localStorage.setItem('nightMode', 'disabled');
        }
        });

  //Se completa el  campo de usuario de my-profile con el usuario utilizado al iniciar sesión.  
  let username = localStorage.getItem('nombre')
  document.getElementById('username').value = username

  //Mostrar imagen de perfil subida y guardarla en el localStorage.
  let imageURL = ""
  document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
    imageURL = e.target.result;
    document.getElementById('profileImage').src = imageURL;
    localStorage.setItem('foto-perfil', imageURL) 
    }
    reader.readAsDataURL(file);
    }
    });
});