const queueService = (() => {
    const QUEUE_KEY = 'otoPilaQueue';

    const getInitialState = () => ({
        customers: [],
        nowServing: null,
        nextQueueNumber: 101,
        history: [] 
    });

    const getState = () => {
        try {
            const storedState = localStorage.getItem(QUEUE_KEY);
            if (storedState) {
                return JSON.parse(storedState);
            }
        } catch (error) {
            console.error("Error reading from localStorage:", error);
        }
        return getInitialState();
    };

    const setState = (state) => {
        try {
            localStorage.setItem(QUEUE_KEY, JSON.stringify(state));
            window.dispatchEvent(new Event('storage'));
        } catch (error) {
            console.error("Error writing to localStorage:", error);
        }
    };

    const loadDemoData = (demoCustomers) => {
        const state = getInitialState();
        let servingCustomer = null;

        demoCustomers.forEach(cust => {
            const queueNumber = `A-${state.nextQueueNumber}`;
            const newCustomer = {
                id: Date.now() + state.nextQueueNumber,
                queueNumber,
                name: cust.name,
                email: cust.email,
                carPlate: cust.carPlate,
                status: cust.status,
                checkInTime: new Date().toISOString()
            };

            if (newCustomer.status === 'Completed') {
                newCustomer.completedAt = cust.completedAt || new Date().toISOString();
                state.history.unshift(newCustomer);
            } else {
                state.customers.push(newCustomer);
            }

            if (newCustomer.status === 'In Service') {
                servingCustomer = newCustomer;
            }
            
            state.nextQueueNumber++;
        });

        if (servingCustomer) {
            state.nowServing = servingCustomer.id;
        }

        setState(state);
    };

    const loadDemoDataMerge = (demoCustomers) => {
        if (!Array.isArray(demoCustomers) || demoCustomers.length === 0) return;
        const state = getState();
        let servingCustomer = null;

        demoCustomers.forEach(cust => {
            const queueNumber = `A-${state.nextQueueNumber}`;
            const newCustomer = {
                id: Date.now() + state.nextQueueNumber,
                queueNumber,
                name: cust.name,
                email: cust.email,
                carPlate: cust.carPlate,
                status: cust.status,
                checkInTime: new Date().toISOString()
            };
            if (newCustomer.status === 'Completed') {
                newCustomer.completedAt = cust.completedAt || new Date().toISOString();
                state.history.unshift(newCustomer);
            } else {
                state.customers.push(newCustomer);
            }
            if (newCustomer.status === 'In Service' && !state.nowServing) {
                servingCustomer = newCustomer;
            }
            state.nextQueueNumber++;
        });

        if (servingCustomer && !state.nowServing) {
            state.nowServing = servingCustomer.id;
        }

        setState(state);
    };

    const addCustomer = (customerData) => {
        const state = getState();
        const queueNumber = `A-${state.nextQueueNumber}`;
        const newCustomer = {
            id: Date.now(),
            queueNumber,
            name: customerData.name,
            email: customerData.email,
            carPlate: customerData.carPlate,
            status: 'Waiting', 
            checkInTime: new Date().toISOString()
        };
        state.customers.push(newCustomer);
        state.nextQueueNumber++;
        setState(state);
        return newCustomer;
    };

    const callNextCustomer = () => {
        const state = getState();
        if (state.nowServing) {
            const previousCustomer = state.customers.find(c => c.id === state.nowServing);
            if (previousCustomer) {
                previousCustomer.status = 'Completed';
                previousCustomer.completedAt = previousCustomer.completedAt || new Date().toISOString();
                state.customers = state.customers.filter(c => c.id !== previousCustomer.id);
                state.history.unshift(previousCustomer);
            }
        }

        const nextCustomer = state.customers.find(c => c.status === 'Waiting');
        if (nextCustomer) {
            nextCustomer.status = 'In Service';
            state.nowServing = nextCustomer.id;
        } else {
            state.nowServing = null;
        }
        
        setState(state);
        return nextCustomer || null;
    };

    const updateCustomerStatus = (customerId, newStatus) => {
        const state = getState();
        const customer = state.customers.find(c => c.id === customerId);
        if (customer) {
            if (newStatus === 'Completed') {
                customer.status = 'Completed';
                customer.completedAt = customer.completedAt || new Date().toISOString();
                state.customers = state.customers.filter(c => c.id !== customerId);
                state.history.unshift(customer);
                if (state.nowServing === customerId) {
                    state.nowServing = null;
                }
            } else {
                customer.status = newStatus;
                if (newStatus === 'In Service') {
                    state.nowServing = customerId;
                }
            }
            setState(state);
        }
        return customer;
    };
    
    const removeCustomer = (customerId) => {
        const state = getState();
        state.customers = state.customers.filter(c => c.id !== customerId);
        if (state.nowServing === customerId) {
            state.nowServing = null;
        }
        setState(state);
    };

    const clearQueue = () => {
        setState(getInitialState());
    };

    return {
        getState,
        loadDemoData,
        loadDemoDataMerge,
        addCustomer,
        callNextCustomer,
        updateCustomerStatus,
        removeCustomer,
        clearQueue
    };
})();
