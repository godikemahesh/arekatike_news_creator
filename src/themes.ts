import type { Theme, ThemeOverrides } from './types';

export const THEMES: Theme[] = [
  {
    id: 'tragedy',
    name: 'విషాదం / నేరం',
    hint: 'ఆత్మహత్య, హత్య, మృతి, నేరాలు',
    emoji: '🖤',
    headBg: 'brush',
    headBgColor: '#e3151b',
    headBgColor2: '#a50d12',
    line1Color: '#ffffff',
    line1Stroke: '#1b1b1b',
    line2Color: '#ffe600',
    line2Stroke: '#141414',
    subBg: '#1f3a93',
    subColor: '#ffffff',
    datelineColor: '#e0168a',
    ruleColor: '#222222',
    boxBg: '#fcf0d4',
    boxBorder: '#f3dca6',
    boxTitleColor: '#b3121a',
    boxTextColor: '#141414',
    photoBorder: '#d4598a',
  },
  {
    id: 'alert',
    name: 'ప్రమాదం / హెచ్చరిక',
    hint: 'రోడ్డు ప్రమాదం, వర్షం, వరద, అలర్ట్',
    emoji: '⚠️',
    headBg: 'brush',
    headBgColor: '#ff7a00',
    headBgColor2: '#c25400',
    line1Color: '#ffffff',
    line1Stroke: '#111111',
    line2Color: '#111111',
    line2Stroke: '#ffe94d',
    subBg: '#141414',
    subColor: '#ffe94d',
    datelineColor: '#e65100',
    ruleColor: '#222222',
    boxBg: '#fff1df',
    boxBorder: '#ffcf99',
    boxTitleColor: '#d84300',
    boxTextColor: '#141414',
    photoBorder: '#ff7a00',
  },
  {
    id: 'good',
    name: 'శుభవార్త / విజయం',
    hint: 'అభినందనలు, ర్యాంకులు, అవార్డులు',
    emoji: '🎉',
    headBg: 'ribbon',
    headBgColor: '#0f8a3c',
    headBgColor2: '#20b956',
    line1Color: '#ffffff',
    line1Stroke: '#0a3d1c',
    line2Color: '#fff35c',
    line2Stroke: '#0a3d1c',
    subBg: '#0b5d2a',
    subColor: '#ffffff',
    datelineColor: '#0f8a3c',
    ruleColor: '#1d4d2c',
    boxBg: '#e7f6eb',
    boxBorder: '#b9e3c5',
    boxTitleColor: '#0b5d2a',
    boxTextColor: '#141414',
    photoBorder: '#20b956',
  },
  {
    id: 'festival',
    name: 'పండుగ / వేడుక',
    hint: 'జాతర, ఉత్సవాలు, శుభాకాంక్షలు',
    emoji: '🪔',
    headBg: 'gradient',
    headBgColor: '#ff8a00',
    headBgColor2: '#ffd000',
    line1Color: '#7a0019',
    line1Stroke: '#ffffff',
    line2Color: '#7a0019',
    line2Stroke: '#ffffff',
    subBg: '#7a0019',
    subColor: '#ffe9a8',
    datelineColor: '#c2410c',
    ruleColor: '#7a0019',
    boxBg: '#fff3dc',
    boxBorder: '#ffd38a',
    boxTitleColor: '#9c0024',
    boxTextColor: '#141414',
    photoBorder: '#ff9800',
  },
  {
    id: 'politics',
    name: 'రాజకీయం / ప్రభుత్వం',
    hint: 'మంత్రులు, ఎన్నికలు, పథకాలు, సభలు',
    emoji: '🏛️',
    headBg: 'band',
    headBgColor: '#0d47a1',
    headBgColor2: '#082d66',
    line1Color: '#ffffff',
    line1Stroke: null,
    line2Color: '#ffd54f',
    line2Stroke: '#061d44',
    subBg: '#ffffff',
    subColor: '#0d47a1',
    datelineColor: '#1565c0',
    ruleColor: '#0d47a1',
    boxBg: '#e8f0fe',
    boxBorder: '#b8cdf5',
    boxTitleColor: '#0d47a1',
    boxTextColor: '#141414',
    photoBorder: '#0d47a1',
  },
  {
    id: 'education',
    name: 'విద్య / క్రీడలు',
    hint: 'పాఠశాలలు, ఫలితాలు, టోర్నమెంట్లు',
    emoji: '🏆',
    headBg: 'ribbon',
    headBgColor: '#5b1a9e',
    headBgColor2: '#8e3ad6',
    line1Color: '#ffffff',
    line1Stroke: '#2a0a4d',
    line2Color: '#ffeb3b',
    line2Stroke: '#2a0a4d',
    subBg: '#3d0f70',
    subColor: '#ffffff',
    datelineColor: '#7b1fa2',
    ruleColor: '#3d0f70',
    boxBg: '#f3e9fc',
    boxBorder: '#dcc4f3',
    boxTitleColor: '#5b1a9e',
    boxTextColor: '#141414',
    photoBorder: '#8e3ad6',
  },
  {
    id: 'obituary',
    name: 'సంతాపం / నివాళి',
    hint: 'కన్నుమూత, శ్రద్ధాంజలి, వర్ధంతి',
    emoji: '🕯️',
    headBg: 'none',
    headBgColor: '#2b2b2b',
    headBgColor2: '#000000',
    line1Color: '#3a3a3a',
    line1Stroke: null,
    line2Color: '#000000',
    line2Stroke: null,
    subBg: '#3d3d3d',
    subColor: '#ffffff',
    datelineColor: '#444444',
    ruleColor: '#444444',
    boxBg: '#f1f1f1',
    boxBorder: '#d6d6d6',
    boxTitleColor: '#1b1b1b',
    boxTextColor: '#1b1b1b',
    photoBorder: '#111111',
  },
  {
    id: 'neutral',
    name: 'సాధారణ వార్త',
    hint: 'బ్యాక్‌గ్రౌండ్ లేకుండా సింపుల్‌గా',
    emoji: '📰',
    headBg: 'none',
    headBgColor: '#1f3a93',
    headBgColor2: '#c62828',
    line1Color: '#1f3a93',
    line1Stroke: null,
    line2Color: '#c62828',
    line2Stroke: null,
    subBg: '#eef2fb',
    subColor: '#1f3a93',
    datelineColor: '#c62828',
    ruleColor: '#333333',
    boxBg: '#f6f6f6',
    boxBorder: '#dddddd',
    boxTitleColor: '#c62828',
    boxTextColor: '#141414',
    photoBorder: '#1f3a93',
  },
];

export function getTheme(id: string, o: ThemeOverrides = {}): Theme {
  const base = THEMES.find((t) => t.id === id) ?? THEMES[0];
  const t: Theme = { ...base };
  if (o.headBg) t.headBg = o.headBg;
  if (o.headBgColor) {
    t.headBgColor = o.headBgColor;
    t.headBgColor2 = shade(o.headBgColor, -0.25);
  }
  if (o.line1Color) t.line1Color = o.line1Color;
  if (o.line2Color) t.line2Color = o.line2Color;
  if (o.subBg) {
    t.subBg = o.subBg;
    t.subColor = isLight(o.subBg) ? '#111111' : '#ffffff';
  }
  // With no background, outlines look heavy — keep text clean.
  if (t.headBg === 'none') {
    t.line1Stroke = null;
    t.line2Stroke = null;
    if (isLight(t.line1Color)) t.line1Color = '#1f1f1f';
    if (isLight(t.line2Color)) t.line2Color = '#c62828';
  }
  return t;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function isLight(hex: string): boolean {
  const [r, g, b] = hexToRgb(hex);
  return (r * 299 + g * 587 + b * 114) / 1000 > 160;
}

export function shade(hex: string, amt: number): string {
  const [r, g, b] = hexToRgb(hex);
  const f = (c: number) => Math.max(0, Math.min(255, Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt)));
  return '#' + [f(r), f(g), f(b)].map((c) => c.toString(16).padStart(2, '0')).join('');
}

/* ---- Rule-based mood suggestion (no AI): keyword matching ---- */
const KEYWORDS: Record<string, string[]> = {
  tragedy: ['ఆత్మహత్య', 'సూసైడ్', 'హత్య', 'మృతి', 'మృతదేహ', 'దారుణ', 'అత్యాచార', 'దాడి', 'కిడ్నాప్', 'అరెస్ట్', 'దొంగతన', 'చోరీ', 'నేర', 'మోసం', 'విషాద', 'ఉరి', 'గొడవ', 'కలహ'],
  alert: ['ప్రమాద', 'అగ్నిప్రమాద', 'హెచ్చరిక', 'వర్షం', 'వర్షాలు', 'వరద', 'తుఫాను', 'అలర్ట్', 'జాగ్రత్త', 'ఢీ', 'బోల్తా', 'పిడుగు'],
  good: ['అభినందన', 'విజయ', 'విజేత', 'ఎంపిక', 'ర్యాంక్', 'సన్మాన', 'శుభవార్త', 'ప్రశంస', 'అవార్డు', 'పురస్కార', 'గెలుపు', 'ఉద్యోగ', 'ఘనత'],
  festival: ['పండుగ', 'జాతర', 'వేడుక', 'ఉత్సవ', 'శుభాకాంక్ష', 'బతుకమ్మ', 'దసరా', 'దీపావళి', 'సంక్రాంతి', 'ఉగాది', 'కళ్యాణ', 'బ్రహ్మోత్సవ', 'జయంతి', 'బోనాలు'],
  politics: ['ఎమ్మెల్యే', 'మంత్రి', 'ముఖ్యమంత్రి', 'ప్రభుత్వ', 'ఎన్నిక', 'పార్టీ', 'కలెక్టర్', 'సర్పంచ్', 'ఎంపీ', 'కాంగ్రెస్', 'బీఆర్ఎస్', 'బీజేపీ', 'పథక', 'సభ', 'ధర్నా'],
  education: ['విద్య', 'పాఠశాల', 'కళాశాల', 'పరీక్ష', 'ఫలితా', 'క్రీడ', 'క్రికెట్', 'టోర్నమెంట్', 'విద్యార్థ', 'కబడ్డీ', 'పోటీ'],
  obituary: ['సంతాప', 'నివాళి', 'కన్నుమూ', 'అస్తమయ', 'శ్రద్ధాంజలి', 'వర్ధంతి'],
};

export function suggestTheme(heading: string, rest: string): string | null {
  let best: string | null = null;
  let bestScore = 0;
  for (const [id, words] of Object.entries(KEYWORDS)) {
    let s = 0;
    for (const w of words) {
      if (heading.includes(w)) s += 3;
      if (rest.includes(w)) s += 1;
    }
    if (s > bestScore) {
      bestScore = s;
      best = id;
    }
  }
  return bestScore >= 2 ? best : null;
}
