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

