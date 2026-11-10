export type HeadBg = 'brush' | 'band' | 'ribbon' | 'gradient' | 'none';
export type Layout = 'auto' | 'side' | 'top' | 'none';
export type DateFormat = 'telugu' | 'weekday' | 'numeric';
export type HeadFont = 'noto' | 'ramabhadra';
export type BodyFont = 'noto' | 'mandali';

export interface Theme {
  id: string;
  name: string;
  hint: string;
  emoji: string;
  headBg: HeadBg;
  headBgColor: string;
  headBgColor2: string;
  line1Color: string;
  line1Stroke: string | null;
  line2Color: string;
  line2Stroke: string | null;
  subBg: string;
  subColor: string;
  datelineColor: string;
  ruleColor: string;
  boxBg: string;
  boxBorder: string;
  boxTitleColor: string;
  boxTextColor: string;
  photoBorder: string;
}

export interface ThemeOverrides {
  headBg?: HeadBg;
  headBgColor?: string;
  line1Color?: string;
  line2Color?: string;
  subBg?: string;
}

export interface NewsData {
  date: string; // yyyy-mm-dd
  edition: string;
  dateFormat: DateFormat;
  line1: string;
  line2: string;
  sub: string;
  photo: string | null;
  photoAspect: number;
  photoZoom: number;
  photoX: number;
  photoY: number;
  layout: Layout;
  dateline: string;
  body: string;
  boxTitle: string;
  boxText: string;
  themeId: string;
  overrides: ThemeOverrides;
  headFont: HeadFont;
  bodyFont: BodyFont;
  headScale: number; // 0.7 – 1.3
  bodyScale: number; // 0.75 – 1.3
}
