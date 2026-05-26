document.addEventListener('DOMContentLoaded', () => {
    // 1. Подсветка активного пункта меню при скролле
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // 2. Обработка отправки формы через MAILTO с Живой Валидацией
    const form = document.getElementById('contactForm');
    if (form) {
        const nameInput = document.getElementById('userName');
        const emailInput = document.getElementById('userEmail');
        const messageInput = document.getElementById('userMessage');
        const nameError = document.getElementById('nameError');
        const emailError = document.getElementById('emailError');
        const messageError = document.getElementById('messageError');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        function showError(input, errorSpan, text) {
            input.classList.remove('valid');
            input.classList.add('invalid');
            errorSpan.textContent = text;
            errorSpan.classList.add('visible');
        }

        function showSuccess(input, errorSpan) {
            input.classList.remove('invalid');
            input.classList.add('valid');
            errorSpan.textContent = '';
            errorSpan.classList.remove('visible');
        }

        function validateName() {
            const val = nameInput.value.trim();
            if (val.length === 0) {
                showError(nameInput, nameError, 'Пожалуйста, введите ваше имя.');
                return false;
            } else if (val.length < 2) {
                showError(nameInput, nameError, 'Имя должно содержать не менее 2 символов.');
                return false;
            } else if (/[0-9]/.test(val)) {
                showError(nameInput, nameError, 'Имя не должно содержать цифры.');
                return false;
            }
            showSuccess(nameInput, nameError);
            return true;
        }

        function validateEmail() {
            const val = emailInput.value.trim();
            if (val.length === 0) {
                showError(emailInput, emailError, 'Пожалуйста, введите ваш Email.');
                return false;
            } else if (!emailRegex.test(val)) {
                showError(emailInput, emailError, 'Введите корректный адрес (например: robot@tech.ru).');
                return false;
            }
            showSuccess(emailInput, emailError);
            return true;
        }

        function validateMessage() {
            const val = messageInput.value.trim();
            if (val.length === 0) {
                showError(messageInput, messageError, 'Напишите текст вашего обращения.');
                return false;
            } else if (val.length < 10) {
                showError(messageInput, messageError, 'Сообщение слишком короткое (минимум 10 символов).');
                return false;
            }
            showSuccess(messageInput, messageError);
            return true;
        }

        // «Живая» проверка при вводе
        nameInput.addEventListener('input', validateName);
        emailInput.addEventListener('input', validateEmail);
        messageInput.addEventListener('input', validateMessage);

        // Обработка отправки
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Блокируем стандартную отправку
            const isNameValid = validateName();
            const isEmailValid = validateEmail();
            const isMessageValid = validateMessage();
            // Если есть ошибки — прерываем выполнение
            if (!isNameValid || !isEmailValid || !isMessageValid) {
                return;
            }
            // --- ЛОГИКА ДЛЯ MAILTO ---
            // Вставить почту вместо 'your-email@example.com'
            const myEmail = SOCIAL_DATA[0].emailLink; /*'your-email@example.com'*/;
            const subject = encodeURIComponent('Заявка с сайта КолоБот');
            // Формируем красивый текст письма с переносами строк (%0D%0A)
            const bodyText = `Имя отправителя: ${nameInput.value.trim()}\n` +
                `Email для связи: ${emailInput.value.trim()}\n\n` +
                `Сообщение:\n${messageInput.value.trim()}`;
            const body = encodeURIComponent(bodyText);
            // Собираем финальную mailto-ссылку
            const mailtoUrl = `mailto:${myEmail}?subject=${subject}&body=${body}`;
            // Инструктируем браузер открыть эту ссылку
            window.location.href = mailtoUrl;

            const textToCopy = `Кому: ${myEmail}\n\nТекст письма:\n${bodyText}`;
            const userAgreed = confirm(
                "Если ничего не произошло, нажмите «ОК», чтобы скопировать адрес и текст письма.\n"
            );
            if (userAgreed) {
                // Копируем всё в буфер обмена
                navigator.clipboard.writeText(textToCopy)
                    .then(() => alert("Данные успешно скопированы! Откройте вашу почту вручную и вставьте текст (Ctrl+V)."))
                    .catch(() => alert(`Не удалось скопировать автоматически. Скопируйте вручную адрес: ${myEmail}`));
            } else {
                // Если пользователь нажал "Отмена", просто очищаем форму
                form.reset();
                [nameInput, emailInput, messageInput].forEach(input => input.classList.remove('valid'));
            }


            // Очищаем форму и убираем зеленую подсветку успеха
            /*form.reset();
            [nameInput, emailInput, messageInput].forEach(input => input.classList.remove('valid'));*/
        });
    }

    // 3. Переключение темы ручное управление
    const themeToggle = document.getElementById('themeToggle');
    function applyTheme(isLight) {
        if (isLight) {
            document.documentElement.classList.add('light-theme');
            if (themeToggle) themeToggle.textContent = '☀️';
        } else {
            document.documentElement.classList.remove('light-theme');
            if (themeToggle) themeToggle.textContent = '🌙';
        }
    }

    // Синхронизируем иконку кнопки с уже установленной темой
    const isCurrentlyLight = document.documentElement.classList.contains('light-theme');
    if (themeToggle) {
        themeToggle.textContent = isCurrentlyLight ? '☀️' : '🌙';
    }

    // Логика клика
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isCurrentlyLight = document.documentElement.classList.contains('light-theme');
            applyTheme(!isCurrentlyLight);
        });
    }

    // 4. Мобильное бургер-меню
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    // Закрываем меню при клике на любую ссылку
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // 5. Эффект печатной машинки
    const words = ["образовательные системы", "интеллект в движении", "развлекательные системы", "роботов будущего"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingElement = document.getElementById('typing-text');
    function typeEffect() {
        const currentWord = words[wordIndex];
        if (isDeleting) {
            charIndex--;
        } else {
            charIndex++;
        }
        typingElement.textContent = currentWord.substring(0, charIndex);
        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000; // Пауза в конце фразы
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length; // Переход к следующему слову
            typeSpeed = 500; // Пауза перед началом новой фразы
        }
        setTimeout(typeEffect, typeSpeed);
    }

    if (typingElement) {
        typeEffect(); // Запуск эффекта
    }

    // 6. Логика карусели
    // Логика автоматической генерации карточек устройств из JS-файла
    const trackDevices = document.getElementById('carouselTrack');
    if (trackDevices && typeof DEVICES_DATA !== 'undefined') {
        let htmlContent = '';
        DEVICES_DATA.forEach(robot => {
            const orderBtn = robot.orderUrl ? `<a href="${robot.orderUrl}" target="_blank" rel="noopener" class="card-link">Перейти к заказу</a>` : '';
            const downloadBtn = robot.downloadUrl ? `<a href="${robot.downloadUrl}" download="${robot.downloadFileName}" class="card-link-load">Скачать прошивку</a>` : '';

            htmlContent += `
                <article class="card">
                    <div class="card-image" style="background-image: url('${robot.image}');"></div>
                    <div class="card-content">
                        <h3>${robot.title}</h3>
                        <p>${robot.description}</p>
                        <div class="card-buttons">
                            ${orderBtn}
                            ${downloadBtn}
                        </div>
                    </div>
                </article>`;
        });

        // Вставляем карточки в карусель
        trackDevices.innerHTML = htmlContent;
        // Сразу же запускаем карусель устройств (старый вызов)
        initCarousel('carouselTrack', 'prevBtn', 'nextBtn', false);
    }

    // Логика автоматической генерации карточек видео из JS-файла
    const trackVideo = document.getElementById('videoTrack');
    if (trackVideo && typeof VIDEO_DATA !== 'undefined') {
        let htmlContent = '';
        VIDEO_DATA.forEach(robot => {
            let videoTag = "";
            if (robot.selfVideoUrl == "") {
                videoTag = `<iframe src="${robot.sideVideoUrl}" frameborder="0"
                            allow="clipboard-write; encrypted-media; fullscreen" allowfullscreen>
                            </iframe>`;
            } else {
                videoTag = `<video controls preload="metadata" poster="${robot.previewImg}">
                                <source src="${robot.selfVideoUrl}" type="video/mp4">
                            </video>`;
            }
            htmlContent +=
                `<article class="video-card">
                        <div class="video-wrapper">
                            ${videoTag}
                        </div>
                        <div class="card-content">
                            <h3>${robot.title}</h3>
                            <p>${robot.description}</p>
                        </div>
                    </article>`;
        });
        trackVideo.innerHTML = htmlContent;
        initCarousel('videoTrack', 'videoPrevBtn', 'videoNextBtn', true);
    }

    // Логика автоматической генерации карточек новости из JS-файла
    const trackNews = document.getElementById('newsTrack');
    if (trackNews && typeof NEWS_DATA !== 'undefined') {
        let htmlContent = '';
        NEWS_DATA.forEach(robot => {
            htmlContent +=
                `<article class="news-card card-clickable">
                        <div class="news-date">${robot.date}</div>
                        <h3>${robot.title}</h3>
                        <p>${robot.description}</p>
                    </article>`;
        });
        trackNews.innerHTML = htmlContent;
        initCarousel('newsTrack', 'newsPrevBtn', 'newsNextBtn', false);
    }

    //!!! Важно все что ниже должно идти после создания всех элементов на экране 

    // === УНИВЕРСАЛЬНАЯ ФУНКЦИЯ ДЛЯ КАРУСЕЛЕЙ ===
    function initCarousel(trackId, prevId, nextId, isAutoScroll) {
        const track = document.getElementById(trackId);
        const prevBtn = document.getElementById(prevId);
        const nextBtn = document.getElementById(nextId);

        if (!track || !prevBtn || !nextBtn) return;

        let currentIndex = 0;
        let timer = null;

        // Переменные для отслеживания координат свайпа
        let touchStartX = 0;
        let touchEndX = 0;
        const minSwipeDistance = 50; // Минимальная длина свайпа в пикселях для срабатывания

        function getVisibleCount() {
            if (window.innerWidth <= 600) return 1;
            if (window.innerWidth <= 1024) return 2;
            return 3;
        }

        function move() {
            const cards = track.children;
            const maxIndex = cards.length - getVisibleCount();

            if (currentIndex < 0) currentIndex = maxIndex;
            if (currentIndex > maxIndex) currentIndex = 0;

            /*const cardWidth = cards[0].getBoundingClientRect().width;
            const gap = 30;
            track.style.transform = `translateX(-${currentIndex * (cardWidth + gap)}px)`;*/
            const cardWidth = cards[0] ? cards[0].getBoundingClientRect().width : 300;
            track.style.transform = `translateX(-${currentIndex * (cardWidth + 30)}px)`;
        }

        function start() {
            if (isAutoScroll) {
                timer = setInterval(() => { currentIndex++; move(); }, 15000); // Интервал 15 секунд
            }
        }
        function stop() { clearInterval(timer); }

        nextBtn.addEventListener('click', () => { currentIndex++; move(); stop(); start(); });
        prevBtn.addEventListener('click', () => { currentIndex--; move(); stop(); start(); });

        track.addEventListener('mouseenter', stop);
        track.addEventListener('mouseleave', start);

        /*track.addEventListener('touchstart', stop);
        track.addEventListener('touchend', start);

        window.addEventListener('resize', () => {
            const maxIndex = track.children.length - getVisibleCount();
            if (currentIndex > maxIndex) currentIndex = maxIndex;
            move();
        });

        start();*/
        // === ЛОГИКА СВАЙПОВ ДЛЯ СМАРТФОНОВ ===

        // 1. Фиксируем точку касания пальца
        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stop(); // Останавливаем автопрокрутку, пока пользователь взаимодействует
        }, { passive: true });

        // 2. Фиксируем точку, где палец оторвался от экрана
        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;

            // Вычисляем расстояние и направление свайпа
            const swipeDistance = touchEndX - touchStartX;

            if (Math.abs(swipeDistance) >= minSwipeDistance) {
                if (swipeDistance < 0) {
                    // Свайп влево -> листаем ВПЕРЕД
                    currentIndex++;
                } else {
                    // Свайп вправо -> листаем НАЗАД
                    currentIndex--;
                }
                move();
            }

            start(); // Возвращаем автопрокрутку после окончания жеста
        }, { passive: true });

        window.addEventListener('resize', move);
        start();
    }

    // 7. Логика модальное окно
    // === ОБЩЕЕ МОДАЛЬНОЕ ОКНО ДЛЯ ВСЕХ КАРТОЧЕК ===
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalContent = document.querySelector('.modal-content');
    const modalVideoContainer = document.getElementById('modalVideoContainer');
    const modalVideo = document.getElementById('modalVideo');
    const modalLink = document.getElementById('modalLink');
    const downLoadLink = document.getElementById('downLoadLink');
    // Переменная для хранения элемента, который открыл модалку
    let lastFocusedElement = null;
    function openModal(title, description, bgElement = null, videoUrl = null, orderUrl = null, downloadUrl = null, downloadDesc = null) {
        // Запоминаем, какая карточка была нажата, чтобы вернуть туда фокус
        lastFocusedElement = document.activeElement;
        modalTitle.textContent = title;
        modalDescription.textContent = description;
        if (modalContent) modalContent.scrollTop = 0;
        modalImage.style.display = 'none';
        modalVideoContainer.style.display = 'none';
        modalVideo.src = '';
        if (modalLink) modalLink.style.display = 'none';
        if (downLoadLink) downLoadLink.style.display = 'none';
        if (videoUrl) {
            modalVideoContainer.style.display = 'block';
            modalVideo.src = videoUrl;
        }
        else if (bgElement && (bgElement.style.backgroundColor || bgElement.style.backgroundImage)) {
            modalImage.style.display = 'block';
            modalImage.style.backgroundColor = bgElement.style.backgroundColor;
            modalImage.style.backgroundImage = bgElement.style.backgroundImage;
        }
        if (orderUrl && modalLink) {
            modalLink.style.display = 'inline-block';
            modalLink.href = orderUrl;
        }
        if (downloadUrl && downLoadLink) {
            downLoadLink.style.display = 'inline-block';
            downLoadLink.href = downloadUrl;
            if (downloadDesc) downLoadLink.download = downloadDesc;
        }
        // Переводим атрибут доступности в состояние "видимо"
        modalOverlay.setAttribute('aria-hidden', 'false');
        modalOverlay.classList.add('open');
        // Переводим фокус на кнопку закрытия, чтобы пользователь мог сразу нажать Esc/Enter
        if (modalClose) modalClose.focus();
    }

    function closeModal() {
        // Сначала убираем фокус с элементов внутри модалки (размываем его)
        if (document.activeElement) {
            document.activeElement.blur();
        }
        modalOverlay.classList.remove('open');
        // Объявляем окно скрытым для читалок
        modalOverlay.setAttribute('aria-hidden', 'true');
        modalVideo.src = '';
        // Возвращаем фокус на карточку, которую открывали. Если её нет — на тело сайта
        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
            lastFocusedElement.focus();
        } else {
            document.body.focus();
        }
    }

    // Добавляем поддержку фокуса с клавиатуры для карточек устройств
    document.querySelectorAll('#carouselTrack .card').forEach(card => {
        card.setAttribute('tabindex', '0'); // Делает карточку доступной для выбора кнопкой Tab
        card.addEventListener('click', () => {
            const title = card.querySelector('h3').textContent;
            const desc = card.querySelector('p').textContent;
            const img = card.querySelector('.card-image');
            const orderLinkElement = card.querySelector('.card-link');
            const orderUrl = orderLinkElement ? orderLinkElement.getAttribute('href') : null;
            const downLoadLinkElement = card.querySelector('.card-link-load');
            const downloadUrl = downLoadLinkElement ? downLoadLinkElement.getAttribute('href') : null;
            const downloadDesc = downLoadLinkElement ? downLoadLinkElement.getAttribute('download') : null;
            openModal(title, desc, img, null, orderUrl, downloadUrl, downloadDesc);
        });
        // Позволяет открывать окна по нажатию Enter на клавиатуре
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') card.click();
        });
    });

    // Добавляем поддержку фокуса для карточек новостей
    document.querySelectorAll('#newsTrack .news-card').forEach(card => {
        card.setAttribute('tabindex', '0');
        card.addEventListener('click', () => {
            const date = card.querySelector('.news-date').textContent;
            const title = card.querySelector('h3').textContent;
            const desc = card.querySelector('p').textContent;
            openModal(`${title} (${date})`, desc);
        });

        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') card.click();
        });
    });
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

    // 8. Логика автоматического слайд-шоу на главном экране
    const slideshow = document.getElementById('heroSlideshow');
    if (slideshow) {
        const slides = slideshow.querySelectorAll('.slide');
        const dots = slideshow.querySelectorAll('.dot'); // Находим все точки
        let currentSlideIndex = 0;
        // Задержка 30 сек.
        const slideIntervalTime = 30000;

        function nextSlide() {
            // Убираем класс active у текущего слайда
            slides[currentSlideIndex].classList.remove('active');
            if (dots.length > 0) dots[currentSlideIndex].classList.remove('active');
            // Считаем индекс следующего слайда (зацикливаем его через остаток от деления)
            currentSlideIndex = (currentSlideIndex + 1) % slides.length;
            // Добавляем класс active новому слайду
            slides[currentSlideIndex].classList.add('active');
            if (dots.length > 0) dots[currentSlideIndex].classList.add('active');
        }
        // Запускаем бесконечный таймер смены слайдов
        setInterval(nextSlide, slideIntervalTime);
    }

    // 9. Защита ВСЕХ ссылок в карточках от срабатывания модального окна
    document.querySelectorAll('.card-content a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.stopPropagation(); // Стопаем всплытие клика к родительской карточке
        });
    });

    //10. Задать ссылки для соц.сетей
    const linksData = SOCIAL_DATA[0];
    document.querySelectorAll('[data-link]').forEach(anchor => {
        const key = anchor.getAttribute('data-link');
        // Проверяем, есть ли такой ключ в настройках и не пустой ли он
        if (linksData && linksData[key]) {
            if (key == "emailLink") {
                anchor.innerHTML = linksData[key];
            } else {
                anchor.href = linksData[key];
            }
        }
    });
});