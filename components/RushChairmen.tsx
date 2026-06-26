'use client';

import Image from 'next/image';
import { useState } from 'react';

type RushChairman = {
  readonly id: string;
  readonly name: string;
  readonly title: string;
  readonly image: string;
  readonly initials: string;
  readonly bio: string;
  readonly contact: string;
};

type RushChairmenProps = {
  readonly chairmen: readonly RushChairman[];
};

export function RushChairmen({ chairmen }: RushChairmenProps) {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  return (
    <div className="rush-chairmen-grid">
      {chairmen.map((chairman) => (
        <article className="rush-chairman-card" key={chairman.id}>
          <div className="rush-chairman-photo">
            <div className="rush-chairman-placeholder" aria-hidden="true">
              {chairman.initials}
            </div>
            {!failedImages[chairman.id] && (
              <Image
                src={chairman.image}
                alt={`${chairman.name} headshot`}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="rush-chairman-image"
                onError={() => setFailedImages((current) => ({ ...current, [chairman.id]: true }))}
              />
            )}
          </div>

          <div className="rush-chairman-body">
            <p className="rush-chairman-title">{chairman.title}</p>
            <h3 className="rush-chairman-name">{chairman.name}</h3>
            <p className="rush-chairman-bio">{chairman.bio}</p>
            <p className="rush-chairman-contact">{chairman.contact}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
