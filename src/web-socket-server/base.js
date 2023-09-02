export const webSocketPort = 8000;

export const pagePort = 5173;

const https = import.meta.url.indexOf('https://');
export const localIp = import.meta.url.slice(https !== -1 ? https : import.meta.url.indexOf('http://') + 7, import.meta.url.indexOf(`${pagePort}`) - 1);

export const securityCode = 'qwerty123';