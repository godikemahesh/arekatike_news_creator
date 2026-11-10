/** Read an uploaded photo, downscale it (keeps the draft small & export fast). */
export async function loadPhoto(file: File, maxSide = 1400): Promise<{ url: string; aspect: number }> {
  const src = await new Promise<string>((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = () => rej(r.error);
    r.readAsDataURL(file);
  });
  const img = await new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = src;
  });
  const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.round(img.naturalWidth * scale);
  const h = Math.round(img.naturalHeight * scale);
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  if (!ctx) return { url: src, aspect: img.naturalWidth / img.naturalHeight };
  ctx.drawImage(img, 0, 0, w, h);
  return { url: c.toDataURL('image/jpeg', 0.9), aspect: w / h };
}
