// Пароль для скрытого входа
const DIRECTOR_PASSWORD = "Sport123";
let isDirectorLoggedIn = false;
let passwordBuffer = "";

// Данные о залах
const hallsData = {
    billiard: {
        title: "Бильярдная комната",
        icon: "🎱",
        description: "Профессиональная бильярдная комната с тремя столами русского бильярда. Идеальное место для любителей интеллектуального спорта и стратегических игр.",
        features: [
            "Профессиональный бильярдный стол",
            "Профессиональные кии",
            "Зона для зрителей",
        ],
        schedule: "Единое расписание комплекса",
    },
    tennis: {
        title: "Теннисная комната",
        icon: "🎾",
        description: "Современный зал для настольного тенниса с профессиональными столами и качественным покрытием. Отличное место для развития реакции и координации.",
        features: [
            "Профессиональный теннисный стол",
            "Качественное освещение",
            "Профессиональные ракетки",
        ],
        schedule: "Единое расписание комплекса",
    },
    volleyball: {
        title: "Волейбольно-футбольный зал",
        icon: "⚽",
        description: "Универсальный спортивный зал с разметкой для волейбола и мини-футбола. Профессиональное покрытие и современное оборудование.",
        features: [
            "Разметка для волейбола и мини-футбола",
            "Спортивное покрытие",
            "Балкон для зрителей",
        ],
        schedule: "Единое расписание комплекса",
    },
    gym: {
        title: "Тренажерный зал",
        icon: "🏋️",
        description: "Современный тренажерный зал с кардио-зоной и силовыми тренажерами. Профессиональное оборудование для эффективных тренировок.",
        features: [
            "Силовые тренажеры",
            "Свободные веса",
        ],
        schedule: "Единое расписание комплекса",
    }
};

// ==================== СКРЫТЫЙ ВВОД ПАРОЛЯ ====================

document.addEventListener('keydown', function(e) {
    // Добавляем символ в буфер
    passwordBuffer += e.key;

    // Проверяем последние 8 символов на совпадение с паролем
    if (passwordBuffer.slice(-DIRECTOR_PASSWORD.length) === DIRECTOR_PASSWORD) {
        handleSecretLogin();
        passwordBuffer = ""; // Сбрасываем буфер
    }

    // Ограничиваем длину буфера
    if (passwordBuffer.length > 20) {
        passwordBuffer = passwordBuffer.slice(-20);
    }
});

function handleSecretLogin() {
    isDirectorLoggedIn = true;
    localStorage.setItem('directorLoggedIn', 'true');
    localStorage.setItem('lastLogin', Date.now());
    showDirectorInterface();
    showNotification('Режим директора активирован!', 'success');
}

// ==================== ФУНКЦИИ ДИРЕКТОРА ====================

function showDirectorInterface() {
    document.getElementById('newsAdminPanel').style.display = 'block';
    document.getElementById('staffAdminPanel').style.display = 'block';
    showDeleteButtons();
}

function checkAutoLogout() {
    const lastLogin = localStorage.getItem('lastLogin');
    if (lastLogin && (Date.now() - lastLogin) > 24 * 60 * 60 * 1000) { // 24 часа
        isDirectorLoggedIn = false;
        localStorage.removeItem('directorLoggedIn');
        hideDirectorInterface();
    }
}

function hideDirectorInterface() {
    document.getElementById('newsAdminPanel').style.display = 'none';
    document.getElementById('staffAdminPanel').style.display = 'none';
    hideDeleteButtons();
}

function showDeleteButtons() {
    document.querySelectorAll('.delete-news').forEach(btn => {
        btn.style.display = 'flex';
    });
    document.querySelectorAll('.delete-staff').forEach(btn => {
        btn.style.display = 'flex';
    });
}

function hideDeleteButtons() {
    document.querySelectorAll('.delete-news').forEach(btn => {
        btn.style.display = 'none';
    });
    document.querySelectorAll('.delete-staff').forEach(btn => {
        btn.style.display = 'none';
    });
}

// ==================== ФУНКЦИИ ЗАЛОВ ====================

function showHallDetails(hallType) {
    const hall = hallsData[hallType];
    const modal = document.getElementById('hallModal');
    const content = document.getElementById('hallContent');

    content.innerHTML = `
        <div class="hall-details">
            <div>
                <div class="hall-image">
                    ${hall.icon}
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
                    <h4>📅 Режим работы:</h4>
                    <div class="unified-schedule">
                        <div class="schedule-item"><span> Пн-Пт</span><span> 08:00 – 21:00</span></div>
                        <div class="schedule-item"><span> Суббота</span><span> 10:00 – 13:00</span></div>
                        <div class="schedule-item"><span> Воскресенье</span><span> 09:00 – 15:00</span></div>
                    </div>
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

function closeAllModals() {
    document.getElementById('hallModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// ==================== ФУНКЦИИ НОВОСТЕЙ ====================

function loadNews() {
    let news = JSON.parse(localStorage.getItem('sportComplexNews'));
    if (!news || news.length === 0) {
        localStorage.setItem('sportComplexNews', JSON.stringify(news));
    }

    displayNews(news);
}

function displayNews(news) {
    const newsContainer = document.getElementById('newsContainer');
    newsContainer.innerHTML = '';

    if (news.length === 0) {
        newsContainer.innerHTML = '<div class="no-news"><p>Пока нет новостей. Следите за обновлениями!</p></div>';
        return;
    }

    news.forEach(item => {
        const newsCard = document.createElement('div');
        newsCard.className = 'news-card';
        newsCard.innerHTML = `
            <button class="delete-news" onclick="deleteNews(${item.id})" style="display: ${isDirectorLoggedIn ? 'flex' : 'none'}">×</button>
            <div class="news-date">${item.date}</div>
            <h3>${item.title}</h3>
            <p>${item.text}</p>
        `;
        newsContainer.appendChild(newsCard);
    });
}

function addNews(e) {
    e.preventDefault();

    const title = document.getElementById('newsTitle').value;
    const text = document.getElementById('newsText').value;
    const date = document.getElementById('newsDate').value;

    let news = JSON.parse(localStorage.getItem('sportComplexNews')) || [];
    const newId = news.length > 0 ? Math.max(...news.map(n => n.id)) + 1 : 1;

    const newNews = {
        id: newId,
        title: title,
        text: text,
        date: date
    };

    news.unshift(newNews);
    localStorage.setItem('sportComplexNews', JSON.stringify(news));
    localStorage.setItem('lastUpdate', Date.now()); // Для синхронизации

    displayNews(news);
    document.getElementById('addNewsForm').reset();
    showNotification('Новость успешно добавлена!', 'success');
}

function deleteNews(id) {
    let news = JSON.parse(localStorage.getItem('sportComplexNews')) || [];
    news = news.filter(item => item.id !== id);
    localStorage.setItem('sportComplexNews', JSON.stringify(news));
    localStorage.setItem('lastUpdate', Date.now());

    displayNews(news);
    showNotification('Новость удалена!', 'success');
}

// ==================== ФУНКЦИИ СОТРУДНИКОВ ====================

function loadStaff() {
    let staff = JSON.parse(localStorage.getItem('sportComplexStaff'));
    if (!staff || staff.length === 0) {
        staff = [
            {
                id: 1,
                name: "Иван Петров",
                position: "Тренер по волейболу",
                description: "Опытный тренер с 10-летним стажем"
            },
            {
                id: 2,
                name: "Мария Сидорова",
                position: "Инструктор тренажерного зала",
                description: "Сертифицированный специалист по фитнесу"
            }
        ];
        localStorage.setItem('sportComplexStaff', JSON.stringify(staff));
    }

    displayStaff(staff);
}

function displayStaff(staff) {
    const staffContainer = document.getElementById('staffContainer');
    staffContainer.innerHTML = '';

    if (staff.length === 0) {
        staffContainer.innerHTML = '<div class="no-staff"><p>Информация о сотрудниках появится скоро</p></div>';
        return;
    }

    staff.forEach(item => {
        const staffCard = document.createElement('div');
        staffCard.className = 'staff-card';
        staffCard.innerHTML = `
            <button class="delete-staff" onclick="deleteStaff(${item.id})" style="display: ${isDirectorLoggedIn ? 'flex' : 'none'}">×</button>
            <div class="staff-photo">👤</div>
            <h3>${item.name}</h3>
            <div class="staff-position">${item.position}</div>
            <p>${item.description}</p>
        `;
        staffContainer.appendChild(staffCard);
    });
}

function addStaff(e) {
    e.preventDefault();

    const name = document.getElementById('staffName').value;
    const position = document.getElementById('staffPosition').value;
    const description = document.getElementById('staffDescription').value;

    let staff = JSON.parse(localStorage.getItem('sportComplexStaff')) || [];
    const newId = staff.length > 0 ? Math.max(...staff.map(s => s.id)) + 1 : 1;

    const newStaff = {
        id: newId,
        name: name,
        position: position,
        description: description
    };

    staff.push(newStaff);
    localStorage.setItem('sportComplexStaff', JSON.stringify(staff));
    localStorage.setItem('lastUpdate', Date.now());

    displayStaff(staff);
    document.getElementById('addStaffForm').reset();
    showNotification('Сотрудник успешно добавлен!', 'success');
}

function deleteStaff(id) {
    let staff = JSON.parse(localStorage.getItem('sportComplexStaff')) || [];
    staff = staff.filter(item => item.id !== id);
    localStorage.setItem('sportComplexStaff', JSON.stringify(staff));
    localStorage.setItem('lastUpdate', Date.now());

    displayStaff(staff);
    showNotification('Сотрудник удален!', 'success');
}

// ==================== СИНХРОНИЗАЦИЯ МЕЖДУ УСТРОЙСТВАМИ ====================

function setupSync() {
    // Слушаем изменения в localStorage
    window.addEventListener('storage', function(e) {
        if (e.key === 'sportComplexNews' || e.key === 'sportComplexStaff') {
            loadNews();
            loadStaff();
            showNotification('Данные обновлены', 'info');
        }
    });

    // Периодическая проверка обновлений
    setInterval(() => {
        const lastUpdate = localStorage.getItem('lastUpdate');
        if (lastUpdate && lastUpdate !== localStorage.getItem('myLastCheck')) {
            loadNews();
            loadStaff();
            localStorage.setItem('myLastCheck', lastUpdate);
        }
    }, 5000); // Проверка каждые 5 секунд
}

// ==================== УВЕДОМЛЕНИЯ ====================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.background = type === 'success' ? '#28a745' : '#007BFF';
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

// ==================== ОСНОВНЫЕ ФУНКЦИИ ====================

function checkLoginStatus() {
    const savedLogin = localStorage.getItem('directorLoggedIn');
    const lastLogin = localStorage.getItem('lastLogin');

    if (savedLogin === 'true' && lastLogin && (Date.now() - lastLogin) < 24 * 60 * 60 * 1000) {
        isDirectorLoggedIn = true;
        showDirectorInterface();
    }
}

function setupEventListeners() {
    // Форма добавления новости
    const addNewsForm = document.getElementById('addNewsForm');
    if (addNewsForm) {
        addNewsForm.addEventListener('submit', addNews);
    }

    // Форма добавления сотрудника
    const addStaffForm = document.getElementById('addStaffForm');
    if (addStaffForm) {
        addStaffForm.addEventListener('submit', addStaff);
    }

    // Закрытие модальных окон
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) closeAllModals();
        });
    });

    // Закрытие по ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeAllModals();
    });
}

function createFloatingDots() {
    const hero = document.querySelector('.hero');
    for (let i = 0; i < 6; i++) {
        const dot = document.createElement('div');
        dot.className = 'floating-dot';
        dot.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: rgba(255,255,255,${Math.random() * 0.2 + 0.1});
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: float ${Math.random() * 8 + 8}s linear infinite;
        `;
        hero.appendChild(dot);
    }
}

// ==================== ИНИЦИАЛИЗАЦИЯ ====================

document.addEventListener('DOMContentLoaded', function() {
    loadNews();
    loadStaff();
    setupEventListeners();
    createFloatingDots();
    checkLoginStatus();
    setupSync();
    checkAutoLogout();
});

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================

// Smooth scrolling
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

// Mobile menu
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
