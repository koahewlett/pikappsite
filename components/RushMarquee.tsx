const words = [
  'Brotherhood',
  'Rush',
  'Tailgates',
  'Philanthropy',
  'Leadership',
  'ASU',
  'Theta Xi',
  'Pi Kapp',
  'Fall Rush',
];

export function RushMarquee() {
  const track = [...words, ...words];

  return (
    <div className="rush-marquee" aria-hidden="true">
      <div className="rush-marquee-track">
        {track.map((word, index) => (
          <span key={`${word}-${index}`}>
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}
