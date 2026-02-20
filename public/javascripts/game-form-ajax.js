// Script para AJAX en el formulario de creación/edición de videojuegos

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    if (!form) return;
    const msgDiv = document.createElement('div');
    form.parentNode.insertBefore(msgDiv, form);

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        msgDiv.innerHTML = '';
        const formData = new FormData(form);
        fetch(form.action, {
            method: 'POST',
            body: formData
        })
        .then(async res => {
            if (res.ok) {
                msgDiv.innerHTML = '<div class="alert alert-success">Guardado correctamente</div>';
                setTimeout(() => { window.location.href = '/'; }, 1000);
            } else {
                const text = await res.text();
                msgDiv.innerHTML = '<div class="alert alert-danger">Error: ' + text + '</div>';
            }
        })
        .catch(err => {
            msgDiv.innerHTML = '<div class="alert alert-danger">Error de red</div>';
        });
    });
});
