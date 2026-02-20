// Script para favoritos y filtrado en games-list.ejs

document.addEventListener('DOMContentLoaded', function() {
    const FAVORITES_KEY = 'favoritos_galeria_gamer';
    const btnToggle = document.getElementById('toggle-favorites');
    const cards = document.querySelectorAll('[data-game-id]');
    const btnsFav = document.querySelectorAll('.btn-fav');

    function getFavorites() {
        return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
    }
    function setFavorites(favs) {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
    }
    function isFavorite(id) {
        return getFavorites().includes(id);
    }
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
    // Botón de favorito
    btnsFav.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const id = btn.dataset.gameId;
            let favs = getFavorites();
            if (favs.includes(id)) {
                favs = favs.filter(f => f !== id);
            } else {
                favs.push(id);
            }
            setFavorites(favs);
            updateFavButtons();
        });
    });
    // Botón alternar favoritos/todos
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
    updateFavButtons();
});
