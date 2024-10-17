document.addEventListener('DOMContentLoaded', function(){

    let switchNightMode = document.getElementById('SwitchNightMode');
    let profileForm = document.getElementById('profileForm');

    switchNightModeStatus = localStorage.getItem('nightMode')
    
    //Muestro el botón switch en el último estado que dejó el usuario al guardar cambios 
    if(switchNightModeStatus === 'enabled'){
        switchNightMode.checked = true; 
    } else {
        switchNightMode.checked = false; 
    }
    
    // Guardo lo que el usuario envie como preferencia de modo (día o noche) en el local storage
    profileForm.addEventListener('submit', function(event){
            event.preventDefault();
        if (switchNightMode.checked){
            localStorage.setItem('nightMode', 'enabled');
        }
        else {
            localStorage.setItem('nightMode', 'disabled');
        }
        });

    
});




document.addEventListener ('DOMContentLoaded', ()=> {
    const profileForm = document.getElementById ('profileForm');
    const userName = document.getElementById ('username')
    
    const userLogeado = localStorage.getItem ('userLogeado')
    
    
    if (!userLogeado){
    window.location.href = 'login.html';
    } else {
    userName.value = localStorage.getItem ('nombreUsuario')
    }
    }
    )