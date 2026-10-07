import { resolve } from 'node:path';
import { createServer, type Plugin, type ViteDevServer } from 'vite';
import { SITE_LOCALES, type SiteLocale } from './src/i18n';
import { TRUST } from './src/trust';

const origin = 'https://sidestash.lanrenwen.com';

export function localizedPages(): Plugin {
  let devServer: ViteDevServer | undefined;
  return {
    name: 'side-stash-localized-pages',
    configureServer(server) { devServer = server; },
    transformIndexHtml: {
      order: 'pre',
      async handler(html, context) {
        const segment = context.path.split('/')[1];
        const lang: SiteLocale = Object.hasOwn(SITE_LOCALES, segment) ? segment as SiteLocale : 'en';
        const locale = SITE_LOCALES[lang];
        const server = devServer ?? await createServer({ configFile: false, root: resolve(import.meta.dirname), server: { middlewareMode: true }, appType: 'custom' });
        try {
          const { renderPage } = await server.ssrLoadModule('/src/render.tsx');
          const body = await renderPage(lang);
          const { title, description } = locale;
          const url = lang === 'en' ? `${origin}/` : `${origin}/${lang}/`;
          const publisher = { '@type': 'Organization', '@id': `${origin}/#publisher`, name: 'LanrenwenStudio', url: 'https://lanrenwen.com/', sameAs: ['https://github.com/LanrenwenStudio'], contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', email: 'support@lanrenwen.com' } };
          const schema = JSON.stringify({ '@context': 'https://schema.org', '@graph': [
            publisher,
            { '@type': 'SoftwareApplication', '@id': `${origin}/#app`, name: 'Side Stash', url, inLanguage: locale.htmlLang, description, applicationCategory: 'ProductivityApplication', operatingSystem: 'Chrome', author: { '@id': publisher['@id'] }, publisher: { '@id': publisher['@id'] }, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
            { '@type': 'WebPage', '@id': `${url}#page`, url, name: title, inLanguage: locale.htmlLang, dateModified: '2026-10-06', author: { '@id': publisher['@id'] }, publisher: { '@id': publisher['@id'] }, about: { '@id': `${origin}/#app` } },
            { '@type': 'FAQPage', '@id': `${url}#faq`, inLanguage: locale.htmlLang, dateModified: '2026-10-06', mainEntity: TRUST[lang].questions.map(({ question, answer }) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })) },
          ] });
          const metadata = `<title>${title}</title>
<meta name="description" content="${description}" />
<link rel="canonical" href="${url}" />
${Object.entries(SITE_LOCALES).map(([code, info]) => `<link rel="alternate" hreflang="${info.htmlLang}" href="${code === 'en' ? `${origin}/` : `${origin}/${code}/`}" />`).join('\n')}
<link rel="alternate" hreflang="x-default" href="${origin}/" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Side Stash" />
<meta property="og:url" content="${url}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:locale" content="${locale.ogLocale}" />
<meta property="og:image" content="${origin}/icon-128.png" />
<meta name="twitter:card" content="summary" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${description}" />
<meta name="twitter:image" content="${origin}/icon-128.png" />
<script type="application/ld+json">${schema.replace(/</g, '\\u003c')}</script>`;
          return html.replace('<!-- seo-metadata -->', metadata).replace('lang="en"', `lang="${locale.htmlLang}"`).replace('<div id="root"></div>', `<div id="root" data-locale="${lang}">${body}</div>`);
        } finally {
          if (!devServer) await server.close();
        }
      },
    },
  };
}
