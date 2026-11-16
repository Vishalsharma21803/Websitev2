import type { Metadata } from 'next';
import { PageHead } from '@/components/PageHead';
import { Schematic } from '@/components/home/Schematic';
import { TrustLine } from '@/components/home/TrustLine';
import { Phases } from '@/components/Phases';
import { Start } from '@/components/home/Start';

export const metadata: Metadata = { title: 'Approach', description: 'The Sifars Production Layer and trust layer: how a build goes from blueprint to a system that holds up in production.' };

export default function Approach() {
  return (
    <>
      <PageHead
        status="Approach"
        title={
          <>
            The simple solution usually stops before <span className="live">the real system begins.</span>
          </>
        }
        lead="A no-code tool can start a workflow. A plugin can connect two systems. A prototype can prove an idea. Production is different: real users, real data, edge cases, integrations, monitoring, and someone accountable when it has to work."
      />
      <Schematic />
      <TrustLine />
      <Phases />
      <Start />
    </>
  );
}
