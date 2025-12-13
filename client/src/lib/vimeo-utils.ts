/**
 * تحويل أي صيغة من روابط Vimeo إلى رابط embed صحيح
 * يقبل:
 * - https://vimeo.com/1140916294
 * - https://vimeo.com/1140916294?share=copy&fl=sv&fe=ci (مع معاملات إضافية)
 * - https://player.vimeo.com/video/1140916294
 * - 1140916294 (رقم الفيديو فقط)
 */
export function convertVimeoUrl(url: string): string {
  if (!url) return "";

  // تنظيف الرابط - إزالة المسافات الزائدة
  url = url.trim();

  // استخراج رقم الفيديو من الرابط
  let videoId = "";

  // إذا كان الرابط يحتوي على رقم فقط
  if (/^\d+$/.test(url)) {
    videoId = url;
  }
  // إذا كان الرابط يحتوي على vimeo.com (مع أو بدون معاملات)
  else if (url.includes("vimeo.com")) {
    // استخراج الرقم قبل أي علامات استفهام أو شرطات مائلة
    const match = url.match(/vimeo\.com\/(\d+)/);
    if (match) {
      videoId = match[1];
    }
  }
  // إذا كان الرابط يحتوي على player.vimeo.com
  else if (url.includes("player.vimeo.com")) {
    const match = url.match(/video\/(\d+)/);
    if (match) {
      videoId = match[1];
    }
  }

  if (!videoId) {
    console.warn("لم يتمكن من استخراج رقم الفيديو من الرابط:", url);
    return "";
  }

  // إرجاع رابط embed صحيح (بدون أي معاملات إضافية)
  // استخدام embed.vimeo.com بدلاً من player.vimeo.com لتجنب مشاكل الأمان
  return `https://player.vimeo.com/video/${videoId}?h=&badge=0&autopause=0&player_id=0&app_id=58479`;
}

/**
 * التحقق من صحة رابط Vimeo
 */
export function isValidVimeoUrl(url: string): boolean {
  if (!url) return false;

  // إذا كان الرابط يحتوي على رقم فقط
  if (/^\d+$/.test(url)) {
    return true;
  }

  // إذا كان الرابط يحتوي على vimeo.com أو player.vimeo.com
  return /vimeo\.com\/\d+|player\.vimeo\.com\/video\/\d+/.test(url);
}
