document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    if (!form) return;

    const carPlateInput = document.getElementById('carPlate');

    const formatCarPlate = (raw) => {
        if (!raw) return '';
        let v = raw.toUpperCase();
        v = v.replace(/[^A-Z0-9]/g, '');
        const letters = v.replace(/[^A-Z]/g, '').slice(0, 3);
        const digits = v.replace(/[^0-9]/g, '').slice(0, 4);
        if (letters.length === 0) return digits;
        if (digits.length === 0) return letters;
        return `${letters}${digits ? '-' : ''}${digits}`;
    };

    const validateCarPlate = (val) => {
        if (!val) return true;
        return /^[A-Z]{1,3}-[0-9]{1,4}$/.test(val);
    };

    if (carPlateInput) {
        const applyFormat = () => {
            const formatted = formatCarPlate(carPlateInput.value);
            carPlateInput.value = formatted;
            carPlateInput.setSelectionRange(formatted.length, formatted.length);
            if (!validateCarPlate(formatted)) {
                carPlateInput.classList.add('is-invalid');
            } else {
                carPlateInput.classList.remove('is-invalid');
            }
        };
        carPlateInput.addEventListener('input', applyFormat);
        carPlateInput.addEventListener('blur', applyFormat);
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const nameInput = document.getElementById('fullName');
        const emailInput = document.getElementById('email');
        const carPlateInput = document.getElementById('carPlate');

        if (!nameInput.value.trim()) {
            nameInput.focus();
            return;
        }
        if (carPlateInput && carPlateInput.value && !/^[A-Z]{1,3}-[0-9]{1,4}$/.test(carPlateInput.value)) {
            carPlateInput.classList.add('is-invalid');
            carPlateInput.focus();
            return;
        }

        const customerData = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            carPlate: carPlateInput.value.trim()
        };

        const prevState = queueService.getState();
        const wasEmpty = (!prevState || (Array.isArray(prevState.customers) && prevState.customers.length === 0 && (!prevState.history || prevState.history.length === 0)));

        const newCustomer = queueService.addCustomer(customerData);

        if (wasEmpty) {
            try {
                fetch('demodata/sample-queue.json')
                    .then(r => r.ok ? r.json() : Promise.reject('demo fetch failed'))
                    .then(d => {
                        if (d && Array.isArray(d.customers) && window.queueService && typeof window.queueService.loadDemoDataMerge === 'function') {
                            window.queueService.loadDemoDataMerge(d.customers);
                        }
                    })
                    .catch(() => {});
            } catch (_) {}
        }

        sessionStorage.setItem('myQueueId', newCustomer.id);

        window.location.href = `status.html`;
    });
});
