// pwa.js
// Instalación como app (PWA): registra el service worker y maneja el botón "Instalar".

let deferredPrompt = null;
const listeners = new Set();

export const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

// iPhone/iPad: Safari no muestra el aviso de instalación, hay que hacerlo a mano.
export const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent)
  || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

export const canInstall = () => !!deferredPrompt;
export const onInstallChange = (fn) => listeners.add(fn);
const notify = () => listeners.forEach((fn) => fn());

export async function promptInstall() {
  if (!deferredPrompt) return false;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  deferredPrompt = null;
  notify();
  return outcome === 'accepted';
}

export function initPWA() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); // guardamos el aviso para mostrarlo con nuestro botón
    deferredPrompt = e;
    notify();
  });
  window.addEventListener('appinstalled', () => { deferredPrompt = null; notify(); });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch((err) => console.warn('No se pudo registrar el service worker', err));
    });
  }
}
