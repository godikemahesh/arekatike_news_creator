import { CSSProperties, useEffect, useLayoutEffect, useRef, useState } from 'react';

/** Re-renders once web fonts finish loading so text measurements are correct. */
export function useFontsVersion(): number {
  const [v, setV] = useState(0);
  useEffect(() => {
    let alive = true;
    const bump = () => alive && setV((x) => x + 1);
    document.fonts.ready.then(bump);
    document.fonts.addEventListener?.('loadingdone', bump);
    return () => {
      alive = false;
      document.fonts.removeEventListener?.('loadingdone', bump);
    };
  }, []);
  return v;
}

interface Props {
  text: string;
  max: number;
  min: number;
  className?: string;
  style?: CSSProperties;
  /** anything that changes the available width / font */
  deps?: unknown[];
  /** keep the user's own line breaks (each line fitted on one row) */
  multiline?: boolean;
}

/** Single-line text that shrinks to fit its box; wraps only if even `min` is too big. */
export function FitText({ text, max, min, className, style, deps = [], multiline = false }: Props) {
  const noWrap = multiline ? 'pre' : 'nowrap';
  const wrapMode = multiline ? 'pre-line' : 'normal';
  const box = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLSpanElement>(null);
  const [fit, setFit] = useState({ size: max, wrap: false });
  const fontsV = useFontsVersion();

  useLayoutEffect(() => {
    const b = box.current;
    const i = inner.current;
    if (!b || !i) return;
    const avail = b.clientWidth;
    const fits = (s: number) => {
      i.style.fontSize = s + 'px';
      return i.scrollWidth <= avail;
    };
    i.style.whiteSpace = noWrap;
    let size = min;
    let wrap = false;
    if (fits(max)) size = max;
    else if (!fits(min)) wrap = true;
    else {
      let lo = min;
      let hi = max;
      while (hi - lo > 1) {
        const mid = Math.floor((lo + hi) / 2);
        if (fits(mid)) lo = mid;
        else hi = mid;
      }
      size = lo;
    }
    i.style.fontSize = size + 'px';
    i.style.whiteSpace = wrap ? wrapMode : noWrap;
    setFit((f) => (f.size === size && f.wrap === wrap ? f : { size, wrap }));
  }, [text, max, min, multiline, fontsV, ...deps]);

  return (
    <div ref={box} className={className} style={{ width: '100%', ...style }}>
      <span
        ref={inner}
        style={{ display: 'inline-block', fontSize: fit.size, whiteSpace: fit.wrap ? wrapMode : noWrap, maxWidth: fit.wrap ? '100%' : undefined }}
      >
        {text}
      </span>
    </div>
  );
}
