/**
 * Main JavaScript file for the MafiaStyle website
 * Structured with section-specific functionality
 */
document.addEventListener('DOMContentLoaded', function() {
  // ===== ИНИЦИАЛИЗАЦИЯ БИБЛИОТЕК =====
  // Инициализация AOS для анимаций при скролле
  initAOS();
  
  // ===== МЕНЮ И НАВИГАЦИЯ =====
  setupNavigation();
  
  // ===== ИНИЦИАЛИЗАЦИЯ SWIPER И PHOTOSWIPE =====
  setupGallery();
});

/**
 * Инициализация библиотеки AOS для анимаций при скролле
 */
function initAOS() {
  AOS.init({
    duration: 800,
    once: true,
    offset: 100,
    easing: 'ease-in-out'
  });
}

/**
 * Настройка навигации, меню и прокрутки
 */
function setupNavigation() {
  // DOM элементы
  const header = document.getElementById('header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const body = document.querySelector('body');

  // Функция для переключения мобильного меню
  function toggleMenu() {
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
    body.classList.toggle('menu-open');
    
    if (navMenu.classList.contains('active')) {
      navMenu.style.right = '0';
      body.style.overflow = 'hidden';
    } else {
      navMenu.style.right = '-100%';
      body.style.overflow = '';
    }
  }

  // Обработчики событий для меню
  menuToggle.addEventListener('click', toggleMenu);
  
  // Закрытие меню при клике на ссылку
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Получаем целевой элемент из href
      const targetId = this.getAttribute('href');
      if (targetId.startsWith('#') && targetId !== '#') {
        e.preventDefault();
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          // Закрываем меню если оно открыто
          if (navMenu.classList.contains('active')) {
            toggleMenu();
          }
          
          // Прокручиваем к секции плавно
          scrollToSection(targetElement);
        }
      }
    });
  });
  
  // Закрытие меню при нажатии Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      toggleMenu();
    }
  });
  
  // Изменение стиля хедера при прокрутке
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      header.classList.add('bg-opacity-95', 'shadow-md', 'h-16');
      header.classList.remove('h-20');
    } else {
      header.classList.remove('bg-opacity-95', 'shadow-md', 'h-16');
      header.classList.add('h-20');
    }

    // Обновляем активное меню при скролле
    updateActiveSection();
  });

  /**
   * Обновляет активный пункт меню при скролле
   */
  function updateActiveSection() {
    const scrollPosition = window.scrollY + header.offsetHeight + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  /**
   * Плавная прокрутка к секции с учетом высоты хедера
   * @param {HTMLElement} targetElement - Элемент, к которому прокручиваем
   */
  function scrollToSection(targetElement) {
    const headerHeight = header.offsetHeight;
    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = targetPosition - headerHeight;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }

  // Устанавливаем начальное активное меню при загрузке
  updateActiveSection();
}

/**
 * Настройка галереи изображений (Swiper и PhotoSwipe)
 */
function setupGallery() {
  // Инициализация слайдера Swiper
  const swiper = new Swiper(".mySwiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    grabCursor: true,
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
    // Автоматическая адаптация высоты
    autoHeight: false,
  });
  
  // Инициализация PhotoSwipe при клике на слайд
  initPhotoSwipeFromDOM('.swiper-wrapper');
  
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
          w: 0, // Будет установлено после загрузки
          h: 0,
          title: img.alt || 'Изображение'
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
      
      // Обработчик события загрузки каждого изображения
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
}