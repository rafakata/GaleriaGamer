document.addEventListener('DOMContentLoaded', function() {
// Script para favoritos y filtrado en games-list.ejs
// Guarda y gestiona favoritos usando LocalStorage
document.addEventListener('DOMContentLoaded', function() {
    const FAVORITES_KEY = 'favoritos_galeria_gamer'; // Clave para LocalStorage
    const btnToggle = document.getElementById('toggle-favorites'); // Botón alternar favoritos/todos
    const cards = document.querySelectorAll('[data-game-id]'); // Todas las tarjetas de juegos
    const btnsFav = document.querySelectorAll('.btn-fav'); // Botones de estrella

    // Obtener favoritos del LocalStorage
    function getFavorites() {
        return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
    }
    // Guardar favoritos en LocalStorage
    function setFavorites(favs) {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
    }
    // Comprobar si un juego es favorito
    function isFavorite(id) {
        return getFavorites().includes(id);
    }
    // Actualiza el color/estado de las estrellas
    function updateFavButtons() {
        btnsFav.forEach(btn => {
            const id = btn.dataset.gameId;
            if (isFavorite(id)) {
                btn.classList.add('text-warning');
                btn.title = 'Quitar de favoritos';
            } else {
                btn.classList.remove('text-warning');
                btn.title = 'Añadir a favoritos';
            }
        });
    }
    // Muestra solo favoritos o todos
    function filterFavorites(showFavs) {
        const favs = getFavorites();
        cards.forEach(card => {
            const id = card.dataset.gameId;
            if (showFavs && !favs.includes(id)) {
                card.style.display = 'none';
            } else {
                card.style.display = '';
            }
        });
    }
    // Evento para marcar/desmarcar favorito
    btnsFav.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const id = btn.dataset.gameId;
            let favs = getFavorites();
            if (favs.includes(id)) {
                favs = favs.filter(f => f !== id); // Quitar de favoritos
            } else {
                favs.push(id); // Añadir a favoritos
            }
            setFavorites(favs);
            updateFavButtons();
        });
    });
    // Evento para alternar entre favoritos/todos
    if (btnToggle) {
        let showFavs = true;
        btnToggle.addEventListener('click', function(e) {
            e.preventDefault();
            showFavs = !showFavs;
            filterFavorites(showFavs);
            btnToggle.textContent = showFavs ? 'Ver todos' : 'Ver favoritos';
        });
        // Mostrar favoritos al cargar
        filterFavorites(true);
        btnToggle.textContent = 'Ver todos';
    }
    updateFavButtons(); // Inicializa el estado de las estrellas
});
