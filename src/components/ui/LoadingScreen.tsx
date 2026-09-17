import './LoadingScreen.css';

export default function LoadingScreen() {
  return (
    <div className="loading-screen" role="status" aria-label="Loading">
      <div className="loading-screen__content">
        {/* Maharashtra outline SVG drawing animation */}
        <svg
          className="loading-screen__map"
          viewBox="0 0 200 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            className="loading-screen__path"
            d="M60 20 L80 15 L100 18 L120 10 L140 15 L155 25 L165 40 L170 60 L168 80 L160 95 L150 110 L140 120 L125 130 L110 140 L95 145 L80 142 L65 135 L50 125 L40 110 L35 95 L30 80 L32 60 L38 45 L48 30 Z"
            stroke="var(--color-earth)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="loading-screen__text">MAHASAFAR</p>
      </div>
    </div>
  );
}
