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

    const exportHistory = (format = 'json') => {
        const hist = getHistory();
        if (!hist || hist.length === 0) {
            alert('No service history to export.');
            return;
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        
        switch(format) {
            case 'json':
                exportAsJSON(hist, timestamp);
                break;
            case 'xlsx':
                exportAsXLSX(hist, timestamp);
                break;
            case 'docx':
                exportAsDOCX(hist, timestamp);
                break;
            case 'txt':
                exportAsTXT(hist, timestamp);
                break;
            default:
                exportAsJSON(hist, timestamp);
        }
    };

    const exportAsJSON = (hist, timestamp) => {
        const blob = new Blob([JSON.stringify(hist, null, 2)], { type: 'application/json' });
        downloadFile(blob, `otopila-service-history-${timestamp}.json`);
    };

    const exportAsXLSX = (hist, timestamp) => {
        let csv = 'Queue Number,Name,Car Plate,Status,Finished At\n';
        
        hist.forEach(r => {
            const status = r.status || 'Completed';
            const finishedTime = r.cancelledAt || r.completedAt || r.checkInTime;
            const row = [
                escapeCSV(r.queueNumber),
                escapeCSV(r.name),
                escapeCSV(r.carPlate || 'N/A'),
                escapeCSV(status),
                escapeCSV(new Date(finishedTime).toLocaleString())
            ];
            csv += row.join(',') + '\n';
        });

        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
        downloadFile(blob, `otopila-service-history-${timestamp}.csv`);
    };

    const escapeCSV = (str) => {
        if (str === null || str === undefined) return '';
        str = String(str);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return '"' + str.replace(/"/g, '""') + '"';
        }
        return str;
    };

    const exportAsDOCX = (hist, timestamp) => {
        let content = 'OTOPILA SERVICE HISTORY REPORT\n';
        content += '='.repeat(60) + '\n\n';
        content += `Generated: ${new Date().toLocaleString()}\n`;
        content += `Total Records: ${hist.length}\n\n`;
        content += '='.repeat(60) + '\n\n';

        hist.forEach((r, idx) => {
            const status = r.status || 'Completed';
            const finishedTime = r.cancelledAt || r.completedAt || r.checkInTime;
            content += `Record #${idx + 1}\n`;
            content += '-'.repeat(40) + '\n';
            content += `Queue Number: ${r.queueNumber}\n`;
            content += `Name: ${r.name}\n`;
            content += `Car Plate: ${r.carPlate || 'N/A'}\n`;
            content += `Status: ${status}\n`;
            content += `Finished At: ${new Date(finishedTime).toLocaleString()}\n`;
            content += '\n';
        });

        const rtfContent = '{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Arial;}}\\f0\\fs24 ' + 
                          content.replace(/\n/g, '\\par ') + '}';
        const blob = new Blob([rtfContent], { type: 'application/rtf' });
        downloadFile(blob, `otopila-service-history-${timestamp}.doc`);
    };

    const exportAsTXT = (hist, timestamp) => {
        let content = 'OTOPILA SERVICE HISTORY REPORT\n';
        content += '='.repeat(60) + '\n\n';
        content += `Generated: ${new Date().toLocaleString()}\n`;
        content += `Total Records: ${hist.length}\n\n`;
        content += '='.repeat(60) + '\n\n';

        hist.forEach((r, idx) => {
            const status = r.status || 'Completed';
            const finishedTime = r.cancelledAt || r.completedAt || r.checkInTime;
            content += `Record #${idx + 1}\n`;
            content += '-'.repeat(40) + '\n';
            content += `Queue Number: ${r.queueNumber}\n`;
            content += `Name: ${r.name}\n`;
            content += `Car Plate: ${r.carPlate || 'N/A'}\n`;
            content += `Status: ${status}\n`;
            content += `Finished At: ${new Date(finishedTime).toLocaleString()}\n`;
            content += '\n';
        });

        const blob = new Blob([content], { type: 'text/plain' });
        downloadFile(blob, `otopila-service-history-${timestamp}.txt`);
    };

    const downloadFile = (blob, filename) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    };

    return { getHistory, clearHistory, exportHistory };
})();

