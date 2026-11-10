import type { NewsData } from './types';
import { todayISO } from './lib/date';

export const EMPTY: NewsData = {
  date: todayISO(),
  edition: 'హైదరాబాద్',
  dateFormat: 'telugu',
  line1: '',
  line2: '',
  sub: '',
  photo: null,
  photoAspect: 0.85,
  photoZoom: 1,
  photoX: 50,
  photoY: 35,
  layout: 'auto',
  dateline: '',
  body: '',
  boxTitle: '',
  boxText: '',
  themeId: 'tragedy',
  overrides: {},
  headFont: 'noto',
  bodyFont: 'noto',
  headScale: 1,
  bodyScale: 1,
};

/** Demo content (names are placeholders) so the user can see how a finished card looks. */
export const SAMPLE: Partial<NewsData> = {
  line1: 'సిద్దిపేట జిల్లాలో',
  line2: 'వివాహిత సూసైడ్',
  sub: 'కుటుంబ కలహాలతో మనస్తాపం చెందిన వివాహిత\nఉరివేసుకుని ఆత్మహత్యకు పాల్పడింది',
  dateline: 'దుబ్బాక',
  body:
    'సిద్దిపేట జిల్లాలో వివాహిత ఆత్మహత్య చేసుకున్న సంఘటన కలకలం రేపింది. కుటుంబ కలహాలతో మనస్తాపం చెందిన వివాహిత ఉరివేసుకుని సూసైడ్ చేసుకుంది.\n' +
    'దుబ్బాక ఎస్సై తెలిపిన వివరాల ప్రకారం.. కామారెడ్డి జిల్లాకు చెందిన ఓ యువతి (26)కి దుబ్బాక పట్టణానికి చెందిన యువకుడితో 2024 నవంబర్‌లో వివాహం జరిగింది.\n' +
    'అయితే కొంతకాలంగా కుటుంబంలో తరచుగా గొడవలు జరుగుతుండగా, మనస్తాపం చెంది సోమవారం రాత్రి ఉరివేసుకుని సూసైడ్ చేసుకుందని తెలిపారు.',
  boxTitle: 'దుబ్బాక ఎస్సై వివరాలు వెల్లడించారు..',
  boxText: 'కుటుంబ కలహాలే ఆత్మహత్యకు కారణమని పోలీసులు ప్రాథమికంగా అనుమానిస్తున్నారు.',
  themeId: 'tragedy',
  overrides: {},
};

const KEY = 'akn-draft-v1';

export function loadDraft(): NewsData {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const saved = JSON.parse(raw) as Partial<NewsData>;
      // the card always carries the day it is created on
      return { ...EMPTY, ...saved, date: todayISO() };
    }
  } catch {
    /* storage unavailable */
  }
  return { ...EMPTY, date: todayISO() };
}

export function saveDraft(d: NewsData) {
  try {
    localStorage.setItem(KEY, JSON.stringify(d));
  } catch {
    // probably the photo is too large for storage — save without it
    try {
      localStorage.setItem(KEY, JSON.stringify({ ...d, photo: null }));
    } catch {
      /* ignore */
    }
  }
}
