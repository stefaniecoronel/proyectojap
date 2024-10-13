document.addEventListener('DOMContentLoaded', function(){

    let switchNightMode = document.getElementById('SwitchNightMode')
    let profileForm = document.getElementById('profileForm')
    
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




