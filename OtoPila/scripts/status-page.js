document.addEventListener('DOMContentLoaded', () => {
    const nowServingEl = document.getElementById('now-serving-number');
    const userQueueNumberEl = document.getElementById('user-queue-number');
    const customersAheadEl = document.getElementById('customers-ahead');
    const userSpecificMessageEl = document.getElementById('user-specific-message');

    const myQueueId = parseInt(sessionStorage.getItem('myQueueId'));

    const updateStatus = () => {
        const state = queueService.getState();
        const { customers, nowServing } = state;

        let nowServingCustomer = customers.find(c => c.id === nowServing) || null;
        if (!nowServingCustomer) {
            nowServingCustomer = customers.find(c => c.status === 'In Service') || null;
        }
        if (!nowServingCustomer) {
            nowServingCustomer = customers.find(c => c.status === 'Waiting') || null;
        }
        nowServingEl.textContent = (nowServingCustomer && nowServingCustomer.queueNumber) ? nowServingCustomer.queueNumber : '---';

        if (!myQueueId) {
            userQueueNumberEl.textContent = 'N/A';
            customersAheadEl.textContent = '-';
            userSpecificMessageEl.textContent = 'You are not in the queue. Please join the queue to see your status.';
            userSpecificMessageEl.classList.remove('d-none');
            userSpecificMessageEl.classList.add('alert-info');
            return;
        }

        const myCustomer = customers.find(c => c.id === myQueueId) || state.history.find(c => c.id === myQueueId);

        if (!myCustomer) {
            sessionStorage.removeItem('myQueueId');
            userQueueNumberEl.textContent = 'N/A';
            customersAheadEl.textContent = '-';
            userSpecificMessageEl.textContent = 'Your queue number was not found. It might have been removed or completed.';
            userSpecificMessageEl.classList.remove('d-none', 'alert-info', 'alert-success', 'alert-warning');
            userSpecificMessageEl.classList.add('alert-danger');
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('new') === 'true') {
            const modalElement = document.getElementById('confirmationModal');
            if (modalElement) {
                const modalBody = modalElement.querySelector('.modal-body');
                modalBody.innerHTML = `
                    <p class="lead">You have successfully joined the queue.</p>
                    <p>Your queue number is:</p>
                    <p class="display-4 fw-bold text-primary">${myCustomer.queueNumber}</p>
                `;
                const modal = new bootstrap.Modal(modalElement);
                modal.show();
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        }

        userQueueNumberEl.textContent = myCustomer.queueNumber;

        if (myCustomer.status === 'In Service') {
            customersAheadEl.textContent = '0';
            userSpecificMessageEl.textContent = 'Your car is currently being serviced!';
            userSpecificMessageEl.classList.remove('d-none', 'alert-warning', 'alert-danger', 'alert-info');
            userSpecificMessageEl.classList.add('alert-success');
        } else if (myCustomer.status === 'Waiting') {
            const waitingCustomers = state.customers.filter(c => c.status === 'Waiting');
            const myIndex = waitingCustomers.findIndex(c => c.id === myQueueId);
            customersAheadEl.textContent = myIndex;

            if (myIndex === 0) {
                userSpecificMessageEl.textContent = 'You are next! Please prepare to proceed to the service bay.';
                userSpecificMessageEl.classList.remove('d-none', 'alert-success', 'alert-danger', 'alert-info');
                userSpecificMessageEl.classList.add('alert-warning');
            } else {
                userSpecificMessageEl.textContent = `There are ${myIndex} customers ahead of you.`;
                userSpecificMessageEl.classList.remove('d-none', 'alert-success', 'alert-danger', 'alert-warning');
                userSpecificMessageEl.classList.add('alert-info');
            }
        } else {
            customersAheadEl.textContent = '-';
            userSpecificMessageEl.textContent = `Your service is complete. Thank you for choosing OtoPila!`;
            userSpecificMessageEl.classList.remove('d-none', 'alert-warning', 'alert-danger', 'alert-info');
            userSpecificMessageEl.classList.add('alert-success');

            const reviewModalShown = sessionStorage.getItem('reviewModalShownFor' + myQueueId);
            if (!reviewModalShown) {
                const reviewModalElement = document.getElementById('reviewModal');
                if (reviewModalElement) {
                    const reviewModal = new bootstrap.Modal(reviewModalElement);
                    reviewModal.show();
                    sessionStorage.setItem('reviewModalShownFor' + myQueueId, 'true');
                }
            }
        }
    };

    updateStatus();
    setInterval(updateStatus, 3000);

    window.addEventListener('storage', () => {
        updateStatus();
    });

    window.addEventListener('queueUpdated', () => {
        updateStatus();
    });
});
