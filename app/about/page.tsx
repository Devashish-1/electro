import { Metadata } from 'next';
import { AboutPage } from '@/views/AboutPage';

export const metadata: Metadata = {
  title: 'About DAGDI Electricals & Motor Rewinding Works | Beawar Rajasthan',
  description: 'Industrial power control pioneers since 2017. Authorized stockist for Ador, D&H Secheron, Milan Copper, and certified motor rewinding workshop.',
};

export default function Page() {
  return <AboutPage />;
}
