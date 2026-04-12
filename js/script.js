document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Progressive form logic
    const form = document.getElementById('progressive-form');
    const formGroups = Array.from(form.querySelectorAll('.form-group'));

    form.addEventListener('input', (event) => {
        const currentInput = event.target;
        const currentGroup = currentInput.closest('.form-group');
        const currentIndex = formGroups.indexOf(currentGroup);

        if (currentInput.value.trim() !== '' && currentIndex < formGroups.length - 1) {
            const nextGroup = formGroups[currentIndex + 1];
            nextGroup.style.display = 'block';
        }
    });
});