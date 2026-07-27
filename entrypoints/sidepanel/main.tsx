import React, { StrictMode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { App } from './App';
import { initializeI18n } from '../../lib/i18n';
import './style.css';

const container = document.getElementById('app');

if (!container) {
  throw new Error('Sidepanel root element not found.');
}

type ContainerWithRoot = HTMLElement & { _reactRoot?: Root };
const rootContainer = container as ContainerWithRoot;

if (!rootContainer._reactRoot) {
  rootContainer._reactRoot = createRoot(rootContainer);
}

const root = rootContainer._reactRoot;

void initializeI18n().then(() => {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
