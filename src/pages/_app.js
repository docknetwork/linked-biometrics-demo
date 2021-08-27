import React, { useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import Head from 'next/head';

import GlobalStyles from '../styles/globals/manifest';
import '../styles/fonts.css';

const theme = {};

export default function App({ Component, pageProps }) {
  useEffect(() => {
    window.global = window;
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <>
        <Head>
          <meta charSet="utf-8" />
          <title>Dock Linked Biometrics Demo</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <GlobalStyles />
        <Component {...pageProps} />
      </>
    </ThemeProvider>
  );
}
