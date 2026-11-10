import { toJpeg, toPng } from 'html-to-image';

export type ExportFormat = 'jpg' | 'png';

function fileName(fmt: ExportFormat) {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `arekatike-news-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}.${fmt}`;
}

export async function renderPoster(node: HTMLElement, fmt: ExportFormat): Promise<Blob> {
  await document.fonts.ready;
  const opts = {
    pixelRatio: 1.5,
    cacheBust: false,
    backgroundColor: '#ffffff',
    width: node.offsetWidth,
    height: node.offsetHeight,
    style: { transform: 'none', margin: '0' },
  };
  const fn = fmt === 'png' ? toPng : (n: HTMLElement, o: typeof opts) => toJpeg(n, { ...o, quality: 0.93 });
  // First pass warms up font/image embedding (fixes blank images on iOS Safari).
  await fn(node, opts);
  const dataUrl = await fn(node, opts);
  const res = await fetch(dataUrl);
  return res.blob();
}

export function downloadBlob(blob: Blob, fmt: ExportFormat) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName(fmt);
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export function canShareFiles(): boolean {
  try {
    const f = new File([new Blob(['x'], { type: 'image/jpeg' })], 'x.jpg', { type: 'image/jpeg' });
    return !!navigator.canShare && navigator.canShare({ files: [f] });
  } catch {
    return false;
  }
}

export async function shareBlob(blob: Blob, fmt: ExportFormat, title: string) {
  const file = new File([blob], fileName(fmt), { type: fmt === 'png' ? 'image/png' : 'image/jpeg' });
  await navigator.share({ files: [file], title });
}
