// VidyaSetu main client-side JavaScript

// Speech synthesis read-aloud utility
function speakText(text, lang) {
    if (!('speechSynthesis' in window)) {
        alert("Text-to-speech is not supported in this browser.");
        return;
    }
    window.speechSynthesis.cancel();
    if (!text || text.trim() === '') return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'kn' ? 'kn-IN' : 'en-IN';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
}

// Bookmark toggle helper via fetch
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.bookmark-toggle-btn').forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            const resourceId = button.dataset.resourceId;
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            try {
                const response = await fetch(`/library/resource/${resourceId}/bookmark`, {
                    method: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'Content-Type': 'application/json',
                        ...(csrfToken ? { 'X-CSRFToken': csrfToken } : {})
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.bookmarked) {
                        button.classList.add('text-amber-500', 'fill-amber-500');
                        button.classList.remove('text-slate-400');
                    } else {
                        button.classList.remove('text-amber-500', 'fill-amber-500');
                        button.classList.add('text-slate-400');
                    }
                }
            } catch (err) {
                console.error("Bookmark toggle error:", err);
            }
        });
    });
});
