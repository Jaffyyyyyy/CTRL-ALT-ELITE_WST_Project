const serviceLog = (() => {
    const QUEUE_KEY = 'otoPilaQueue';

    const getHistory = () => {
        try {
            const raw = localStorage.getItem(QUEUE_KEY);
            if (!raw) return [];
            const state = JSON.parse(raw);
            return state.history || [];
        } catch (e) {
            console.error('Error reading service history:', e);
            return [];
        }
    };

    const clearHistory = () => {
        try {
            const raw = localStorage.getItem(QUEUE_KEY);
            if (!raw) return;
            const state = JSON.parse(raw);
            state.history = [];
            localStorage.setItem(QUEUE_KEY, JSON.stringify(state));
            window.dispatchEvent(new Event('storage'));
        } catch (e) {
            console.error('Error clearing history:', e);
        }
    };

    const exportHistory = () => {
        const hist = getHistory();
        const blob = new Blob([JSON.stringify(hist, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'otopila-service-history.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    };

    return { getHistory, clearHistory, exportHistory };
})();
