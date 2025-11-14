document.addEventListener('DOMContentLoaded', () => {
    const nowServingEl = document.getElementById('dashboard-now-serving');
    const nextInQueueEl = document.getElementById('dashboard-next-in-queue');
    const waitingCountEl = document.getElementById('dashboard-waiting-count');
    const inServiceCountEl = document.getElementById('dashboard-in-service-count');
    const completedCountEl = document.getElementById('dashboard-completed-count');
    const queueTableBodyEl = document.getElementById('queue-table-body');
    const callNextBtn = document.getElementById('call-next-btn');
    const clearQueueBtn = document.getElementById('clear-queue-btn');
    const loadDemoDataBtn = document.getElementById('load-demo-data-btn');

    const renderDashboard = () => {
        const state = queueService.getState();
        const { customers, nowServing, history } = state;

        const waitingCustomers = customers.filter(c => c.status === 'Waiting');
        
        let nowServingCustomer = customers.find(c => c.id === nowServing) || customers.find(c => c.status === 'In Service') || waitingCustomers[0] || null;
        
        let nextCustomerInQueue = null;
        if (nowServingCustomer) {
            if (nowServingCustomer.status === 'Waiting') {
                nextCustomerInQueue = waitingCustomers.find(c => c.id !== nowServingCustomer.id) || null;
            } else {
                nextCustomerInQueue = waitingCustomers[0] || null;
            }
        } else {
            nextCustomerInQueue = waitingCustomers.length > 1 ? waitingCustomers[1] : null;
        }

        nowServingEl.textContent = nowServingCustomer ? nowServingCustomer.queueNumber : '---';
        nextInQueueEl.textContent = nextCustomerInQueue ? nextCustomerInQueue.queueNumber : '---';

        const waitingCount = customers.filter(c => c.status === 'Waiting').length;
        const inServiceCount = customers.filter(c => c.status === 'In Service').length;
        
        waitingCountEl.textContent = waitingCount;
        inServiceCountEl.textContent = inServiceCount;
        completedCountEl.textContent = history.length;

        queueTableBodyEl.innerHTML = '';
        if (customers.length === 0) {
            queueTableBodyEl.innerHTML = '<tr><td colspan="5" class="text-center p-4">The queue is empty.</td></tr>';
        } else {
            customers.forEach(customer => {
                const row = document.createElement('tr');
                const statusBadge = getStatusBadge(customer.status);
                const statusOptions = customer.status === 'In Service'
                    ? `<option value="In Service" selected>In Service</option>
                       <option value="Completed">Completed</option>`
                    : `<option value="Waiting" ${customer.status === 'Waiting' ? 'selected' : ''}>Waiting</option>
                       <option value="In Service" ${customer.status === 'In Service' ? 'selected' : ''}>In Service</option>
                       <option value="Completed" ${customer.status === 'Completed' ? 'selected' : ''}>Completed</option>`;

                row.innerHTML = `
                    <td class="p-3">
                        <div class="fw-bold">${customer.queueNumber}</div>
                        <div>${customer.name}</div>
                        <div class="small text-muted">${customer.carPlate || 'N/A'}</div>
                    </td>
                    <td class="p-3 align-middle">${new Date(customer.checkInTime).toLocaleTimeString()}</td>
                    <td class="p-3 align-middle text-center">${statusBadge}</td>
                    <td class="p-3 align-middle text-center">
                        <select class="form-select form-select-sm status-select" data-id="${customer.id}">
                            ${statusOptions}
                        </select>
                    </td>
                    <td class="p-3 align-middle text-center">
                        <button class="btn btn-sm btn-outline-danger remove-btn" data-id="${customer.id}">Cancel</button>
                    </td>
                `;
                queueTableBodyEl.appendChild(row);
            });
        }
    };

    const getStatusBadge = (status) => {
        let badgeClass = 'badge rounded-pill ';
        switch (status) {
            case 'Waiting':
                badgeClass += 'bg-warning-subtle text-warning-emphasis';
                break;
            case 'In Service':
                badgeClass += 'bg-primary-subtle text-primary-emphasis';
                break;
            case 'Completed':
                badgeClass += 'bg-success-subtle text-success-emphasis';
                break;
        }
        return `<span class="${badgeClass}">${status}</span>`;
    };

    loadDemoDataBtn.addEventListener('click', () => {
        fetch('demodata/sample-queue.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (confirm('This will clear the current queue and load sample data. Are you sure?')) {
                    queueService.loadDemoData(data.customers);
                    renderDashboard();
                }
            })
            .catch(error => {
                console.error('Error loading demo data:', error);
                alert('Could not load demo data. Please check the console for details.');
            });
    });

    queueTableBodyEl.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-btn')) {
            const customerId = parseInt(e.target.getAttribute('data-id'));
            if (confirm('Are you sure you want to remove this customer?')) {
                const row = e.target.closest('tr');
                row.classList.add('queue-item-exiting');
                setTimeout(() => {
                    queueService.removeCustomer(customerId);
                    renderDashboard();
                }, 500);
            }
        }
    });

    queueTableBodyEl.addEventListener('change', (e) => {
        if (e.target.classList.contains('status-select')) {
            const customerId = parseInt(e.target.getAttribute('data-id'));
            const newStatus = e.target.value;
            if (newStatus === 'Completed') {
                const row = e.target.closest('tr');
                row.classList.add('queue-item-exiting');
                setTimeout(() => {
                    queueService.updateCustomerStatus(customerId, newStatus);
                    renderDashboard();
                }, 500);
            } else {
                queueService.updateCustomerStatus(customerId, newStatus);
            }
        }
    });

    callNextBtn.addEventListener('click', () => {
        const state = queueService.getState();
        const nowServingCustomer = state.customers.find(c => c.id === state.nowServing);

        if (nowServingCustomer) {
            const button = queueTableBodyEl.querySelector(`button[data-id="${nowServingCustomer.id}"]`);
            if (button) {
                const row = button.closest('tr');
                row.classList.add('queue-item-exiting');
                setTimeout(() => {
                    queueService.callNextCustomer();
                    renderDashboard();
                }, 500);
            } else {
                queueService.callNextCustomer();
                renderDashboard();
            }
        } else {
            queueService.callNextCustomer();
            renderDashboard();
        }
    });

    clearQueueBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear the entire queue and history? This cannot be undone.')) {
            queueService.clearQueue();
            renderDashboard();
        }
    });

    renderDashboard();

    window.addEventListener('storage', () => {
        renderDashboard();
    });
});