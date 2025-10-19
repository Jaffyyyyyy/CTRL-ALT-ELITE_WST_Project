(function(){
    const QUEUE_KEY = 'otoPilaQueue';
    const DEMO_PATH = 'demodata/sample-queue.json';

    function isEmptyState() {
        try {
            const raw = localStorage.getItem(QUEUE_KEY);
            if (!raw) return true;
            const state = JSON.parse(raw);
            return !state || (Array.isArray(state.customers) && state.customers.length === 0 && (!state.history || state.history.length === 0));
        } catch (e) {
            return true;
        }
    }

    if (isEmptyState()) {
        fetch(DEMO_PATH)
            .then(res => {
                if (!res.ok) throw new Error('Could not fetch demo data');
                return res.json();
            })
            .then(data => {
                if (data && Array.isArray(data.customers)) {
                    if (!isEmptyState()) {
                        return;
                    }
                    try {
                        if (window.queueService && typeof window.queueService.loadDemoData === 'function') {
                            window.queueService.loadDemoData(data.customers);
                            try { window.dispatchEvent(new CustomEvent('oto:autoDemoLoaded', { detail: { source: 'auto-load-demo' } })); } catch (e) {}
                        } else {
                            const initial = {
                                customers: [],
                                nowServing: null,
                                nextQueueNumber: 101,
                                history: []
                            };
                            data.customers.forEach(cust => {
                                const entry = {
                                    id: Date.now() + initial.nextQueueNumber,
                                    queueNumber: `A-${initial.nextQueueNumber}`,
                                    name: cust.name,
                                    email: cust.email,
                                    carPlate: cust.carPlate,
                                    status: cust.status,
                                    checkInTime: new Date().toISOString()
                                };
                                if (entry.status === 'Completed') initial.history.unshift(entry);
                                else initial.customers.push(entry);
                                if (entry.status === 'In Service') initial.nowServing = entry.id;
                                initial.nextQueueNumber++;
                            });
                            localStorage.setItem(QUEUE_KEY, JSON.stringify(initial));
                            window.dispatchEvent(new Event('storage'));
                            try { window.dispatchEvent(new CustomEvent('oto:autoDemoLoaded', { detail: { source: 'auto-load-demo' } })); } catch (e) {}
                        }
                    } catch (err) {
                        console.error('Error loading demo data into queue:', err);
                    }
                }
            })
            .catch(err => {
                console.warn('Auto demo load skipped:', err);
            });
    }
})();
