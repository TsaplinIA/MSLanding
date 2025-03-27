document.addEventListener('DOMContentLoaded', function() {
    // Выбор элементов DOM
    const header = document.getElementById('header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const sections = document.querySelectorAll('.section');
    const body = document.querySelector('body');

    // Добавляем класс animate к элементам для анимации
    const elementsToAnimate = [
        '.about-content > div',
        '.games-grid > div',
        '.corporate-content > div',
        '.location-info',
        '.map-container'
    ];

    elementsToAnimate.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, index) => {
            el.classList.add('animate');
            // Добавляем задержку для каскадной анимации
            el.style.transitionDelay = `${index * 0.1}s`;
        });
    });

    // Функция для переключения мобильного меню
    function toggleMenu() {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
        body.classList.toggle('menu-open'); // Блокируем скролл при открытом меню

        // Изменение вида бургер-иконки
        const spans = menuToggle.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            // Запрещаем скролл страницы при открытом меню
            body.style.overflow = 'hidden';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
            // Разрешаем скролл страницы при закрытом меню
            body.style.overflow = '';
        }
    }

    // Прослушиватель для бургер-меню
    menuToggle.addEventListener('click', toggleMenu);

    // Закрытие меню при нажатии на ссылку в мобильном виде
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Закрытие меню при нажатии на escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            toggleMenu();
        }
    });

    // Закрытие меню при клике вне меню (только для мобильных)
    document.addEventListener('click', function(e) {
        const isClickInsideMenu = navMenu.contains(e.target);
        const isClickOnToggle = menuToggle.contains(e.target);

        if (window.innerWidth <= 768 &&
            navMenu.classList.contains('active') &&
            !isClickInsideMenu &&
            !isClickOnToggle) {
            toggleMenu();
        }
    });

    // Плавный скролл к секциям
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = targetPosition - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Изменение стиля хедера при скролле
    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Обновление активной ссылки в меню при скролле
        updateActiveMenuLink();

        // Запуск анимаций при скролле
        revealElements();
    }

    // Функция для обновления активного пункта меню
    function updateActiveMenuLink() {
        let currentSection = '';

        // Адаптивный отступ в зависимости от устройства
        const isMobile = window.innerWidth <= 768;
        const scrollOffset = isMobile ? 70 : 100;
        const scrollPosition = window.scrollY + header.offsetHeight + scrollOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    // Функция для анимации элементов при прокрутке
    function revealElements() {
        const elementsToReveal = document.querySelectorAll('.animate');
        const windowHeight = window.innerHeight;

        elementsToReveal.forEach(element => {
            // Проверяем, находится ли элемент в области видимости
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;

            // Адаптивный порог видимости
            const visibilityThreshold = isMobile() ? windowHeight * 0.1 : windowHeight * 0.2;

            // Элемент считается видимым, когда его верхняя часть ниже верхней границы окна,
            // но выше нижней границы окна
            const isVisible = elementTop < windowHeight - visibilityThreshold && elementBottom > 0;

            if (isVisible) {
                if (!element.classList.contains('active')) {
                    element.classList.add('active');
                }
            }
        });
    }

    // Проверка мобильного устройства
    function isMobile() {
        return window.innerWidth <= 768;
    }

    // Optimized scroll handler with debounce
    function debounce(func, wait = 10) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    // Обработчик скролла с debounce для оптимизации производительности
    const debouncedScroll = debounce(handleScroll, 10);
    window.addEventListener('scroll', debouncedScroll);

    // Обработчик изменения размера окна
    const debouncedResize = debounce(() => {
        // Обновляем активное меню и анимации при изменении размера
        updateActiveMenuLink();
        revealElements();

        // Исправляем меню при смене ориентации устройства
        if (!isMobile() && navMenu.classList.contains('active')) {
            toggleMenu(); // Закрываем меню на десктопе если открыто
        }
    }, 100);
    window.addEventListener('resize', debouncedResize);

    // Исправление прыжка в начало при обновлении страницы с хешем
    function handleInitialScroll() {
        if (window.location.hash) {
            const hash = window.location.hash;
            const targetElement = document.querySelector(hash);

            if (targetElement) {
                setTimeout(() => {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = targetPosition - headerHeight;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'instant' // Используем instant чтобы избежать анимации при загрузке
                    });
                }, 100);
            }
        }
    }

    // Запускаем обработчики при загрузке
    handleScroll();
    revealElements();
    handleInitialScroll();

    // Обработчик событий ориентации устройства для мобильных
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            debouncedResize();
        }, 200); // Добавляем задержку для мобильных устройств
    });

    // Улучшение доступности при навигации с клавиатуры
    navLinks.forEach(link => {
        link.addEventListener('focus', function() {
            // Автоматически открываем меню на мобильных при навигации с клавиатуры
            if (isMobile() && !navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Проверяем поддержку touch-устройств для лучшего UX
    if ('ontouchstart' in window || navigator.maxTouchPoints) {
        document.body.classList.add('touch-device');
    }
});