// Meta Pixel (Facebook Pixel) Integration Utility
declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
  }
}

let isInitialized = false;
let currentPixelId: string | null = null;

export const initMetaPixel = (pixelId?: string) => {
  if (!pixelId || typeof window === 'undefined') return;

  const cleanId = pixelId.trim();
  if (!cleanId) return;

  if (isInitialized && currentPixelId === cleanId) return;

  try {
    /* eslint-disable */
    (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */

    if (window.fbq) {
      window.fbq('init', cleanId);
      window.fbq('track', 'PageView');
      isInitialized = true;
      currentPixelId = cleanId;
      // console.log(`[Meta Pixel] Initialized with ID: ${cleanId}`);
    }
  } catch (err) {
    console.warn('[Meta Pixel] Error initializing pixel:', err);
  }
};

export const trackMetaPixelEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    try {
      if (params) {
        window.fbq('track', eventName, params);
      } else {
        window.fbq('track', eventName);
      }
    } catch (err) {
      console.warn(`[Meta Pixel] Failed tracking ${eventName}:`, err);
    }
  }
};
