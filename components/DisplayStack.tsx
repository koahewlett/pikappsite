type DisplayTone = 'white' | 'gold' | 'blue' | 'muted';

type DisplayLine = {
  readonly text: string;
  readonly tone?: DisplayTone;
  readonly italic?: boolean;
  readonly shadow?: boolean;
};

type DisplayStackProps = {
  readonly lines: readonly DisplayLine[];
  readonly className?: string;
  readonly ariaLabel?: string;
};

const toneClasses: Record<DisplayTone, string> = {
  white: 'display-tone-white',
  gold: 'display-tone-gold',
  blue: 'display-tone-blue',
  muted: 'display-tone-muted',
};

export function DisplayStack({ lines, className = '', ariaLabel }: DisplayStackProps) {
  return (
    <span className={`display-stack ${className}`} aria-label={ariaLabel}>
      {lines.map((line, index) => {
        const textClasses = [
          'display-line-text',
          toneClasses[line.tone ?? 'white'],
          line.italic ? 'display-italic' : '',
          line.shadow ? 'display-shadow' : '',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <span className="display-line" key={`${line.text}-${index}`}>
            <span className={textClasses}>{line.text}</span>
          </span>
        );
      })}
    </span>
  );
}
