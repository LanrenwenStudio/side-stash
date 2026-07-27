import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'wxt';

function syncLocalesToPublic() {
  const sourceRoot = join(process.cwd(), 'locales');
  const targetRoot = join(process.cwd(), 'public', '_locales');

  if (!existsSync(sourceRoot)) {
    return;
  }

  try {
    mkdirSync(targetRoot, { recursive: true });
    cpSync(sourceRoot, targetRoot, { recursive: true, force: true });
  } catch {
    // Ignore transient file lock during dev server watch cycles
  }
}

syncLocalesToPublic();

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  webExt: {
    startUrls: ['https://zh.wikipedia.org/wiki/Wikipedia:%E9%A6%96%E9%A1%B5'],
  },
  hooks: {
    'build:before': () => {
      syncLocalesToPublic();
    },
  },
  manifest: {
    name: '__MSG_extName__',
    description: '__MSG_extDescription__',
    default_locale: 'en',
    version: '0.1.6',
    permissions: ['contextMenus', 'storage', 'tabs', 'downloads'],
    host_permissions: ['<all_urls>'],
    icons: {
      16: '/icon-16.png',
      24: '/icon-24.png',
      32: '/icon-32.png',
      48: '/icon-48.png',
      128: '/icon-128.png',
    },
    action: {
      default_title: '__MSG_extName__',
      default_icon: {
        16: '/icon-16.png',
        24: '/icon-24.png',
        32: '/icon-32.png',
        48: '/icon-48.png',
        128: '/icon-128.png',
      },
    },
    commands: {
      'save-selection': {
        suggested_key: {
          default: 'Alt+S',
          mac: 'Alt+S',
        },
        description: '__MSG_commandSaveSelection__',
      },
    },
  },
});
