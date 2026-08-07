export type SavedItem = {
  id: string;
  type: 'text' | 'link' | 'image';
  content: string;
  linkUrl?: string;
  imageUrl?: string;
  imageAlt?: string;
  pageTitle?: string;
  pageUrl?: string;
  createdAt?: string;
  pinned?: boolean;
};

export type ItemFilter = SavedItem['type'] | 'all';
export type DateFilter = 'all' | 'today' | 'yesterday' | 'week';
export type CopyFormat = 'plain' | 'markdown' | 'source';
export type ThemeMode = 'system' | 'light' | 'dark';

export type PanelPreferences = {
  copyFormat: CopyFormat;
  /** When true, open the side panel after a successful save from the page. */
  openPanelOnSave: boolean;
  themeMode: ThemeMode;
};

