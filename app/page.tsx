import { Assembly } from '@/components/home/Assembly';
import { Marquee } from '@/components/home/Marquee';
import { Outcomes } from '@/components/home/Outcomes';
import { Schematic } from '@/components/home/Schematic';
import { TrustLine } from '@/components/home/TrustLine';
import { Quotes } from '@/components/home/Quotes';
import { Partner } from '@/components/home/Partner';
import { Start } from '@/components/home/Start';
import { Phases } from '@/components/Phases';

export default function Home() {
  return (
    <>
      <Assembly />
      <Marquee />
      <Outcomes />
      <Schematic />
      <Phases />
      <TrustLine />
      <Quotes />
      <Partner />
      <Start />
    </>
  );
}
