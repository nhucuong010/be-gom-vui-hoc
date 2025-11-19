import React from 'react';

const Confetti: React.FC = () => (
    <>
        <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
            {Array.from({ length: 100 }).map((_, i) => (
                <div
                    key={i}
                    className="confetti-piece"
                    style={{
                        '--x': `${Math.random() * 100}vw`,
                        '--y': `${Math.random() * -100 - 100}px`, 
                        '--angle': `${Math.random() * 360}deg`,
                        '--delay': `${Math.random() * 1}s`,
                        '--duration': `${3 + Math.random() * 3}s`,
                        '--color': `hsl(${Math.random() * 360}, 100%, 65%)`,
                    } as React.CSSProperties}
                />
            ))}
        </div>
        <style>{`
            @keyframes confetti-fall {
                0% { transform: translateY(var(--y)) rotate(0deg); opacity: 1; }
                100% { transform: translateY(110vh) rotate(1080deg); opacity: 0; }
            }
            .confetti-piece {
                position: absolute;
                width: 8px;
                height: 16px;
                background-color: var(--color);
                left: var(--x);
                top: 0;
                opacity: 0;
                animation: confetti-fall var(--duration) var(--delay) cubic-bezier(0.25, 1, 0.5, 1) forwards;
            }
        `}</style>
    </>
);

export default Confetti;
