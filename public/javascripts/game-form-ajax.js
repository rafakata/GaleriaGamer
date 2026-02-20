document.addEventListener('DOMContentLoaded', function() {
// Script para AJAX en el formulario de creación/edición de videojuegos
// Envía el formulario por AJAX y muestra mensajes sin recargar
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form'); // Selecciona el formulario
    if (!form) return;
    const msgDiv = document.createElement('div'); // Div para mensajes
    form.parentNode.insertBefore(msgDiv, form);

    // Intercepta el envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        msgDiv.innerHTML = '';
        const formData = new FormData(form); // Recoge los datos del formulario
        fetch(form.action, {
            method: 'POST',
            body: formData
        })
        .then(async res => {
            if (res.ok) {
                // Si todo va bien, muestra mensaje y redirige
                msgDiv.innerHTML = '<div class="alert alert-success">Guardado correctamente</div>';
                setTimeout(() => { window.location.href = '/'; }, 1000);
            } else {
                // Si hay error, muestra el texto de error
                const text = await res.text();
                msgDiv.innerHTML = '<div class="alert alert-danger">Error: ' + text + '</div>';
            }
        })
        .catch(err => {
            // Si hay error de red
            msgDiv.innerHTML = '<div class="alert alert-danger">Error de red</div>';
        });
    });
});
