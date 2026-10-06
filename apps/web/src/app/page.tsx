'use client';

import React from 'react';
import { DhanshreeFrontPage } from '@/components/DhanshreeFrontPage';
import { CountryCode } from '@dhanshree/shared';

export default function HomePage() {
  return <DhanshreeFrontPage countryCode={CountryCode.NEPAL} />;
}
