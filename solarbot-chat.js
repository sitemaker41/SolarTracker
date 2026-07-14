// ============================================================
// 🤖 SolarBot 1.0 — رابط کاربری چت‌بات
// ============================================================

// ===== تنظیمات اولیه =====
const CONFIG = {
    maxQuestions: 3,        // حداکثر سوال در هر جلسه
    storageKey: 'solarBot_questions'  // کلید ذخیره‌سازی در localStorage
};

// ===== وضعیت فعلی =====
let questionCount = 0;

// ===== بارگذاری تعداد سوالات قبلی =====
function loadQuestionCount() {
    const saved = localStorage.getItem(CONFIG.storageKey);
    if (saved) {
        questionCount = parseInt(saved) || 0;
    }
    updateQuestionCounter();
}

// ===== ذخیره تعداد سوالات =====
function saveQuestionCount() {
    localStorage.setItem(CONFIG.storageKey, questionCount.toString());
}

// ===== به‌روزرسانی شمارنده سوالات =====
function updateQuestionCounter() {
    const counter = document.getElementById('questionCounter');
    if (counter) {
        const remaining = Math.max(0, CONFIG.maxQuestions - questionCount);
        counter.textContent = remaining;
    }
}

// ===== اضافه کردن پیام به چت =====
function addMessage(type, text) {
    const chatContainer = document.getElementById('chatMessages');
    if (!chatContainer) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type}`;

    const icon = document.createElement('span');
    icon.className = 'chat-icon';
    icon.textContent = type === 'user' ? '👤' : '🤖';

    const textSpan = document.createElement('span');
    textSpan.className = 'chat-text';
    textSpan.innerHTML = text.replace(/\n/g, '<br>');

    messageDiv.appendChild(icon);
    messageDiv.appendChild(textSpan);
    chatContainer.appendChild(messageDiv);

    // اسکرول به پایین
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// ===== نمایش پیام خوش‌آمدگویی =====
function showWelcomeMessage() {
    const welcomeText = `👋 سلام! من SolarBot 1.0 هستم، دستیار هوشمند انرژی خورشیدی.

از من هر سوالی درباره انرژی خورشیدی، پنل‌های خورشیدی، ردیاب‌های دو محوره و تک‌محوره، سنسور LDR، سروو موتور، آردوینو و ... بپرسید.

📌 توجه: در هر جلسه می‌توانید ۳ سوال بپرسید.`;
    addMessage('bot', welcomeText);
}

// ===== پردازش سوال کاربر =====
function processQuestion(userInput) {
    if (!userInput || userInput.trim() === '') return;

    // بررسی محدودیت سوالات
    if (questionCount >= CONFIG.maxQuestions) {
        addMessage('bot', '⚠️ شما به حداکثر سوالات مجاز (۳ سوال) در این جلسه رسیده‌اید. برای پرسش سوال بیشتر، صفحه را رفرش کنید.');
        return;
    }

    // اضافه کردن پیام کاربر
    addMessage('user', userInput);

    // افزایش شمارنده
    questionCount++;
    saveQuestionCount();
    updateQuestionCounter();

    // جستجوی پاسخ
    const result = findBestMatch(userInput);

    // نمایش پاسخ با تاخیر
    setTimeout(() => {
        let response = result.answer;

        // اضافه کردن اطلاعات اضافی
        if (result.score > 0 && result.topic) {
            // اطلاعات تشخیص داده شده (اختیاری)
        }

        addMessage('bot', response);
    }, 300);
}

// ===== راه‌اندازی چت‌بات =====
function initSolarBot() {
    // بارگذاری تعداد سوالات
    loadQuestionCount();

    // نمایش پیام خوش‌آمدگویی
    showWelcomeMessage();

    // رویداد ارسال فرم
    const form = document.getElementById('chatForm');
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('chatSendBtn');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = input.value.trim();
            if (text) {
                processQuestion(text);
                input.value = '';
            }
        });
    }

    if (sendBtn && input) {
        sendBtn.addEventListener('click', () => {
            const text = input.value.trim();
            if (text) {
                processQuestion(text);
                input.value = '';
            }
        });

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const text = input.value.trim();
                if (text) {
                    processQuestion(text);
                    input.value = '';
                }
            }
        });
    }

    // دکمه پاک کردن تاریخچه (اختیاری)
    const clearBtn = document.getElementById('clearChatBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            document.getElementById('chatMessages').innerHTML = '';
            questionCount = 0;
            localStorage.removeItem(CONFIG.storageKey);
            updateQuestionCounter();
            showWelcomeMessage();
        });
    }
}

// ===== اجرا پس از لود کامل صفحه =====
document.addEventListener('DOMContentLoaded', initSolarBot);