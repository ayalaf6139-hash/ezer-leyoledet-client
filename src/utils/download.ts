import api from './api';

export async function downloadFile(url: string, fallbackName: string) {
    const response = await api.get<Blob>(url, { responseType: 'blob' });
    const header = String(response.headers['content-disposition'] ?? '');
    const match = header.match(/filename="?([^"]+)"?/);
    const fileName = match ? match[1] : fallbackName;

    const link = document.createElement('a');
    link.href = URL.createObjectURL(response.data);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
}