import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import ipcLocale from '@utils/ipcLocale';
import { cryptography } from '@phaeton/phaeton-cryptography-web'; // eslint-disable-line
import i18n from './i18n';
import App from './app';

// eslint-disable-next-line no-extend-native
BigInt.prototype.toJSON = function () { return `${this.toString()}n`; };

ipcLocale.init(i18n);

if (!PRODUCTION) {
  window.cryptography = cryptography;

  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React);
}

const rootElement = document.getElementById('app');

const renderWithRouter = Component => (
  <BrowserRouter>
    <Router>
      <I18nextProvider i18n={i18n}>
        <Component />
      </I18nextProvider>
    </Router>
  </BrowserRouter>
);

ReactDOM.render(renderWithRouter(App), rootElement);

if (module.hot) {
  module.hot.accept('./app', () => {
    const NextRootContainer = require('./app').DevApp;
    ReactDOM.render(renderWithRouter(NextRootContainer), rootElement);
  });
}

document.documentElement.setAttribute('data-useragent', navigator.userAgent);
