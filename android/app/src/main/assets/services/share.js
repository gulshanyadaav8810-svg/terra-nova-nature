/* ==========================================================
   NATURE MOMENTS — WHATSAPP & SYSTEM SHARE SERVICE
   Direct WhatsApp sharing and standard Web Share API fallback
   ========================================================== */

class ShareService {
  // Share specific Reel
  async shareReel(reel) {
    const text = `Check out this trending video on WhatsApp Status! ✨📲\n\n"${reel.title}"\nCategory: ${reel.category_id.toUpperCase()}\n\nWatch more WhatsApp Status reels!`;
    const shareUrl = window.location.origin + window.location.pathname + `?reel=${reel.content_id}`;

    // 1. Android Native Bridge
    if (window.AndroidBridge && typeof window.AndroidBridge.shareWhatsApp === 'function') {
      try {
        window.AndroidBridge.shareWhatsApp(text + '\n' + shareUrl);
        return { success: true, method: 'android_bridge' };
      } catch (e) {
        console.warn('AndroidBridge share error', e);
      }
    }

    // 2. Web Share API (native sheet on Android Chrome, iOS Safari)
    if (navigator.share) {
      try {
        await navigator.share({
          title: `WhatsApp Status — ${reel.title}`,
          text: text,
          url: shareUrl
        });
        return { success: true, method: 'navigator_share' };
      } catch (err) {
        if (err.name === 'AbortError') {
          return { success: false, aborted: true };
        }
        console.warn('Web Share failed, attempting WhatsApp direct URL', err);
      }
    }

    // 3. Direct WhatsApp Web / App protocol
    try {
      const encodedMsg = encodeURIComponent(`${text}\n${shareUrl}`);
      const waUrl = `https://api.whatsapp.com/send?text=${encodedMsg}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      return { success: true, method: 'whatsapp_url' };
    } catch (e) {
      console.error('Failed to open WhatsApp URL', e);
      return { success: false, error: e };
    }
  }

  // Share Application
  async shareApp() {
    const appText = 'Watch, download, and share trending short video reels on WhatsApp Status application! 📲✨';
    const appUrl = window.location.href;

    if (window.AndroidBridge && typeof window.AndroidBridge.shareApp === 'function') {
      try {
        window.AndroidBridge.shareApp(appText + '\n' + appUrl);
        return true;
      } catch (e) {}
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'WhatsApp Status App',
          text: appText,
          url: appUrl
        });
        return true;
      } catch (e) {}
    }

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(appText + ' ' + appUrl)}`;
    window.open(waUrl, '_blank');
    return true;
  }
}

export const shareService = new ShareService();
