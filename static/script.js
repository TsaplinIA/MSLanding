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
    '.rating-content > div',
    '.corporate-content > div',
    '.commentary-content > div',
    '.location-info',
    '.location-slider',
    '.location-map',
    '.social-links .social-item'
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
    body.classList.toggle('menu-open');

    // Изменение вида бургер-иконки
    const spans = menuToggle.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
      body.style.overflow = 'hidden';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
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

  // Функция для обработки скролла
  function handleScroll() {
    // Изменение стиля хедера при скролле
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
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;

      if (elementTop < windowHeight - elementVisible) {
        element.classList.add('active');
      }
    });
  }

  // Оптимизированный обработчик скролла с debounce
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

  // НАЧАЛО ФУНКЦИЙ ДЛЯ БЛОКА ЛОКАЦИИ
  /**
   * Функция инициализации слайдера с Swiper.js и PhotoSwipe для модальной галереи
   */
  function initLocationSection() {
    // Инициализация слайдера Swiper
    const swiper = new Swiper(".mySwiper", {
      // Основные параметры
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      grabCursor: true, // Курсор в виде руки при наведении

      // Кнопки навигации
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },

      // Пагинация (точки)
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },

      // Автоматическое определение устройства
      autoHeight: true,

      // Улучшенная производительность на мобильных
      touchReleaseOnEdges: true,
      resistance: true,
      resistanceRatio: 0.85,
    });

    // Инициализация PhotoSwipe при клике на слайд
    initPhotoSwipeFromDOM('.swiper-wrapper');
  }

  /**
   * Инициализация PhotoSwipe для просмотра изображений в модальном окне
   * @param {string} gallerySelector - CSS-селектор контейнера галереи
   */
  function initPhotoSwipeFromDOM(gallerySelector) {
    // Находим все слайды с изображениями
    const slides = document.querySelectorAll(`${gallerySelector} .swiper-slide`);

    // Добавляем обработчики для каждого слайда
    slides.forEach((slide, index) => {
      const img = slide.querySelector('img');

      // Обработчик клика на изображение
      img.addEventListener('click', function(e) {
        e.preventDefault();
        openPhotoSwipe(index);
      });
    });

    /**
     * Подготовка массива элементов для PhotoSwipe
     * @returns {Array} - Массив объектов для PhotoSwipe
     */
    function getItems() {
      const items = [];

      slides.forEach(slide => {
        const img = slide.querySelector('img');

        // Создаем объект для PhotoSwipe
        const item = {
          src: img.src,
          w: 0, // Изначально 0, будет установлено после загрузки
          h: 0,
          title: img.alt || 'Изображение'
        };

        // Загружаем реальные размеры изображения
        const tempImg = new Image();
        tempImg.src = img.src;
        tempImg.onload = function() {
          item.w = this.width;
          item.h = this.height;
        };

        items.push(item);
      });

      return items;
    }

    /**
     * Открытие галереи PhotoSwipe
     * @param {number} index - Индекс изображения, с которого нужно начать
     */
    function openPhotoSwipe(index) {
      const pswpElement = document.querySelector('.pswp');
      const items = getItems();

      // Опции для PhotoSwipe
      const options = {
        index: index,
        history: false,
        focus: false,
        showAnimationDuration: 300,
        hideAnimationDuration: 300,
        bgOpacity: 0.9,
        tapToClose: true,
        tapToToggleControls: true,
        fullscreenEl: true,
        shareEl: false,
        getThumbBoundsFn: function(index) {
          const thumbnail = slides[index].querySelector('img');
          const pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
          const rect = thumbnail.getBoundingClientRect();
          return {x: rect.left, y: rect.top + pageYScroll, w: rect.width};
        }
      };

      // Инициализация PhotoSwipe
      const gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);

      // Обработчик события загрузки каждого изображения для получения правильных размеров
      gallery.listen('gettingData', function(index, item) {
        if (item.w < 1 || item.h < 1) {
          const img = new Image();
          img.src = item.src;
          img.onload = function() {
            item.w = this.width;
            item.h = this.height;
            gallery.updateSize(true);
          };
        }
      });

      gallery.init();
    }
  }
  // КОНЕЦ ФУНКЦИЙ ДЛЯ БЛОКА ЛОКАЦИИ

  // Инициализация при загрузке
  handleScroll();

  // Инициализируем функции для блока локации
  initLocationSection();
});