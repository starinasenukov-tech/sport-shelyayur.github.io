// Пароль директора
const DIRECTOR_PASSWORD = "1978";
let isDirectorLoggedIn = false;

// Данные о залах
const hallsData = {
    billiard: {
        title: "Бильярдная комната",
        icon: "🎱",
        image: "images/halls/billiard.jpg",
        description: "Профессиональная бильярдная комната с тремя столами русского бильярда. Идеальное место для любителей интеллектуального спорта и стратегических игр.",
        features: [
            "Профессиональный бильярдный стол",
            "Кии любой длины",
            "Кресла для зрителей",
        ],
        schedule: "Единое расписание",
    },
    tennis: {
        title: "Теннисный зал",
        icon: "🎾",
        image: "images/halls/tennis.jpg",
        description: "Современный зал для настольного тенниса с профессиональным столом. Отличное место для развития реакции и координации.",
        features: [
            "Профессиональный теннисный стол",
            "Качественное освещение",
            "Профессиональные ракетки",
        ],
        schedule: "Единое расписание",
    },
    volleyball: {
        title: "Волейбольно-футбольный зал",
        icon: "⚽",
        image: "images/halls/volleyball.jpg",
        description: "Универсальный спортивный зал с разметкой для волейбола и мини-футбола. Профессиональное покрытие и современное оборудование.",
        features: [
            "Разметка для волейбола и мини-футбола",
            "Спортивное покрытие",
            "Балкон для зрителей",
        ],
        schedule: "Единое расписание",
    },
    gym: {
        title: "Тренажерный зал",
        icon: "🏋️",
        image: "images/halls/gym.jpg",
        description: "Современный тренажерный зал с силовыми тренажерами. Хорошее оборудование для эффективных тренировок.",
        features: [
            "Силовые тренажеры",
            "Свободные веса",
            "Зона функционального тренинга",
        ],
        schedule: "Единое расписание",
    }
};

// Данные сотрудников по умолчанию
const defaultStaff = [
    {
        id: 1,
        lastName: "Рочев",
        firstName: "Олег",
        middleName: "Витальевич",
        position: "Директор",
        description: "Руководитель спортивного комплекса, отвечает за общее развитие и стратегическое планирование деятельности учреждения.",
        photo: null
    },
    {
        id: 2,
        lastName: "Иванов",
        firstName: "Иван",
        middleName: "Петрович",
        position: "Тренер по волейболу",
        description: "Профессиональный тренер с многолетним опытом работы. Проводит тренировки для взрослых и детей.",
        photo: null
    }
];

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, инициализация...');
    initializeApp();
});

function initializeApp() {
    console.log('Инициализация приложения...');
    loadNews();
    loadStaff();
    setupEventListeners();
    checkLoginStatus();
}

// Настройка обработчиков событий
function setupEventListeners() {
    console.log('Настройка обработчиков событий...');

    // Вход для директора
    const adminLoginBtn = document.getElementById('adminLoginBtn');
    if (adminLoginBtn) {
        console.log('Кнопка входа найдена');
        adminLoginBtn.addEventListener('click', showLoginModal);
    } else {
        console.error('Кнопка входа не найдена!');
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Форма сотрудников
    const addStaffForm = document.getElementById('addStaffForm');
    if (addStaffForm) {
        addStaffForm.addEventListener('submit', handleStaffSubmit);
    }

    const cancelEditBtn = document.getElementById('cancelEditBtn');
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', cancelEdit);
    }

    // Модальное окно залов
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', function() {
            const hallType = this.getAttribute('data-hall');
            showHallDetails(hallType);
        });
    });

    // Закрытие модальных окон
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', closeAllModals);
    });

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) closeAllModals();
        });
    });

    // Форма добавления новости
    const addNewsForm = document.getElementById('addNewsForm');
    if (addNewsForm) {
        addNewsForm.addEventListener('submit', addNews);
    }

    // Закрытие по ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeAllModals();
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on links
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger) hamburger.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
        });
    });
}

// Проверка статуса входа
function checkLoginStatus() {
    const savedLogin = localStorage.getItem('directorLoggedIn');
    if (savedLogin === 'true') {
        isDirectorLoggedIn = true;
        showDirectorInterface();
    } else {
        isDirectorLoggedIn = false;
        hideDirectorInterface();
    }
}

// Показать модальное окно входа
function showLoginModal() {
    console.log('Показать модальное окно входа');
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        const passwordInput = document.getElementById('adminPassword');
        if (passwordInput) passwordInput.focus();
    } else {
        console.error('Модальное окно входа не найдено!');
    }
}

// Обработка входа
function handleLogin(e) {
    e.preventDefault();
    console.log('Обработка входа...');

    const passwordInput = document.getElementById('adminPassword');
    if (!passwordInput) {
        alert('Ошибка: поле пароля не найдено!');
        return;
    }

    const password = passwordInput.value;
    console.log('Введенный пароль:', password);

    if (password === DIRECTOR_PASSWORD) {
        isDirectorLoggedIn = true;
        localStorage.setItem('directorLoggedIn', 'true');
        showDirectorInterface();
        closeAllModals();
        alert('Добро пожаловать, Олег Витальевич!');
    } else {
        alert('Неверный пароль!');
        passwordInput.value = '';
        passwordInput.focus();
    }
}

// Обработка выхода
function handleLogout() {
    if (confirm('Вы уверены, что хотите выйти из системы?')) {
        isDirectorLoggedIn = false;
        localStorage.removeItem('directorLoggedIn');
        hideDirectorInterface();
        alert('Вы вышли из системы.');

        // Прокрутка к верху страницы
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Показать интерфейс директора
function showDirectorInterface() {
    console.log('Показать интерфейс директора');

    const adminLoginItem = document.getElementById('adminLoginItem');
    const logoutItem = document.getElementById('logoutItem');

    if (adminLoginItem) adminLoginItem.style.display = 'none';
    if (logoutItem) logoutItem.style.display = 'list-item';

    // Включить формы администрирования
    enableAdminForms(true);

    // Показать кнопки удаления
    showDeleteButtons();

    // Перезагрузить данные для отображения кнопок редактирования
    loadNews();
    loadStaff();
}

// Скрыть интерфейс директора
function hideDirectorInterface() {
    console.log('Скрыть интерфейс директора');

    const adminLoginItem = document.getElementById('adminLoginItem');
    const logoutItem = document.getElementById('logoutItem');

    if (adminLoginItem) adminLoginItem.style.display = 'list-item';
    if (logoutItem) logoutItem.style.display = 'none';

    // Отключить формы администрирования
    enableAdminForms(false);

    // Скрыть кнопки удаления
    hideDeleteButtons();

    // Перезагрузить данные для скрытия кнопок редактирования
    loadNews();
    loadStaff();
}

// Включение/отключение форм администрирования
function enableAdminForms(enable) {
    const newsForm = document.getElementById('newsForm');
    const staffForm = document.getElementById('staffForm');
    const body = document.body;

    if (enable) {
        // Добавляем класс к body для показа кнопок действий
        body.classList.add('director-logged-in');

        // Показываем формы
        if (newsForm) newsForm.classList.add('show');
        if (staffForm) staffForm.classList.add('show');
    } else {
        // Убираем класс с body для скрытия кнопок действий
        body.classList.remove('director-logged-in');

        // Скрываем формы
        if (newsForm) newsForm.classList.remove('show');
        if (staffForm) staffForm.classList.remove('show');
    }
}

function showDeleteButtons() {
    document.querySelectorAll('.delete-news').forEach(btn => {
        btn.style.display = 'flex';
    });
}

function hideDeleteButtons() {
    document.querySelectorAll('.delete-news').forEach(btn => {
        btn.style.display = 'none';
    });
}

// Удаление новости
function deleteNews(id) {
    if (!isDirectorLoggedIn) {
        alert('Требуется вход для директора!');
        showLoginModal();
        return;
    }

    if (confirm('Удалить эту новость?')) {
        let news = JSON.parse(localStorage.getItem('sportComplexNews')) || [];
        news = news.filter(item => item.id !== id);
        localStorage.setItem('sportComplexNews', JSON.stringify(news));
        loadNews();
    }
}

// Показать детали зала
function showHallDetails(hallType) {
    const hall = hallsData[hallType];
    const modal = document.getElementById('hallModal');
    const content = document.getElementById('hallContent');

    if (!modal || !content) {
        console.error('Модальное окно зала не найдено!');
        return;
    }

    content.innerHTML = `
        <div class="hall-details">
            <div>
                <div class="hall-image">
                    <img src="${hall.image}" alt="${hall.title}"
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                    <div class="hall-image-placeholder" style="display: none;">
                        ${hall.icon}
                    </div>
                </div>
                <div class="hall-info">
                    <h3>${hall.title}</h3>
                    <p>${hall.description}</p>
                    <div class="hall-features">
                        <h4>Оснащение:</h4>
                        <ul>
                            ${hall.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
            <div>
                <div class="hall-schedule">
                    <h4>📅 Расписание:</h4>
                    <p>${hall.schedule}</p>
                </div>
                <div class="hall-rules">
                    <h4>📋 Правила посещения:</h4>
                    <ul>
                        <li>Спортивная форма обязательна</li>
                        <li>Сменная обувь</li>
                        <li>Соблюдение расписания</li>
                        <li>Бережное отношение к оборудованию</li>
                    </ul>
                </div>
            </div>
        </div>
    `;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Закрыть все модальные окна
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
}

// Загрузка новостей
function loadNews() {
    const news = JSON.parse(localStorage.getItem('sportComplexNews')) || [
        {
            id: 1,
            title: "Открытие нового тренажерного зала",
            text: "Мы рады сообщить об открытии обновленного тренажерного зала с современным оборудованием. Теперь у нас появились новые силовые тренажеры и кардио-зона.",
            date: "10.12.2024",
            image: null
        },
        {
            id: 2,
            title: "Турнир по волейболу",
            text: "Приглашаем всех желающих принять участие в традиционном турнире по волейболу среди команд поселка. Регистрация команд до 20 декабря.",
            date: "05.12.2024",
            image: null
        }
    ];

    displayNews(news);
}

// Отображение новостей
function displayNews(news) {
    const newsContainer = document.getElementById('newsContainer');
    if (!newsContainer) {
        console.error('Контейнер новостей не найден!');
        return;
    }

    newsContainer.innerHTML = '';

    if (news.length === 0) {
        newsContainer.innerHTML = `
            <div class="no-news">
                <p>Пока нет новостей. Следите за обновлениями!</p>
            </div>
        `;
        return;
    }

    news.forEach(item => {
        const newsCard = document.createElement('div');
        newsCard.className = 'news-card';
        newsCard.innerHTML = `
            ${isDirectorLoggedIn ?
                `<button class="delete-news" onclick="deleteNews(${item.id})" style="display: ${isDirectorLoggedIn ? 'flex' : 'none'}">×</button>` :
                ''
            }
            <div class="news-date">${item.date}</div>
            <h3>${item.title}</h3>
            ${item.image ?
                `<div class="news-image"><img src="${item.image}" alt="${item.title}"></div>` :
                `<div class="news-image-placeholder">📰</div>`
            }
            <p>${item.text}</p>
        `;
        newsContainer.appendChild(newsCard);
    });
}

// Добавление новости
function addNews(e) {
    e.preventDefault();

    if (!isDirectorLoggedIn) {
        alert('Требуется вход для директора!');
        showLoginModal();
        return;
    }

    const title = document.getElementById('newsTitle').value;
    const text = document.getElementById('newsText').value;
    const date = document.getElementById('newsDate').value;
    const imageFile = document.getElementById('newsImage').files[0];

    let news = JSON.parse(localStorage.getItem('sportComplexNews')) || [];
    const newId = news.length > 0 ? Math.max(...news.map(n => n.id)) + 1 : 1;

    const newNews = {
        id: newId,
        title: title,
        text: text,
        date: date,
        image: null
    };

    // Обработка изображения
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            newNews.image = e.target.result;
            saveNews(news, newNews);
        };
        reader.readAsDataURL(imageFile);
    } else {
        saveNews(news, newNews);
    }
}

// Сохранение новости
function saveNews(news, newNews) {
    news.unshift(newNews);
    localStorage.setItem('sportComplexNews', JSON.stringify(news));
    displayNews(news);
    document.getElementById('addNewsForm').reset();
    alert('Новость успешно добавлена!');
}

// Загрузка сотрудников
function loadStaff() {
    let staff = JSON.parse(localStorage.getItem('sportComplexStaff'));

    // Если в localStorage нет данных, используем дефолтных сотрудников
    if (!staff || staff.length === 0) {
        staff = defaultStaff;
        localStorage.setItem('sportComplexStaff', JSON.stringify(staff));
    }

    console.log('Загружены сотрудники:', staff);
    displayStaff(staff);
}

// Отображение сотрудников
function displayStaff(staff) {
    const staffContainer = document.getElementById('staffContainer');
    if (!staffContainer) {
        console.error('Контейнер сотрудников не найден!');
        return;
    }

    console.log('Отображение сотрудников:', staff);

    staffContainer.innerHTML = '';

    if (staff.length === 0) {
        staffContainer.innerHTML = `
            <div class="no-staff">
                <p>Информация о сотрудниках появится позже</p>
            </div>
        `;
        return;
    }

    staff.forEach(employee => {
        const staffCard = document.createElement('div');
        staffCard.className = 'staff-card';

        staffCard.innerHTML = `
            <div class="staff-actions" style="display: ${isDirectorLoggedIn ? 'flex' : 'none'}">
                <button class="edit-staff" onclick="editStaff(${employee.id})" title="Редактировать">✏️</button>
                <button class="delete-staff" onclick="deleteStaff(${employee.id})" title="Удалить">🗑️</button>
            </div>
            <div class="staff-photo">
                ${employee.photo ?
                    `<img src="${employee.photo}" alt="${employee.lastName} ${employee.firstName} ${employee.middleName}">` :
                    `<div class="staff-photo-placeholder">👤</div>`
                }
            </div>
            <div class="staff-info">
                <div class="staff-name">${employee.lastName} ${employee.firstName} ${employee.middleName}</div>
                <div class="staff-position">${employee.position}</div>
                ${employee.description ? `<div class="staff-description">${employee.description}</div>` : ''}
            </div>
        `;
        staffContainer.appendChild(staffCard);
    });
}

// Добавление/редактирование сотрудника
function handleStaffSubmit(e) {
    e.preventDefault();

    if (!isDirectorLoggedIn) {
        alert('Требуется вход для директора!');
        showLoginModal();
        return;
    }

    const id = document.getElementById('staffId').value;
    const lastName = document.getElementById('staffLastName').value;
    const firstName = document.getElementById('staffFirstName').value;
    const middleName = document.getElementById('staffMiddleName').value;
    const position = document.getElementById('staffPosition').value;
    const description = document.getElementById('staffDescription').value;
    const photoFile = document.getElementById('staffPhoto').files[0];

    let staff = JSON.parse(localStorage.getItem('sportComplexStaff')) || defaultStaff;

    if (id) {
        // Редактирование существующего сотрудника
        const staffIndex = staff.findIndex(emp => emp.id === parseInt(id));
        if (staffIndex !== -1) {
            const updatedStaff = {
                ...staff[staffIndex],
                lastName,
                firstName,
                middleName,
                position,
                description
            };

            if (photoFile) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    updatedStaff.photo = e.target.result;
                    staff[staffIndex] = updatedStaff;
                    saveStaff(staff);
                };
                reader.readAsDataURL(photoFile);
            } else {
                staff[staffIndex] = updatedStaff;
                saveStaff(staff);
            }
        }
    } else {
        // Добавление нового сотрудника
        const newId = staff.length > 0 ? Math.max(...staff.map(emp => emp.id)) + 1 : 1;
        const newStaff = {
            id: newId,
            lastName,
            firstName,
            middleName,
            position,
            description,
            photo: null
        };

        if (photoFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                newStaff.photo = e.target.result;
                staff.push(newStaff);
                saveStaff(staff);
            };
            reader.readAsDataURL(photoFile);
        } else {
            staff.push(newStaff);
            saveStaff(staff);
        }
    }
}

// Сохранение сотрудников
function saveStaff(staff) {
    localStorage.setItem('sportComplexStaff', JSON.stringify(staff));
    displayStaff(staff);
    resetStaffForm();
    alert('Сотрудник добавлен!');
}

// Сброс формы сотрудника
function resetStaffForm() {
    document.getElementById('addStaffForm').reset();
    document.getElementById('staffId').value = '';
    document.getElementById('staffFormTitle').textContent = 'Добавить сотрудника';
    document.getElementById('staffSubmitBtn').textContent = 'Добавить сотрудника';
    document.getElementById('cancelEditBtn').style.display = 'none';
}

// Редактирование сотрудника
function editStaff(id) {
    if (!isDirectorLoggedIn) {
        alert('Требуется вход для директора!');
        showLoginModal();
        return;
    }

    const staff = JSON.parse(localStorage.getItem('sportComplexStaff')) || defaultStaff;
    const employee = staff.find(emp => emp.id === id);

    if (employee) {
        document.getElementById('staffId').value = employee.id;
        document.getElementById('staffLastName').value = employee.lastName;
        document.getElementById('staffFirstName').value = employee.firstName;
        document.getElementById('staffMiddleName').value = employee.middleName;
        document.getElementById('staffPosition').value = employee.position;
        document.getElementById('staffDescription').value = employee.description || '';

        document.getElementById('staffFormTitle').textContent = 'Редактировать сотрудника';
        document.getElementById('staffSubmitBtn').textContent = 'Сохранить изменения';
        document.getElementById('cancelEditBtn').style.display = 'inline-block';

        document.getElementById('staffForm').scrollIntoView({ behavior: 'smooth' });
    }
}

// Удаление сотрудника
function deleteStaff(id) {
    if (!isDirectorLoggedIn) {
        alert('Требуется вход для директора!');
        showLoginModal();
        return;
    }

    if (confirm('Удалить этого сотрудника?')) {
        let staff = JSON.parse(localStorage.getItem('sportComplexStaff')) || defaultStaff;
        staff = staff.filter(emp => emp.id !== id);
        localStorage.setItem('sportComplexStaff', JSON.stringify(staff));
        loadStaff();
        alert('Сотрудник удален!');
    }
}

// Отмена редактирования
function cancelEdit() {
    resetStaffForm();
}

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(10, 29, 60, 0.98)';
        header.style.padding = '0.5rem 0';
    } else {
        header.style.background = 'rgba(10, 29, 60, 0.95)';
        header.style.padding = '1rem 0';
    }
});

// Отладочная информация
console.log('Скрипт загружен успешно!');
console.log('Пароль для входа:', DIRECTOR_PASSWORD);