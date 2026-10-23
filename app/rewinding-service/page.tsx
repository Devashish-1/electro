import { Metadata } from 'next';
import { RewindingPage } from '@/views/RewindingPage';

export const metadata: Metadata = {
  title: 'Electric Motor & Pump Rewinding Workshop | DAGDI Beawar',
  description: 'Certified 3-phase induction motor, submersible pump, transformer and armature rewinding with vacuum pressure baking and dynamic balancing.',
};

export default function Page() {
  return <RewindingPage />;
}
