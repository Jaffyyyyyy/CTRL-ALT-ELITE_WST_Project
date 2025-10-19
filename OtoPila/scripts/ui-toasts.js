(function(){
    function ensureToastContainer() {
        let container = document.getElementById('oto-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'oto-toast-container';
            container.style.position = 'fixed';
            container.style.right = '1rem';
            container.style.bottom = '1rem';
            container.style.zIndex = 1200;
            document.body.appendChild(container);
        }
        return container;
    }

    function showToast(message, options = {}) {
        const container = ensureToastContainer();
        const toast = document.createElement('div');
        toast.className = 'toast align-items-center text-bg-primary border-0 show';
        toast.style.minWidth = '240px';
        toast.role = 'alert';
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <div class="ms-auto p-2">
                    ${options.undo ? '<button class="btn btn-sm btn-light me-1" id="oto-undo-btn">Undo</button>' : ''}
                    <button class="btn btn-sm btn-light" id="oto-close-btn">Close</button>
                </div>
            </div>
        `;
        container.appendChild(toast);
        const close = () => { toast.remove(); };
        toast.querySelector('#oto-close-btn').addEventListener('click', close);
        if (options.undo) {
            toast.querySelector('#oto-undo-btn').addEventListener('click', () => {
                try {
                    if (window.queueService && typeof queueService.restoreUndo === 'function') {
                        const ok = queueService.restoreUndo();
                        if (ok) showToast('Undo successful', {});
                    }
                } catch (e) { console.error(e); }
                close();
            });
        }
        setTimeout(close, options.duration || 8000);
    }

    window.addEventListener('oto:queueCleared', (e) => {
        showToast('Queue cleared', { undo: true });
    });

    window.addEventListener('oto:autoDemoLoaded', (e) => {
        showToast('Demo data loaded', { duration: 5000 });
    });
})();
