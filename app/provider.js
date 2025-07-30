// app/providers.js
'use client';

import { SessionProvider } from 'next-auth/react';

export  default function Prov({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
