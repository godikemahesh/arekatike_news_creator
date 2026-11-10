import { ReactNode, useMemo, useRef, useState } from 'react';
import type { HeadBg, NewsData, ThemeOverrides } from '../types';
import { THEMES, getTheme, suggestTheme } from '../themes';
import { loadPhoto } from '../lib/image';
import { todayISO } from '../lib/date';
import type { ExportFormat } from '../lib/export';

type Set = <K extends keyof NewsData>(k: K, v: NewsData[K]) => void;

interface Props {
  data: NewsData;
  set: Set;
  patch: (p: Partial<NewsData>) => void;
  onSample: () => void;
  onClear: () => void;
  format: ExportFormat;
  setFormat: (f: ExportFormat) => void;
  toast: (m: string) => void;
}

function Card({ n, icon, title, sub, children, optional }: { n: number; icon: string; title: string; sub?: string; children: ReactNode; optional?: boolean }) {
  return (
    <section className="card">
      <header className="card-h">
        <span className="card-n">{n}</span>
        <div>
          <h2>
            {icon} {title} {optional && <em className="opt">ఐచ్ఛికం</em>}
          </h2>
          {sub && <p className="card-sub">{sub}</p>}
        </div>
      </header>
      {children}
    </section>
  );
}

function Seg<T extends string>({ value, options, onChange }: { value: T; options: { v: T; l: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="seg" role="radiogroup">
      {options.map((o) => (
        <button key={o.v} type="button" role="radio" aria-checked={value === o.v} className={value === o.v ? 'on' : ''} onClick={() => onChange(o.v)}>
          {o.l}
        </button>
      ))}
    </div>
  );
}

function Field({ label, hint, children, count }: { label: string; hint?: string; children: ReactNode; count?: number }) {
  return (
    <label className="field">
      <span className="field-l">
        {label}
        {count !== undefined && <span className="count">{count} అక్షరాలు</span>}
      </span>
      {children}
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}

function Range({ label, value, min, max, step, onChange, fmt }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; fmt?: (v: number) => string }) {
  return (
    <div className="range">
      <div className="range-l">
        <span>{label}</span>
        <b>{fmt ? fmt(value) : value}</b>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}

export function Editor({ data: d, set, patch, onSample, onClear, format, setFormat, toast }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const suggestion = useMemo(
    () => suggestTheme(`${d.line1} ${d.line2}`, `${d.sub} ${d.body} ${d.boxTitle}`),
    [d.line1, d.line2, d.sub, d.body, d.boxTitle],
  );
  const suggested = suggestion && suggestion !== d.themeId ? THEMES.find((t) => t.id === suggestion) : null;
  const active = getTheme(d.themeId, d.overrides);

  const setOv = (o: ThemeOverrides) => set('overrides', { ...d.overrides, ...o });

  async function onFile(f: File | undefined) {
    if (!f) return;
    if (!f.type.startsWith('image/')) return toast('దయచేసి ఫోటో ఫైల్ ఎంచుకోండి');
    setLoading(true);
    try {
      const { url, aspect } = await loadPhoto(f);
      patch({ photo: url, photoAspect: aspect, photoZoom: 1, photoX: 50, photoY: aspect > 1.2 ? 50 : 35 });
    } catch {
      toast('ఫోటో లోడ్ కాలేదు, మళ్ళీ ప్రయత్నించండి');
    } finally {
      setLoading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <div className="editor">
      <div className="quick">
        <button type="button" className="btn ghost" onClick={onSample}>
          📄 నమూనా వార్త చూపించు
        </button>
        <button type="button" className="btn ghost danger" onClick={onClear}>
          🧹 కొత్త వార్త
        </button>
      </div>

      <Card n={1} icon="📰" title="హెడ్డింగ్" sub="రెండు లైన్లుగా రాయండి — రెండో లైన్ పెద్దగా వస్తుంది">
        <Field label="హెడ్డింగ్ లైన్ 1 (చిన్నది)">
          <input value={d.line1} onChange={(e) => set('line1', e.target.value)} placeholder="ఉదా: సిద్దిపేట జిల్లాలో" />
        </Field>
        <Field label="హెడ్డింగ్ లైన్ 2 (పెద్దది) *">
          <input value={d.line2} onChange={(e) => set('line2', e.target.value)} placeholder="ఉదా: వివాహిత సూసైడ్" className="big" />
        </Field>
        <Field label="సబ్ హెడ్డింగ్" hint="లైన్ మార్చాలంటే Enter నొక్కండి" count={d.sub.length}>
          <textarea rows={3} value={d.sub} onChange={(e) => set('sub', e.target.value)} placeholder="ఉదా: కుటుంబ కలహాలతో మనస్తాపం చెందిన వివాహిత ఆత్మహత్య" />
        </Field>
      </Card>

      <Card n={2} icon="🎨" title="వార్త మూడ్ / థీమ్" sub="వార్తకు తగ్గ రంగులు, హెడ్డింగ్ స్టైల్ ఎంచుకోండి">
        {suggested && (
          <button type="button" className="suggest" onClick={() => patch({ themeId: suggested.id, overrides: {} })}>
            <span>💡 సూచన:</span> ఈ వార్తకు <b>{suggested.emoji} {suggested.name}</b> థీమ్ బాగుంటుంది — <u>మార్చు</u>
          </button>
        )}
        <div className="themes">
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`theme ${d.themeId === t.id ? 'on' : ''}`}
              onClick={() => patch({ themeId: t.id, overrides: {} })}
              aria-pressed={d.themeId === t.id}
            >
              <ThemeSwatch id={t.id} />
              <span className="theme-name">
                {t.emoji} {t.name}
              </span>
              <span className="theme-hint">{t.hint}</span>
            </button>
          ))}
        </div>

        <details className="more">
          <summary>🖌️ రంగులు మీరే మార్చుకోండి</summary>
          <div className="more-body">
            <span className="field-l">హెడ్డింగ్ బ్యాక్‌గ్రౌండ్</span>
            <Seg<HeadBg>
              value={active.headBg}
              onChange={(v) => setOv({ headBg: v })}
              options={[
                { v: 'brush', l: 'బ్రష్' },
                { v: 'band', l: 'పట్టీ' },
                { v: 'ribbon', l: 'రిబ్బన్' },
                { v: 'gradient', l: 'గ్రేడియంట్' },
                { v: 'none', l: 'లేదు' },
              ]}
            />
            <div className="colors">
              <ColorPick label="బ్యాక్‌గ్రౌండ్" value={active.headBgColor} onChange={(c) => setOv({ headBgColor: c })} disabled={active.headBg === 'none'} />
              <ColorPick label="లైన్ 1" value={active.line1Color} onChange={(c) => setOv({ line1Color: c })} />
              <ColorPick label="లైన్ 2" value={active.line2Color} onChange={(c) => setOv({ line2Color: c })} />
              <ColorPick label="సబ్ బాక్స్" value={active.subBg} onChange={(c) => setOv({ subBg: c })} />
            </div>
            {Object.keys(d.overrides).length > 0 && (
              <button type="button" className="btn ghost small" onClick={() => set('overrides', {})}>
                ↺ థీమ్ అసలు రంగులు
              </button>
            )}
          </div>
        </details>
      </Card>

      <Card n={3} icon="📷" title="సంఘటన ఫోటో" optional>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => onFile(e.target.files?.[0])} />
        {!d.photo ? (
          <button
            type="button"
            className="drop"
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              onFile(e.dataTransfer.files?.[0]);
            }}
          >
            <span className="drop-i">{loading ? '⏳' : '🖼️'}</span>
            <b>{loading ? 'లోడ్ అవుతోంది…' : 'ఫోటో ఎంచుకోండి'}</b>
            <small>గ్యాలరీ లేదా కెమెరా నుండి · ఫోటో లేకపోయినా కార్డు తయారవుతుంది</small>
          </button>
        ) : (
          <>
            <div className="photo-row">
              <img src={d.photo} alt="" className="thumb" />
              <div className="photo-btns">
                <button type="button" className="btn ghost small" onClick={() => fileRef.current?.click()}>
                  🔄 మార్చు
                </button>
                <button type="button" className="btn ghost small danger" onClick={() => patch({ photo: null })}>
                  🗑️ తీసివేయి
                </button>
              </div>
            </div>
            <span className="field-l">ఫోటో ఎక్కడ ఉండాలి?</span>
            <Seg
              value={d.layout === 'none' ? 'auto' : d.layout}
              onChange={(v) => set('layout', v)}
              options={[
                { v: 'auto', l: 'ఆటో' },
                { v: 'side', l: 'ఎడమ వైపు' },
                { v: 'top', l: 'హెడ్డింగ్ కింద' },
              ]}
            />
            <Range label="జూమ్" value={d.photoZoom} min={1} max={2.5} step={0.05} onChange={(v) => set('photoZoom', v)} fmt={(v) => `${v.toFixed(1)}x`} />
            <Range label="అడ్డంగా జరుపు ↔" value={d.photoX} min={0} max={100} step={1} onChange={(v) => set('photoX', v)} fmt={(v) => `${v}%`} />
            <Range label="నిలువుగా జరుపు ↕" value={d.photoY} min={0} max={100} step={1} onChange={(v) => set('photoY', v)} fmt={(v) => `${v}%`} />
          </>
        )}
      </Card>

      <Card n={4} icon="✍️" title="వార్త వివరాలు">
        <Field label="ప్రాంతం (డేట్‌లైన్)" hint="వార్త మొదట్లో రంగులో వస్తుంది — ఉదా: దుబ్బాక:">
          <input value={d.dateline} onChange={(e) => set('dateline', e.target.value)} placeholder="ఉదా: దుబ్బాక" />
        </Field>
        <Field label="వార్త మేటర్ *" hint="కొత్త పేరా కోసం Enter నొక్కండి · పెద్ద వార్త అయితే అక్షరాలు ఆటోమేటిక్‌గా చిన్నవవుతాయి" count={d.body.length}>
          <textarea rows={10} value={d.body} onChange={(e) => set('body', e.target.value)} placeholder="వార్త పూర్తి వివరాలు ఇక్కడ టైప్ / పేస్ట్ చేయండి…" />
        </Field>
      </Card>

      <Card n={5} icon="💡" title="హైలైట్ బాక్స్" sub="వార్త చివర రంగు బాక్స్‌లో ముఖ్యమైన విషయం" optional>
        <Field label="బాక్స్ టైటిల్">
          <input value={d.boxTitle} onChange={(e) => set('boxTitle', e.target.value)} placeholder="ఉదా: ఎస్సై వివరాలు వెల్లడించారు.." />
        </Field>
        <Field label="బాక్స్ మేటర్">
          <textarea rows={3} value={d.boxText} onChange={(e) => set('boxText', e.target.value)} placeholder="ఉదా: కుటుంబ కలహాలే కారణమని పోలీసులు అనుమానిస్తున్నారు." />
        </Field>
      </Card>

      <Card n={6} icon="📅" title="తేదీ & ఎడిషన్" sub="హెడర్‌లో ఆకుపచ్చ పట్టీపై కనిపిస్తుంది">
        <div className="row2">
          <Field label="తేదీ">
            <input type="date" value={d.date} onChange={(e) => set('date', e.target.value || todayISO())} />
          </Field>
          <Field label="ఎడిషన్ / ఊరు">
            <input value={d.edition} onChange={(e) => set('edition', e.target.value)} placeholder="హైదరాబాద్" />
          </Field>
        </div>
        <span className="field-l">తేదీ ఎలా కనిపించాలి?</span>
        <Seg
          value={d.dateFormat}
          onChange={(v) => set('dateFormat', v)}
          options={[
            { v: 'telugu', l: '10 నవంబర్' },
            { v: 'weekday', l: 'వారంతో' },
            { v: 'numeric', l: '10-11-2026' },
          ]}
        />
      </Card>

      <Card n={7} icon="🔤" title="అక్షరాలు & సైజు">
        <span className="field-l">హెడ్డింగ్ ఫాంట్</span>
        <Seg
          value={d.headFont}
          onChange={(v) => set('headFont', v)}
          options={[
            { v: 'noto', l: 'బోల్డ్ (నోటో)' },
            { v: 'ramabhadra', l: 'రామభద్ర' },
          ]}
        />
        <span className="field-l">వార్త ఫాంట్</span>
        <Seg
          value={d.bodyFont}
          onChange={(v) => set('bodyFont', v)}
          options={[
            { v: 'noto', l: 'నోటో సాన్స్' },
            { v: 'mandali', l: 'మండలి' },
          ]}
        />
        <Range label="హెడ్డింగ్ సైజు" value={d.headScale} min={0.7} max={1.3} step={0.05} onChange={(v) => set('headScale', v)} fmt={(v) => `${Math.round(v * 100)}%`} />
        <Range label="వార్త అక్షరాల సైజు" value={d.bodyScale} min={0.75} max={1.3} step={0.05} onChange={(v) => set('bodyScale', v)} fmt={(v) => `${Math.round(v * 100)}%`} />
        <span className="field-l">డౌన్‌లోడ్ ఫార్మాట్</span>
        <Seg<ExportFormat>
          value={format}
          onChange={setFormat}
          options={[
            { v: 'jpg', l: 'JPG (వాట్సాప్‌కి)' },
            { v: 'png', l: 'PNG (హై క్వాలిటీ)' },
          ]}
        />
      </Card>
      <p className="foot">ఆరెకటికె చైతన్యం · డిజిటల్ దినపత్రిక — సమాజం కోసం… సత్యం కోసం…</p>
    </div>
  );
}

function ColorPick({ label, value, onChange, disabled }: { label: string; value: string; onChange: (c: string) => void; disabled?: boolean }) {
  return (
    <label className={`color ${disabled ? 'dis' : ''}`}>
      <input type="color" value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)} />
      <span>{label}</span>
    </label>
  );
}

function ThemeSwatch({ id }: { id: string }) {
  const t = getTheme(id);
  const bg =
    t.headBg === 'none'
      ? '#ffffff'
      : t.headBg === 'gradient'
        ? `linear-gradient(120deg, ${t.headBgColor}, ${t.headBgColor2})`
        : t.headBg === 'ribbon'
          ? `linear-gradient(90deg, ${t.headBgColor2}, ${t.headBgColor}, ${t.headBgColor2})`
          : t.headBgColor;
  const stroke = (c: string | null) => (c ? `-1px -1px 0 ${c}, 1px -1px 0 ${c}, -1px 1px 0 ${c}, 1px 1px 0 ${c}` : undefined);
  return (
    <span className="swatch">
      <span className={`swatch-head ${t.headBg}`} style={{ background: bg }}>
        <span style={{ color: t.line1Color, textShadow: stroke(t.line1Stroke), fontSize: 11 }}>వార్త</span>
        <span style={{ color: t.line2Color, textShadow: stroke(t.line2Stroke) }}>హెడ్డింగ్</span>
      </span>
      <span className="swatch-sub" style={{ background: t.subBg, borderColor: t.subColor }} />
    </span>
  );
}
