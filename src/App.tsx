import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { NewsData } from './types';
import { EMPTY, SAMPLE, loadDraft, saveDraft } from './defaults';
import { todayISO } from './lib/date';
import { Poster } from './components/Poster';
import { Editor } from './components/Editor';
import { ExportFormat, canShareFiles, downloadBlob, renderPoster, shareBlob } from './lib/export';

type Tab = 'edit' | 'preview';

function loadFormat(): ExportFormat {
  try {
    return localStorage.getItem('akn-format') === 'png' ? 'png' : 'jpg';
  } catch {
    return 'jpg';
  }
}

export default function App() {
  const [data, setData] = useState<NewsData>(loadDraft);
  const [tab, setTab] = useState<Tab>('edit');
  const [format, setFormatState] = useState<ExportFormat>(loadFormat);
  const [busy, setBusy] = useState<'' | 'download' | 'share'>('');
  const [msg, setMsg] = useState('');
  const posterRef = useRef<HTMLDivElement>(null);
  const cached = useRef<{ key: string; blob: Blob } | null>(null);
  const shareable = useRef(canShareFiles());

  const set = useCallback(<K extends keyof NewsData>(k: K, v: NewsData[K]) => setData((d) => ({ ...d, [k]: v })), []);
  const patch = useCallback((p: Partial<NewsData>) => setData((d) => ({ ...d, ...p })), []);

  useEffect(() => {
    const id = setTimeout(() => saveDraft(data), 400);
    return () => clearTimeout(id);
  }, [data]);

  const toastTimer = useRef<number>();
  const toast = useCallback((m: string) => {
    setMsg(m);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setMsg(''), 3200);
  }, []);

  const setFormat = (f: ExportFormat) => {
    setFormatState(f);
    try {
      localStorage.setItem('akn-format', f);
    } catch {
      /* ignore */
    }
  };

  function validate(): boolean {
    if (!data.line2.trim()) {
      toast('⚠️ ముందు హెడ్డింగ్ (లైన్ 2) రాయండి');
      setTab('edit');
      return false;
    }
    if (!data.body.trim()) {
      toast('⚠️ వార్త మేటర్ రాయండి');
      setTab('edit');
      return false;
    }
    return true;
  }

  async function getBlob(): Promise<Blob> {
    const key = JSON.stringify(data) + format;
    if (cached.current?.key === key) return cached.current.blob;
    const node = posterRef.current;
    if (!node) throw new Error('no poster');
    const blob = await renderPoster(node, format);
    cached.current = { key, blob };
    return blob;
  }

  async function onDownload() {
    if (!validate() || busy) return;
    setBusy('download');
    try {
      const blob = await getBlob();
      downloadBlob(blob, format);
      toast('✅ చిత్రం డౌన్‌లోడ్ అయింది');
    } catch (e) {
      console.error(e);
      toast('❌ చిత్రం తయారు కాలేదు, మళ్ళీ ప్రయత్నించండి');
    } finally {
      setBusy('');
    }
  }

  async function onShare() {
    if (!validate() || busy) return;
    setBusy('share');
    try {
      const blob = await getBlob();
      if (shareable.current) {
        try {
          await shareBlob(blob, format, data.line2);
        } catch (e) {
          const name = (e as Error)?.name;
          if (name === 'AbortError') return;
          if (name === 'NotAllowedError') {
            toast('✅ చిత్రం సిద్ధం — మళ్ళీ "షేర్" నొక్కండి');
            return;
          }
          throw e;
        }
      } else {
        downloadBlob(blob, format);
        toast('ఈ బ్రౌజర్‌లో షేర్ లేదు — చిత్రం డౌన్‌లోడ్ అయింది');
      }
    } catch (e) {
      console.error(e);
      toast('❌ షేర్ కాలేదు, డౌన్‌లోడ్ చేసి పంపండి');
    } finally {
      setBusy('');
    }
  }

  function onSample() {
    setData((d) => ({ ...d, ...SAMPLE }));
    toast('నమూనా వార్త నింపబడింది — ప్రివ్యూ చూడండి');
  }

  function onClear() {
    if (!window.confirm('ఇప్పటి వివరాలు అన్నీ తీసేసి కొత్త వార్త మొదలుపెట్టాలా?')) return;
    setData((d) => ({ ...EMPTY, date: todayISO(), edition: d.edition, dateFormat: d.dateFormat, headFont: d.headFont, bodyFont: d.bodyFont }));
    setTab('edit');
    window.scrollTo({ top: 0 });
  }

  return (
    <div className="app">
      <header className="appbar">
        <div className="brand">
          <span className="logo" aria-hidden>
            ఆ
          </span>
          <div>
            <h1>ఆరెకటికె న్యూస్ క్రియేటర్</h1>
            <p>వార్త ఇచ్చి · పేపర్ కార్డు తీసుకోండి</p>
          </div>
        </div>
        <nav className="tabs" role="tablist">
          <button role="tab" aria-selected={tab === 'edit'} className={tab === 'edit' ? 'on' : ''} onClick={() => setTab('edit')}>
            ✍️ వివరాలు
          </button>
          <button role="tab" aria-selected={tab === 'preview'} className={tab === 'preview' ? 'on' : ''} onClick={() => setTab('preview')}>
            👁️ ప్రివ్యూ
          </button>
        </nav>
      </header>

      <main className="layout">
        <div className={`pane pane-edit ${tab === 'edit' ? 'active' : ''}`}>
          <Editor data={data} set={set} patch={patch} onSample={onSample} onClear={onClear} format={format} setFormat={setFormat} toast={toast} />
        </div>
        <div className={`pane pane-preview ${tab === 'preview' ? 'active' : ''}`}>
          <div className="preview-h">
            <span>ప్రివ్యూ</span>
            <small>డౌన్‌లోడ్ చేస్తే ఇదే చిత్రం వస్తుంది</small>
          </div>
          <ScaledPreview>
            <Poster ref={posterRef} data={data} />
          </ScaledPreview>
        </div>
      </main>

      <div className="actionbar">
        {tab === 'edit' && (
          <button className="btn outline only-mobile" onClick={() => { setTab('preview'); window.scrollTo({ top: 0 }); }}>
            👁️ ప్రివ్యూ
          </button>
        )}
        <button className="btn primary" onClick={onDownload} disabled={!!busy}>
          {busy === 'download' ? <Spinner /> : '📥'} డౌన్‌లోడ్
        </button>
        <button className="btn share" onClick={onShare} disabled={!!busy}>
          {busy === 'share' ? <Spinner /> : '📤'} షేర్
        </button>
      </div>

      <div className={`toast ${msg ? 'show' : ''}`} role="status" aria-live="polite">
        {msg}
      </div>
    </div>
  );
}

function Spinner() {
  return <span className="spin" aria-hidden />;
}

/** Shows the 1200px poster scaled to the available width (the poster itself stays full size for export). */
function ScaledPreview({ children }: { children: React.ReactNode }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.3);
  const [h, setH] = useState(0);

  useLayoutEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    const update = () => {
      const w = o.clientWidth;
      if (w > 0) setScale(Math.min(1, w / 1200));
      setH(i.offsetHeight);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(o);
    ro.observe(i);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={outer} className="scaled" style={{ height: h * scale }}>
      <div ref={inner} className="scaled-inner" style={{ transform: `scale(${scale})` }}>
        {children}
      </div>
    </div>
  );
}
