// Инициализация карты воспоминаний
function initMemoryMap(memories) {
    // Создаем карту
    const map = L.map('memoryMap').setView([55.7558, 37.6173], 3); // Центр на Москве, zoom 3
    
    // Добавляем слой карты
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Создаем кластер для маркеров
    const markersCluster = L.markerClusterGroup();
    
    // Добавляем воспоминания на карту
    memories.forEach(memory => {
        // Создаем кастомный маркер
        const customIcon = L.divIcon({
            className: 'map-marker-icon',
            html: '<div class="map-marker"></div>',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });
        
        // Создаем маркер
        const marker = L.marker(memory.location, {
            icon: customIcon,
            memoryId: memory.id
        });
        
        // Добавляем всплывающее окно
        marker.bindPopup(`
            <div class="map-popup">
                <h3>${memory.title}</h3>
                <p><strong>Дата:</strong> ${memory.date}</p>
                <p>${memory.description}</p>
                <div class="popup-photos">
                    ${memory.photos.map(photo => `<img src="images/${photo}" alt="${memory.title}">`).join('')}
                </div>
            </div>
        `);
        
        // Добавляем маркер в кластер
        markersCluster.addLayer(marker);
    });
    
    // Добавляем кластер на карту
    map.addLayer(markersCluster);
    
    // Подгоняем карту под все маркеры
    if (memories.length > 0) {
        const group = new L.featureGroup(memories.map(m => L.marker(m.location)));
        map.fitBounds(group.getBounds().pad(0.2));
    }
    
    // Фильтрация воспоминаний
    const memoryItemsContainer = document.querySelector('.memory-items');
    const filterButtons = document.querySelectorAll('.memory-filter button');
    
    // Функция для отображения списка воспоминаний
    function renderMemoriesList(filter = 'all') {
        memoryItemsContainer.innerHTML = '';
        
        const filteredMemories = filter === 'all' 
            ? memories 
            : memories.filter(m => m.type === filter);
        
        filteredMemories.forEach(memory => {
            const memoryElement = document.createElement('div');
            memoryElement.className = 'memory-item';
            memoryElement.dataset.id = memory.id;
            memoryElement.innerHTML = `
                <h3>${memory.title}</h3>
                <p class="memory-date">${memory.date}</p>
                <p class="memory-desc">${memory.description}</p>
                <button class="show-on-map" data-lat="${memory.location[0]}" data-lng="${memory.location[1]}">Показать на карте</button>
            `;
            
            memoryItemsContainer.appendChild(memoryElement);
        });
        
        // Обработчики для кнопок "Показать на карте"
        document.querySelectorAll('.show-on-map').forEach(btn => {
            btn.addEventListener('click', function() {
                const lat = parseFloat(this.dataset.lat);
                const lng = parseFloat(this.dataset.lng);
                map.setView([lat, lng], 12);
                
                // Открываем popup для этого маркера
                markersCluster.getLayers().forEach(layer => {
                    if (layer.options.memoryId === parseInt(this.parentElement.dataset.id)) {
                        layer.openPopup();
                    }
                });
            });
        });
    }
    
    // Инициализация списка
    renderMemoriesList();
    
    // Обработчики для кнопок фильтра
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderMemoriesList(this.dataset.filter);
        });
    });
}