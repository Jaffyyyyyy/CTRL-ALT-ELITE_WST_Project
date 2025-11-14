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
        return /^[A-Z]{3}-[0-9]{4}$/.test(val);
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

    const emailInput = document.getElementById('email');
    const selectPaymentBtn = document.getElementById('select-payment-btn');
    const paymentMethodInput = document.getElementById('paymentMethod');
    const paymentMethodContainer = document.getElementById('payment-method-container');
    let selectedPaymentMethod = null;

    selectPaymentBtn.addEventListener('click', () => {
        formatAndValidateName();

        let isValid = true;
        if (!nameInput.value.trim()) {
            nameInput.classList.add('is-invalid');
            isValid = false;
        }

        if (!emailInput.value.trim()) {
            emailInput.classList.add('is-invalid');
            isValid = false;
        } else {
            emailInput.classList.remove('is-invalid');
        }

        if (carPlateInput.value.trim() && !/^[A-Z]{3}-[0-9]{4}$/.test(carPlateInput.value)) {
            carPlateInput.classList.add('is-invalid');
            isValid = false;
        } else {
            carPlateInput.classList.remove('is-invalid');
        }

        if (!isValid) {
            return;
        }

        const paymentModal = new bootstrap.Modal(document.getElementById('paymentModal'));
        paymentModal.show();
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        if (!selectedPaymentMethod) {
            alert('Please select a payment method first.');
            return;
        }

        processQueueJoin(selectedPaymentMethod);
    });

    document.querySelectorAll('.payment-option').forEach(button => {
        button.addEventListener('click', function() {
            selectedPaymentMethod = this.getAttribute('data-payment');
            const paymentModal = bootstrap.Modal.getInstance(document.getElementById('paymentModal'));
            paymentModal.hide();
            
            paymentMethodInput.value = selectedPaymentMethod;
            paymentMethodContainer.style.display = 'block';
            
            selectPaymentBtn.style.display = 'none';
            submitButton.style.display = 'block';
        });
    });

    function processQueueJoin(paymentMethod) {
        submitButton.style.display = 'none';
        animationContainer.style.display = 'block';

        const customerData = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            carPlate: carPlateInput.value.trim() || 'N/A',
            paymentMethod: paymentMethod || selectedPaymentMethod
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
        }, 2500);
    }
});
