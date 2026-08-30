'use client';

import React from 'react';
import { usePageMeta, PageMetaOptions } from '@/hooks/usePageMeta';

export default function SEO(props: PageMetaOptions) {
  usePageMeta(props);
  return null;
}
