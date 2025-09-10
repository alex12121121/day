document.addEventListener('DOMContentLoaded', function() {
    // Установка текущего года в футере
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Инициализация переменных
    const musicBtn = document.getElementById('musicBtn');
    const audio = document.getElementById('birthdayMusic');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navbar = document.getElementById('navbar');
    let isPlaying = false;
    const confettiCanvas = document.getElementById('confetti');
    const heartsContainer = document.querySelector('.hearts-container');
    
    // Управление музыкой
    musicBtn.addEventListener('click', function() {
        if (isPlaying) {
            audio.pause();
            musicBtn.innerHTML = '<i class="fas fa-music"></i> <span class="btn-text">Включить музыку</span>';
            isPlaying = false;
        } else {
            audio.play().catch(e => {
                console.log('Автозапуск аудио заблокирован браузером.');
            });
            musicBtn.innerHTML = '<i class="fas fa-pause"></i> <span class="btn-text">Выключить музыку</span>';
            isPlaying = true;
            
            // Запускаем конфетти при включении музыки
            setupConfetti();
        }
    });
    
    // Мобильное меню
    mobileMenuBtn.addEventListener('click', function() {
        navbar.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });
    
    // Закрытие меню при клике на ссылку
    document.querySelectorAll('.navbar a').forEach(link => {
        link.addEventListener('click', function() {
            navbar.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        });
    });
    
    // Закрытие меню при клике вне его области
    document.addEventListener('click', function(e) {
        if (!navbar.contains(e.target) && !mobileMenuBtn.contains(e.target) && navbar.classList.contains('active')) {
            navbar.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        }
    });
    
    // Создание эффекта конфетти
    function setupConfetti() {
        if (!confettiCanvas) return;
        
        const ctx = confettiCanvas.getContext('2d');
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
        
        const confetti = [];
        const confettiCount = window.innerWidth < 768 ? 80 : 150; // Меньше конфетти на мобильных
        const gravity = 0.5;
        const terminalVelocity = 5;
        const drag = 0.075;
        const colors = [
            { front: '#ff6b6b', back: '#ff5252' },
            { front: '#ff8e53', back: '#ff7f50' },
            { front: '#5c6bc0', back: '#3f51b5' },
            { front: '#66bb6a', back: '#4caf50' },
            { front: '#ffa726', back: '#ff9800' }
        ];
        
        // Инициализация конфетти
        for (let i = 0; i < confettiCount; i++) {
            confetti.push({
                color: colors[Math.floor(Math.random() * colors.length)],
                dimensions: {
                    x: Math.random() * 8 + 4,
                    y: Math.random() * 8 + 4
                },
                position: {
                    x: Math.random() * confettiCanvas.width,
                    y: -Math.random() * confettiCanvas.height
                },
                rotation: Math.random() * 2 * Math.PI,
                scale: {
                    x: 1,
                    y: 1
                },
                velocity: {
                    x: Math.random() * 15 - 7.5,
                    y: Math.random() * 8 + 4
                }
            });
        }
        
        // Анимация конфетти
        function update() {
            if (!confettiCanvas) return;
            
            ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            
            confetti.forEach((confetto, index) => {
                let width = confetto.dimensions.x * confetto.scale.x;
                let height = confetto.dimensions.y * confetto.scale.y;
                
                // Проверка выхода за границы
                if (confetto.position.y >= confettiCanvas.height) {
                    confetti.splice(index, 1);
                    return;
                }
                
                // Обновление скорости
                confetto.velocity.x -= confetto.velocity.x * drag;
                confetto.velocity.y = Math.min(confetto.velocity.y + gravity, terminalVelocity);
                confetto.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();
                
                // Обновление позиции
                confetto.position.x += confetto.velocity.x;
                confetto.position.y += confetto.velocity.y;
                
                // Обновление вращения
                confetto.rotation += confetto.velocity.x / 20;
                
                // Рисование конфетти
                ctx.save();
                ctx.translate(confetto.position.x, confetto.position.y);
                ctx.rotate(confetto.rotation);
                
                ctx.fillStyle = confetto.color.front;
                ctx.fillRect(-width / 2, -height / 2, width, height);
                
                ctx.restore();
            });
            
            if (confetti.length > 0) {
                requestAnimationFrame(update);
            }
        }
        
        update();
    }
    
    // Создание плавающих сердечек
    function createHearts() {
        if (!heartsContainer) return;
        
        const heartCount = window.innerWidth < 768 ? 15 : 25; // Меньше сердечек на мобильных
        
        for (let i = 0; i < heartCount; i++) {
            createHeart();
        }
    }
    
    function createHeart() {
        if (!heartsContainer) return;
        
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.style.position = 'absolute';
        heart.style.fontSize = (Math.random() * 15 + 8) + 'px';
        heart.style.opacity = Math.random() * 0.5 + 0.3;
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.top = Math.random() * 100 + 'vh';
        heart.style.animation = `floatHeart ${Math.random() * 5 + 3}s ease-in-out infinite`;
        heartsContainer.appendChild(heart);
        
        // Удаление сердечка после завершения анимации
        setTimeout(() => {
            if (heart.parentNode) {
                heart.remove();
                createHeart();
            }
        }, (Math.random() * 5 + 3) * 1000);
    }
    
    // Добавление стилей для анимации сердечек
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatHeart {
            0% {
                transform: translate(0, 0) rotate(0deg);
                opacity: 0.7;
            }
            50% {
                transform: translate(${Math.random() * 30 - 15}px, ${Math.random() * 30 - 15}px) rotate(${Math.random() * 15 - 7.5}deg);
                opacity: 1;
            }
            100% {
                transform: translate(0, 0) rotate(0deg);
                opacity: 0.7;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Плавная прокрутка для навигации
    document.querySelectorAll('nav a, .scroll-down').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') && this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Создаем плавающие сердечки
    createHearts();
    
    // Обработка изменения размера окна
    function handleResize() {
        if (confettiCanvas) {
            confettiCanvas.width = window.innerWidth;
            confettiCanvas.height = window.innerHeight;
        }
    }
    
    // Оптимизация обработчика resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 250);
    });
    
    // Чат с ботом
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    
    // Функция для добавления сообщения в чат
    function addMessage(message, isUser = false) {
        if (!chatMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
        
        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        
        // Обработка переносов строк
        if (message.includes('\n')) {
            message.split('\n').forEach(text => {
                if (text.trim()) {
                    const messageText = document.createElement('p');
                    messageText.textContent = text;
                    messageContent.appendChild(messageText);
                }
            });
        } else {
            const messageText = document.createElement('p');
            messageText.textContent = message;
            messageContent.appendChild(messageText);
        }
        
        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);
        
        // Прокрутка к последнему сообщению
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Функция для обработки сообщений пользователя
    function handleUserMessage(message) {
        const lowerMessage = message.toLowerCase();
        
        // Ответы бота на разные запросы
        if (lowerMessage.includes('подарки') || lowerMessage.includes('день рождени')) {
            addMessage('Ошибка! Ошибка! Мне тяжело ответить на этот вопрос, ведь я не вкурсе. Но я знаю точно, что тебя ждет море поздравлений и пожеланий. А главный подарок для всех - это ты!🎉 Напиши мне "Расскажи анекдот" и я постараюсь развеселить тебя)))');
        } 
        else if (lowerMessage.includes('что ты умеешь') || lowerMessage.includes('команды')) {
            addMessage('Я умею поздравлять с днем рождения и отвечать на вопросы! А еще я имею магические способности: Напиши мне "Магия для Марины" и я покажу фокус ');
        } 
        else if (lowerMessage.includes('анекдот') || lowerMessage.includes('шутк')) {
            addMessage('Именинница так напилась, что когда подула на свечи — торт сгорел. 😄 ХА-ХА-ХА. Мне казалось это смешным((( Спроси меня "Что ты умеешь?" И я тебе расскажу');
        } 
        else if (lowerMessage.includes('комплимент') || lowerMessage.includes('красив')) {
            addMessage('Ты сегодня просто неотразима! Твоя улыбка освещает всё вокруг, как солнце в ясный день! 🌞 Я бы хотел поздравить тебя с днем Рождения. Напиши мне "Поздравь меня"');
        } 
        else if (lowerMessage.includes('меня') || lowerMessage.includes('подарк')) {
            addMessage('Марина, я поздравляю тебя с днем рождения! 💝 Я желаю тебе здоровья, счастья, любви и исполнения всех желаний! А лучший подарок — это внимание и забота близких! Я научился распознавать кошачий язык, и Муся мне передала "Мяу", что на кошачьем означает "С праздником хозяйка". А хочешь я спою праздничную песню? Напиши мне "Спой песню"  💝');
        } 
        else if (lowerMessage.includes('да') || lowerMessage.includes('возраст')) {
            addMessage('Возраст — это просто цифра! Сегодня тебе столько лет, сколько нужно для полного счастья! Ну а вообще, сегодня Марине 45 лет, но как мы все знаем, ей всегда 18. И кстати Марина, я подготовил для тебя комплимент. Просто напиши мне "Эй бот! Я жду комплиментов" 🎂');
        } 
        else if (lowerMessage.includes('праздник') || lowerMessage.includes('какой сегодня')) {
            addMessage('Сегодня самый главный праздник — день рождения самой замечательной мамы! А хочешь узнать сколько лет ей исполнилось? Да или нет? 🎊');
        } 
        else if (lowerMessage.includes('спой') || lowerMessage.includes('песн')) {
            addMessage('С днем рождения тебя! С днем рождения тебя! С днем рождения, Марина Александровна! С днем рождения тебя! Ну а вообще можешь включить песню сверху этого сайта.🎵 Давай лучше расскажу по секрету, какие подарки тебе сегодня подарят. Напиши мне "Какие подарки меня ждут?"');
        } 
        else if (lowerMessage.includes('сделал') || lowerMessage.includes('кто тебя')) {
            addMessage('Меня создал малоизвестный человек по имени Саша, чтобы сделать этот день особенным и поздравить тебя самым лучшим образом! 💖 Но по моей информации, создателем Саши являешься Ты. Получается, что мой создатель - Это ты Марина! Ваау, это взрыв моей ИИ системы, я пошел переосмысливать сущность мира. Еще раз - С днем рождения, Марина!🎂');
        } 
        else if (lowerMessage.includes('маги') || lowerMessage.includes('фокус')) {
            addMessage('Абракадабра! Открывай глаза Марина, у тебя день рождения, поздравляююю... ✨ Шутки в сторону, ты хочешь знать кто мой создатель? Напиши мне "Кто тебя сделал?" и я открою тебе тайну...');
        } 
        else {
            addMessage('Я не совсем понял вопрос. Попробуй спросить что-то из этого:\n- Какой сегодня праздник?\n- Что ты умеешь?\n- Расскажи анекдот\n- Скажи комплимент\n- Поздравь меня');
        }
    }
    
    // Обработчик отправки сообщения
    function sendMessage() {
        if (!userInput || !chatMessages) return;
        
        const message = userInput.value.trim();
        if (message) {
            addMessage(message, true);
            userInput.value = '';
            
            // Скрытие клавиатуры на мобильных устройствах
            if ('virtualKeyboard' in navigator || 'keyboard' in navigator) {
                userInput.blur();
            }
            
            // Имитация задержки ответа бота
            setTimeout(() => {
                handleUserMessage(message);
            }, 1000);
        }
    }
    
    // Обработчики событий
    if (sendBtn && userInput) {
        sendBtn.addEventListener('click', sendMessage);
        userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // Оптимизация для мобильных устройств - предотвращение масштабирования при фокусе
    document.addEventListener('touchstart', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            // Ничего не делаем, позволяя стандартному поведению
        }
    }, { passive: true });
});
