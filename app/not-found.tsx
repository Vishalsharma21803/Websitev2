import Link from 'next/link';
import { Arrow } from '@/components/Arrow';
import { Sketch } from '@/components/Sketch';

export default function NotFound() {
  return (
    <section className="nf wrap">
      <div className="nf-art">
        <Sketch kind="flow" />
      </div>
      <h1 className="display">
        This part isn’t <span className="live">on the drawing.</span>
      </h1>
      <p className="lead">The page may have moved when we redrew the site.</p>
      <Link href="/" className="btn">
        <Arrow />
        Back to the start
      </Link>
    </section>
  );
}
