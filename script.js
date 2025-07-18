document.addEventListener('DOMContentLoaded', function () {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isActive = question.classList.contains('active');

            // Close all other items
            faqItems.forEach(otherItem => {
                const otherQuestion = otherItem.querySelector('.faq-question');
                const otherAnswer = otherItem.querySelector('.faq-answer');
                if (otherQuestion !== question) {
                    otherQuestion.classList.remove('active');
                    otherAnswer.style.maxHeight = null;
                    otherAnswer.style.padding = '0';
                }
            });

            // Toggle the clicked item
            if (isActive) {
                question.classList.remove('active');
                answer.style.maxHeight = null;
                answer.style.padding = '0';
            } else {
                question.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + "px";
                answer.style.padding = '0 10px 20px 10px';
            }
        });
    });
});