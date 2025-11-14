document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    if (!form) return;

    const nameInput = document.getElementById('fullName');
    const carPlateInput = document.getElementById('carPlate');
    const submitButton = document.getElementById('join-queue-btn');
    const queuedContainer = document.querySelector('.queued-container');
    const animationContainer = document.getElementById('animation-container');

    const formatAndValidateName = () => {
        let value = nameInput.value;
        value = value.replace(/[0-9]/g, '');
        value = value.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
        nameInput.value = value;

        if (!nameInput.value.trim()) {
            nameInput.classList.add('is-invalid');
        } else {
            nameInput.classList.remove('is-invalid');
        }
    };

    if (nameInput) {
        nameInput.addEventListener('input', formatAndValidateName);
        nameInput.addEventListener('blur', formatAndValidateName);
    }

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

        const emailInput = document.getElementById('email');
        
        formatAndValidateName();

        let isValid = true;
        if (!nameInput.value.trim()) {
            nameInput.classList.add('is-invalid');
            isValid = false;
        }

        if (carPlateInput && carPlateInput.value && !/^[A-Z]{1,3}-[0-9]{1,4}$/.test(carPlateInput.value)) {
            carPlateInput.classList.add('is-invalid');
            isValid = false;
        } else if (carPlateInput) {
            carPlateInput.classList.remove('is-invalid');
        }

        if (!isValid) {
            return;
        }

        
        submitButton.style.display = 'none';
        animationContainer.style.display = 'block';

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
        
        setTimeout(() => {
            animationContainer.style.display = 'none';
            queuedContainer.style.display = 'block';
        }, 2200);

        setTimeout(() => {
            window.location.href = `status.html?new=true`;
        }, 4000);
    });
});
