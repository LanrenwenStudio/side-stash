import React from 'react';
import { Heart } from 'lucide-react';
import { ChromeIcon, GithubIcon } from './BrandIcons';

type FooterProps = {
  lang: 'zh' | 'en';
};

export function Footer({ lang }: FooterProps) {
  const isZh = lang === 'zh';

  return (
    <footer className="border-t border-zinc-200 bg-white py-12 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <img src="/icon-128.png" alt="Side Stash" className="size-7 rounded-lg" />
            <span className="text-sm font-bold text-zinc-900 dark:text-white">Side Stash</span>
            <span className="text-xs text-zinc-500 font-mono">v0.1.7</span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium">
            <a
              href="https://chromewebstore.google.com/detail/side-stash/khbkjkjokbmldbaelpknjbfoecdkehbk"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 transition-colors hover:text-zinc-900 dark:hover:text-white"
            >
              <ChromeIcon className="size-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Chrome Web Store</span>
            </a>
            <a
              href="https://github.com/LanrenwenStudio/side-stash"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 transition-colors hover:text-zinc-900 dark:hover:text-white"
            >
              <GithubIcon className="size-3.5" />
              <span>GitHub Repository</span>
            </a>
          </div>

          {/* Copyright */}
          <div className="text-xs text-zinc-500 text-center sm:text-right">
            <span>© {new Date().getFullYear()} LanrenwenStudio (烂人文工作室). MIT Licensed.</span>
          </div>

        </div>
      </div>
    </footer>
  );
}
