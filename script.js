document.addEventListener('DOMContentLoaded', function () {

    // --- 1. 時間帯によるテーマ切り替え ---
    const applyTimeBasedTheme = () => {
        const hour = new Date().getHours();
        const body = document.body;
        body.classList.remove('theme-morning', 'theme-day', 'theme-night');

        if (hour >= 5 && hour < 10) {
            body.classList.add('theme-morning');
        } else if (hour >= 20 || hour < 5) {
            body.classList.add('theme-night');
        } else {
            body.classList.add('theme-day'); // 昼のデフォルト
        }
    };

    // --- 2. スクロール連動の水位アニメーション ---
    const waterLevel = document.getElementById('water-level');
    const handleScroll = () => {
        if (!waterLevel) return;
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
        
        const waterPosition = 100 - (scrollPercent * 95);
        waterLevel.style.transform = `translateY(${Math.max(0, waterPosition)}%)`;
    };

    // --- 3. 背景に浮かぶシンボルのアニメーション ---
    const canvas = document.getElementById('symbol-canvas');
    let symbols = [];
    let animationFrameId;
    let symbolsVisible = false;

    const setupSymbols = () => {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const symbolEmojis = ['☕️', '📖', '🛒', '🍽️', '🎁', '🎬', '🚌', '💅'];
        symbols = [];

        for (let i = 0; i < 15; i++) {
            symbols.push({
                char: symbolEmojis[Math.floor(Math.random() * symbolEmojis.length)],
                x: Math.random() * canvas.width,
                y: canvas.height + Math.random() * canvas.height,
                size: Math.random() * 20 + 15,
                speed: Math.random() * 0.4 + 0.1,
                drift: Math.random() * 0.5 - 0.25
            });
        }
        
        if (!animationFrameId) {
            animateSymbols();
        }
    };
    
    const animateSymbols = () => {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        symbols.forEach(s => {
            s.y -= s.speed;
            s.x += s.drift;

            if (s.y < -s.size) {
                s.y = canvas.height + s.size;
                s.x = Math.random() * canvas.width;
            }
            if (s.x > canvas.width + s.size || s.x < -s.size) {
                s.drift *= -1;
            }
            
            ctx.font = `${s.size}px sans-serif`;
            ctx.globalAlpha = 0.6;
            ctx.fillText(s.char, s.x, s.y);
        });
        
        animationFrameId = requestAnimationFrame(animateSymbols);
    };

    const checkSymbolVisibility = () => {
        if (!symbolsVisible && window.scrollY > 10) {
            symbolsVisible = true;
            setupSymbols();
        }
    };

    // --- 4. セクション表示アニメーション ---
    const setupIntersectionObserver = () => {
        const targets = document.querySelectorAll('.fade-in');
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    const h2 = entry.target.querySelector('h2');
                    if(h2) h2.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '0px',
            threshold: 0.1
        });
        targets.forEach(target => observer.observe(target));
    };

    // --- 5. FAQアコーディオン機能 ---
    const setupFaq = () => {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');

            question.addEventListener('click', () => {
                const isActive = question.classList.contains('active');
                faqItems.forEach(otherItem => {
                    const otherQuestion = otherItem.querySelector('.faq-question');
                    if (otherQuestion !== question && otherQuestion.classList.contains('active')) {
                        otherQuestion.classList.remove('active');
                        otherItem.querySelector('.faq-answer').style.maxHeight = null;
                    }
                });
                if (isActive) {
                    question.classList.remove('active');
                    answer.style.maxHeight = null;
                } else {
                    question.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + "px";
                }
            });
        });
    };

    // --- 初期化処理 ---
    applyTimeBasedTheme();
    handleScroll();
    setupIntersectionObserver();
    setupFaq();
    
    // イベントリスナーの設定
    window.addEventListener('scroll', () => {
        handleScroll();
        checkSymbolVisibility();
    });
    window.addEventListener('resize', () => {
        if (symbolsVisible) {
           cancelAnimationFrame(animationFrameId);
           animationFrameId = null;
           setupSymbols();
        }
    });
});