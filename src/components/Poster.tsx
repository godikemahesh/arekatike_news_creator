import { CSSProperties, forwardRef } from 'react';
import type { NewsData, Theme } from '../types';
import { getTheme } from '../themes';
import { formatTeluguDate } from '../lib/date';
import { FitText } from './FitText';
import { Brush } from './Brush';

const POSTER_W = 1200;

/** Thick outline around text using stacked shadows (renders identically in the exported image). */
function outline(color: string | null, w: number, drop = true): string | undefined {
  if (!color) return drop ? '0 4px 6px rgba(0,0,0,.18)' : undefined;
  const s: string[] = [];
  for (let a = 0; a < 360; a += 30) {
    const rad = (a * Math.PI) / 180;
    s.push(`${(Math.cos(rad) * w).toFixed(1)}px ${(Math.sin(rad) * w).toFixed(1)}px 0 ${color}`);
  }
  if (drop) s.push(`0 ${w + 4}px 2px rgba(0,0,0,.35)`);
  return s.join(',');
}

function paragraphs(text: string): string[] {
  return text
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function resolveLayout(d: NewsData): 'side' | 'top' | 'none' {
  if (!d.photo) return 'none';
  if (d.layout === 'side' || d.layout === 'top') return d.layout;
  if (d.layout === 'none') return 'none';
  return d.photoAspect > 1.2 ? 'top' : 'side';
}

/** Masthead rebuilt in HTML (correct Telugu text); only the logo & Charminar are images. */
function Header({ d }: { d: NewsData }) {
  const edition = d.edition.trim();
  return (
    <div className="pz-header">
      <div className="pz-h-sky" />
      <div className="pz-h-sun" />
      <img className="pz-h-logo" src="/logo.png" alt="" draggable={false} />
      <img className="pz-h-charminar" src="/charminar.png" alt="" draggable={false} />
      <div className="pz-h-titles">
        <FitText text="ఆరెకటికె చైతన్యం" max={112} min={70} className="pz-h-title" style={{ textShadow: outline('#ffffff', 6, false) + ', 0 10px 12px rgba(80,0,0,.45)' }} />
        <FitText text="డిజిటల్ దినపత్రిక" max={84} min={50} className="pz-h-sub" style={{ textShadow: outline('#ffffff', 5, false) + ', 0 7px 9px rgba(0,0,40,.35)' }} />
      </div>
      <div className="pz-h-strip">
        <div className="pz-h-date">
          <FitText text={formatTeluguDate(d.date, d.dateFormat)} max={25} min={13} />
        </div>
        <div className="pz-h-tag">సమాజం కోసం...&nbsp;&nbsp; సత్యం కోసం...&nbsp;&nbsp; ప్రజల గొంతుక</div>
      </div>
      {edition && (
        <div className="pz-h-badge">
          <FitText text={edition} max={30} min={14} />
        </div>
      )}
    </div>
  );
}

function Headline({ d, t, wide }: { d: NewsData; t: Theme; wide: boolean }) {
  const k = d.headScale;
  const l1Max = Math.round((wide ? 104 : 92) * k);
  const l2Max = Math.round((wide ? 150 : 124) * k);
  const fontFamily = d.headFont === 'ramabhadra' ? "'Ramabhadra', 'Noto Sans Telugu', sans-serif" : "'Noto Sans Telugu', sans-serif";
  const fontWeight = d.headFont === 'ramabhadra' ? 400 : 900;
  const hasBg = t.headBg !== 'none';

  const bgStyle: CSSProperties = {};
  if (t.headBg === 'band') {
    bgStyle.background = t.headBgColor;
    bgStyle.borderBottom = `10px solid ${t.headBgColor2}`;
    bgStyle.borderRadius = 8;
  } else if (t.headBg === 'ribbon') {
    bgStyle.background = `linear-gradient(90deg, ${t.headBgColor2}, ${t.headBgColor} 30%, ${t.headBgColor} 70%, ${t.headBgColor2})`;
    bgStyle.clipPath = 'polygon(0 0, 100% 0, 96.5% 50%, 100% 100%, 0 100%, 3.5% 50%)';
  } else if (t.headBg === 'gradient') {
    bgStyle.background = `linear-gradient(120deg, ${t.headBgColor}, ${t.headBgColor2})`;
    bgStyle.borderRadius = 22;
    bgStyle.boxShadow = 'inset 0 -8px 0 rgba(0,0,0,.12)';
  }

  const line1 = d.line1.trim();
  const line2 = d.line2.trim() || 'ప్రధాన హెడ్డింగ్';
  return (
    <div
      className={`pz-headline pz-hb-${t.headBg}`}
      style={{ fontFamily, fontWeight, padding: hasBg ? (t.headBg === 'ribbon' ? '22px 64px' : '22px 34px') : '6px 4px 4px' }}
    >
      {t.headBg === 'brush' && <Brush color={t.headBgColor} color2={t.headBgColor2} />}
      {hasBg && t.headBg !== 'brush' && <div className="pz-headline-bg" style={bgStyle} />}
      <div className="pz-headline-text">
        {line1 && (
          <FitText
            text={line1}
            max={l1Max}
            min={34}
            style={{ color: t.line1Color, textShadow: outline(t.line1Stroke, 4, hasBg) }}
            deps={[fontFamily, wide, t.headBg]}
          />
        )}
        <FitText
          text={line2}
          max={l2Max}
          min={44}
          style={{
            color: t.line2Color,
            textShadow: outline(t.line2Stroke, 5, hasBg),
            opacity: d.line2.trim() ? 1 : 0.35,
            marginTop: line1 ? 2 : 0,
          }}
          deps={[fontFamily, wide, t.headBg]}
        />
      </div>
      {!hasBg && <div className="pz-headline-rule" style={{ background: t.line2Color }} />}
    </div>
  );
}

function SubHead({ d, t }: { d: NewsData; t: Theme }) {
  const text = d.sub.trim();
  if (!text) return null;
  const n = text.length;
  const size = n <= 50 ? 40 : n <= 90 ? 36 : n <= 140 ? 32 : 28;
  const light = t.subBg.toLowerCase() === '#ffffff' || t.subBg.toLowerCase() === '#eef2fb';
  return (
    <div
      className="pz-sub"
      style={{
        background: t.subBg,
        color: t.subColor,
        fontSize: size,
        border: light ? `3px solid ${t.subColor}` : undefined,
      }}
    >
      {text.includes('\n') ? <FitText text={text} max={size + 4} min={22} multiline /> : text}
    </div>
  );
}

function Photo({ d, t, height }: { d: NewsData; t: Theme; height?: number }) {
  if (!d.photo) return null;
  const pos = `${d.photoX}% ${d.photoY}%`;
  return (
    <div className="pz-photo" style={{ borderColor: t.photoBorder, height }}>
      <img
        src={d.photo}
        alt=""
        draggable={false}
        style={{ objectPosition: pos, transform: `scale(${d.photoZoom})`, transformOrigin: pos }}
      />
    </div>
  );
}

function Article({ d, t }: { d: NewsData; t: Theme }) {
  const paras = paragraphs(d.body);
  const boxParas = paragraphs(d.boxText);
  const hasBox = !!(d.boxTitle.trim() || boxParas.length);
  if (!paras.length && !hasBox) {
    return <div className="pz-article pz-empty">వార్త వివరాలు ఇక్కడ కనిపిస్తాయి…</div>;
  }
  const n = d.body.length + d.boxText.length + d.boxTitle.length;
  const base = n < 250 ? 40 : n < 500 ? 36 : n < 800 ? 33 : n < 1200 ? 30 : n < 1700 ? 27 : 25;
  const size = Math.round(base * d.bodyScale);
  const cols = n < 180 ? 1 : 2;
  const fontFamily = d.bodyFont === 'mandali' ? "'Mandali', 'Noto Sans Telugu', sans-serif" : "'Noto Sans Telugu', sans-serif";
  const dateline = d.dateline.trim().replace(/[:：]+$/, '');

  return (
    <div
      className="pz-article"
      style={{
        fontSize: size,
        fontFamily,
        fontWeight: d.bodyFont === 'mandali' ? 400 : 500,
        columnCount: cols,
        columnRule: cols > 1 ? `3px solid ${t.ruleColor}` : undefined,
      }}
    >
      {paras.map((p, i) => (
        <p key={i} className={i === 0 ? 'first' : ''}>
          {i === 0 && dateline && (
            <span className="pz-dateline" style={{ color: t.datelineColor }}>
              {dateline}:{' '}
            </span>
          )}
          {p}
        </p>
      ))}
      {hasBox && (
        <div className="pz-box" style={{ background: t.boxBg, borderColor: t.boxBorder, color: t.boxTextColor }}>
          {d.boxTitle.trim() && (
            <div className="pz-box-title" style={{ color: t.boxTitleColor }}>
              {d.boxTitle.trim()}
              <span className="pz-box-bar" style={{ background: t.boxTitleColor }} />
            </div>
          )}
          {boxParas.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export const Poster = forwardRef<HTMLDivElement, { data: NewsData }>(function Poster({ data: d }, ref) {
  const t = getTheme(d.themeId, d.overrides);
  const layout = resolveLayout(d);
  const topPhotoH = Math.round(Math.min((POSTER_W - 28) / Math.max(d.photoAspect, 0.5), 660));

  return (
    <div ref={ref} className="pz" style={{ width: POSTER_W }}>
      <Header d={d} />
      {layout === 'side' ? (
        <div className="pz-top pz-top-side">
          <Photo d={d} t={t} />
          <div className="pz-top-right">
            <Headline d={d} t={t} wide={false} />
            <SubHead d={d} t={t} />
          </div>
        </div>
      ) : (
        <div className="pz-top pz-top-wide">
          <Headline d={d} t={t} wide />
          {layout === 'top' && <Photo d={d} t={t} height={topPhotoH} />}
          <SubHead d={d} t={t} />
        </div>
      )}
      <Article d={d} t={t} />
    </div>
  );
});
