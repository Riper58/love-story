// Включение/выключение фоновой музыки
document.addEventListener('DOMContentLoaded', function() {
    const musicBtn = document.getElementById('musicBtn');
    const bgMusic = document.getElementById('bgMusic');
    let isPlaying = false;
    
    // Проверяем поддержку autoplay
    function enableAutoplay() {
        bgMusic.play()
            .then(() => {
                isPlaying = true;
                musicBtn.textContent = '♪ Музыка включена';
            })
            .catch(error => {
                console.log('Autoplay prevented:', error);
                musicBtn.textContent = '♪ Включить музыку';
            });
    }
    
    // Попытка включить autoplay при загрузке
    enableAutoplay();
    
    // Обработчик кнопки музыки
    musicBtn.addEventListener('click', function() {
        if (isPlaying) {
            bgMusic.pause();
            isPlaying = false;
            musicBtn.textContent = '♪ Включить музыку';
        } else {
            bgMusic.play();
            isPlaying = true;
            musicBtn.textContent = '♪ Музыка включена';
        }
    });
    
    // Параллакс эффект
    const parallaxElements = document.querySelectorAll('.parallax');
    
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;
        
        parallaxElements.forEach(function(element) {
            if (element.classList.contains('parallax')) {
                const speed = parseFloat(element.getAttribute('data-speed'));
                const yPos = -(scrollPosition * speed);
                element.style.backgroundPosition = `center ${yPos}px`;
            }
        });
    });
    
    // Плавная прокрутка для навигации
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Анимация при скролле
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.slide-in-left, .slide-in-right, .zoom-in');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateX(0) scale(1)';
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Запустить при загрузке для видимых элементов
});
document.addEventListener('DOMContentLoaded', function() {
    // Обновляем высоту линии при загрузке и прокрутке
    function updateTimelineLine() {
        const timeline = document.querySelector('.timeline');
        const timelineHeight = document.body.scrollHeight;
        timeline.style.height = timelineHeight + 'px';
    }
    
    // Вызываем при загрузке и ресайзе
    updateTimelineLine();
    window.addEventListener('resize', updateTimelineLine);
    
    // Также можно обновлять при добавлении новых элементов
    // через MutationObserver, если контент динамический
});