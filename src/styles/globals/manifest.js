import React from 'react';
import { createGlobalStyle } from 'styled-components';

import normalize from './normalize';
import transitions from './transitions';

const NormalizeGlobalStyles = createGlobalStyle`${normalize}`;
const TransitionGlobalStyles = createGlobalStyle`${transitions}`;

export default () => (
  <>
    <NormalizeGlobalStyles />
    <TransitionGlobalStyles />
  </>
);
