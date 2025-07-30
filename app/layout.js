'use client';

import './globals.css';
import { store } from './store/api';
import { Provider } from 'react-redux';
import { SessionProvider } from 'next-auth/react';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Provider store={store}>
            {children}
          </Provider>
        </SessionProvider>
      </body>
    </html>
  );
}
