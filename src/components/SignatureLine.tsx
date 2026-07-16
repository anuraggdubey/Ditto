interface Props {
  className?: string;
  width?: number;
  height?: number;
  loop?: boolean;
}

export function SignatureLine({ className = "", width = 520, height = 90, loop = false }: Props) {
  // Waveform path — flat-ish audio bars represented as a single stroke
  const wavePath =
    "M0 45 L20 45 L25 25 L30 65 L35 20 L40 70 L45 30 L50 60 L55 40 L60 50 L70 45 L80 45 L85 30 L90 60 L95 25 L100 65 L105 35 L110 55 L120 45 L140 45 L145 20 L150 70 L155 30 L160 60 L165 40 L170 50 L180 45 L200 45 L205 25 L210 65 L215 35 L220 55 L225 45 L230 45 L250 45 L255 20 L260 70 L265 30 L270 60 L280 45 L300 45 L305 30 L310 60 L315 25 L320 65 L330 45 L350 45 L355 35 L360 55 L370 45 L390 45 L395 25 L400 65 L410 45 L430 45 L435 30 L440 60 L450 45 L470 45 L480 45 L500 45 L520 45";

  // Handwritten signature — flowing script curve
  const sigPath =
    "M10 55 C 30 20, 55 80, 80 45 S 130 20, 150 55 C 170 80, 200 30, 225 50 C 240 62, 250 40, 265 55 S 305 65, 325 40 C 345 20, 375 70, 395 50 S 445 30, 475 55 L 495 50";

  return (
    <svg
      viewBox="0 0 520 90"
      width={width}
      height={height}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d={wavePath}
        stroke="var(--ink)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={loop ? "" : "signature-wave"}
      />
      <path
        d={sigPath}
        stroke="var(--signal)"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={loop ? "" : "signature-sig"}
      />
    </svg>
  );
}
