document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const highlightId = urlParams.get('highlight');
    
    if (highlightId) {
        const patientCards = document.querySelectorAll('.patient-card');
        patientCards.forEach((card, index) => {
            if (index + 1 == highlightId) {
                card.style.border = '2px solid #3498db';
                card.style.backgroundColor = '#f8f9ff';
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                setTimeout(() => {
                    card.style.border = '';
                    card.style.backgroundColor = '';
                }, 3000);
            }
        });
    }
});