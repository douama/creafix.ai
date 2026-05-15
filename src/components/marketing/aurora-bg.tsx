/**
 * Aurora background animé — fond fixed pour la landing.
 * Blobs gradient (CSS keyframes) + particules flottantes.
 * S'adapte light/dark (opacité réduite en light).
 */
export function AuroraBg() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* 3 blobs principaux — couleurs CreaFix */}
      <div
        className="aurora-blob"
        style={{
          top: "-15%",
          left: "10%",
          width: "55vw",
          height: "55vw",
          background:
            "radial-gradient(circle, rgba(123,97,255,0.55), transparent 60%)",
          animation: "aurora-1 22s ease-in-out infinite",
        }}
      />
      <div
        className="aurora-blob"
        style={{
          top: "20%",
          right: "-10%",
          width: "45vw",
          height: "45vw",
          background:
            "radial-gradient(circle, rgba(0,194,255,0.45), transparent 60%)",
          animation: "aurora-2 28s ease-in-out infinite",
        }}
      />
      <div
        className="aurora-blob"
        style={{
          bottom: "-15%",
          left: "30%",
          width: "50vw",
          height: "50vw",
          background:
            "radial-gradient(circle, rgba(255,138,0,0.35), transparent 60%)",
          animation: "aurora-3 26s ease-in-out infinite",
        }}
      />

      {/* Particules flottantes */}
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="particle"
          style={{
            top: p.top,
            left: p.left,
            animation: `float-particle ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

const PARTICLES = [
  { top: "12%", left: "8%", duration: 8, delay: 0 },
  { top: "24%", left: "82%", duration: 11, delay: 1.5 },
  { top: "38%", left: "20%", duration: 9, delay: 0.6 },
  { top: "52%", left: "70%", duration: 12, delay: 2.1 },
  { top: "68%", left: "12%", duration: 10, delay: 1.2 },
  { top: "78%", left: "88%", duration: 13, delay: 0.9 },
  { top: "84%", left: "44%", duration: 9, delay: 1.8 },
  { top: "16%", left: "55%", duration: 11, delay: 0.3 },
];
