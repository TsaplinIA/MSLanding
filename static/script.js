/**
 * Main JavaScript file for the MafiaStyle website
 * Structured with section-specific functionality
 */

/**
 * Загрузка рейтинга игроков из внешнего источника
 */
function loadTopPlayers() {
  // Контейнер для топ-3 игроков
  const ratingContainer = document.querySelector('#rating .bg-white\\/5');

  // URL для загрузки рейтинга (можно вынести в конфигурацию)
  const RATING_URL = window.RATING_API_URL || '/static/rating.json';

  // Загружаем данные из JSON файла
  fetch(RATING_URL)
    .then(response => {
      if (!response.ok) {
        throw new Error('Не удалось загрузить данные рейтинга');
      }
      return response.json();
    })
    .then(data => {
      // Очистить текущий рейтинг
      ratingContainer.innerHTML = '';

      // Проверяем наличие данных
      if (!data || data.length === 0) {
        throw new Error('Нет данных для отображения');
      }

      // Получаем шаблон
      const template = document.getElementById('player-template');

      // Добавляем каждого игрока
      data.forEach((player, index) => {
        const position = index + 1;
        const clone = template.content.cloneNode(true);

        // Установка данных
        clone.querySelector('.player-position').textContent = position;
        clone.querySelector('.player-name').textContent = player.name;
        clone.querySelector('.player-score').textContent = player.score;

        // Установка цвета для первого места
        if (position === 1) {
          clone.querySelector('.player-position').classList.remove('bg-white/20');
          clone.querySelector('.player-position').classList.add('bg-accent');
        }

        // Если это последний элемент, убираем нижний отступ
        if (position === data.length && position !== 3) {
          clone.querySelector('div').classList.remove('mb-6');
        }

        ratingContainer.appendChild(clone);
      });
    })
    .catch(error => {
      console.error('Ошибка загрузки рейтинга:', error);

      // В случае ошибки показываем сообщение об отсутствии данных
      ratingContainer.innerHTML = `
        <div class="text-center py-12">
          <i class="fas fa-exclamation-triangle text-accent text-4xl mb-4"></i>
          <h3 class="text-xl font-bold mb-2">Данные рейтинга недоступны</h3>
          <p class="text-lg opacity-80">Попробуйте обновить страницу позже</p>
        </div>
      `;
    });
}

document.addEventListener('DOMContentLoaded', function() {
  // ===== ИНИЦИАЛИЗАЦИЯ БИБЛИОТЕК =====
  // Инициализация AOS для анимаций при скролле
  initAOS();
  
  // ===== МЕНЮ И НАВИГАЦИЯ =====
  setupNavigation();
  
  // ===== ИНИЦИАЛИЗАЦИЯ SWIPER =====
  setupGallery();

  // ===== ЗАГРУЗКА РЕЙТИНГА ИГРОКОВ =====
  loadTopPlayers();
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
 * Настройка слайдера Swiper (без PhotoSwipe)
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
    }
  });
}