'use client';

import React from 'react';
import { CountryCode } from '@dhanshree/shared';
import { useResolvedParams } from '@/lib/params';
import { DhanshreeFrontPage } from '@/components/DhanshreeFrontPage';

interface CountryPageProps {
  params: any;
}

export default function CountryStorefront({ params }: CountryPageProps) {
  const unwrappedParams = useResolvedParams<{ country: string }>(params);
  const countryParam = (unwrappedParams.country || 'np').toUpperCase();

  const code =
    countryParam === 'IN'
      ? CountryCode.INDIA
      : countryParam === 'AE'
      ? CountryCode.UAE
      : CountryCode.NEPAL;

  return <DhanshreeFrontPage countryCode={code} />;
}
