'use client';

import React from 'react';
import { AmazonFrontPage } from '@/components/AmazonFrontPage';
import { CountryCode } from '@dhanshree/shared';

export default function HomePage() {
  return <AmazonFrontPage countryCode={CountryCode.NEPAL} />;
}
