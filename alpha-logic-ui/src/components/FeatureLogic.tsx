import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const SIGNALS = [
    "High Momentum",
    "Value Arbitrage",
    "Growth Signals"
];
const LOGS = [
    "RESOURCING_INSTITUTIONAL_LIQUIDITY...",
    "INITIALIZING_ARCHITECT_PROTOCOL...",
    "STRUCTURING_BESPOKE_POSITIONS...",
    "OVERSIGHT_VERIFIED..."
];

// Reusable wrapper to add 3D Tilt interaction to cards
const InteractiveCard = ({ children, className = "", onClick }: any) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Subtle tilt up to 10 degrees on the edges
        const rotationY = (x / rect.width - 0.5) * 20;
        const rotationX = (y / rect.height - 0.5) * -20;

        gsap.to(cardRef.current, {
            rotationY,
            rotationX,
            transformPerspective: 1000,
            ease: "power2.out",
            duration: 0.4,
            transformOrigin: "center center"
        });
    };

    const handleMouseLeave = () => {
        if (!cardRef.current) return;
        gsap.to(cardRef.current, {
            rotationY: 0,
            rotationX: 0,
            ease: "power3.out",
            duration: 0.8
        });
    };

    return (
        <div
            ref={cardRef}
            className={`will-change-transform ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export const FeatureLogic = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <section
            ref={containerRef}
            className="w-full bg-brand-ivory py-32 px-8 md:px-16 flex flex-col justify-center overflow-hidden perspective-[2000px]"
        >
            <div className="max-w-7xl mx-auto w-full">
                <div className="mb-20 border-b border-brand-obsidian/20 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <h2 className="text-4xl md:text-5xl font-inter font-bold tracking-tight text-brand-obsidian uppercase">
                        Interactive Artifacts
                    </h2>
                    <p className="text-brand-obsidian/60 font-jetbrains uppercase text-xs md:text-sm tracking-widest animate-pulse">
                        System Diagnostics // Node 01
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <DiagnosticShuffler />
                    <TelemetryTypewriter />
                    <ProtocolScheduler />
                </div>
            </div>
        </section>
    );
};

const DiagnosticShuffler = () => {
    const [index, setIndex] = useState(0);
    const textRef = useRef<HTMLDivElement>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const runShuffle = () => {
        gsap.to(textRef.current, {
            y: -20,
            opacity: 0,
            duration: 0.25,
            ease: "power2.in",
            onComplete: () => {
                setIndex((prev) => (prev + 1) % SIGNALS.length);
                gsap.fromTo(textRef.current,
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.4, ease: "power4.out" }
                );
            }
        });
    };

    const startAutoShuffle = () => {
        intervalRef.current = setInterval(runShuffle, 3000);
    };

    useEffect(() => {
        startAutoShuffle();
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const handleManualClick = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        runShuffle();
        startAutoShuffle();
    };

    return (
        <InteractiveCard
            onClick={handleManualClick}
            className="cursor-pointer group border border-brand-obsidian/10 p-10 bg-white/50 backdrop-blur-sm hover:border-brand-gold/50 transition-colors duration-700 flex flex-col justify-between h-[320px] shadow-sm hover:shadow-xl"
        >
            <div className="font-jetbrains text-xs uppercase text-brand-obsidian/40 flex justify-between tracking-wider">
                <span>Process 01</span>
                <span className="group-hover:text-brand-gold transition-colors">Press to Override</span>
            </div>
            <div className="pointer-events-none">
                <div className="font-inter font-medium text-sm text-brand-obsidian/60 uppercase tracking-widest mb-4 transition-colors group-hover:text-brand-obsidian">
                    Signal Focus
                </div>
                <div className="h-[60px] overflow-hidden relative">
                    <div ref={textRef} className="font-playfair italic text-4xl leading-tight text-brand-gold absolute w-full drop-shadow-sm">
                        {SIGNALS[index]}
                    </div>
                </div>
            </div>
        </InteractiveCard>
    );
};

const TelemetryTypewriter = () => {
    const [lines, setLines] = useState<string[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const cursorRef = useRef<HTMLSpanElement>(null);

    const typeLine = () => {
        setLines(prev => {
            if (prev.length >= LOGS.length) return prev; // Avoid infinite stacking if component unmount fails edge cases
            return [...prev, LOGS[prev.length]];
        });

        setLines(prev => {
            if (prev.length >= LOGS.length) {
                setTimeout(() => {
                    setLines([]);
                    setTimeout(typeLine, 500);
                }, 3000);
            } else {
                setTimeout(typeLine, 800 + Math.random() * 1000);
            }
            return prev;
        });
    };

    useEffect(() => {
        const timeout = setTimeout(typeLine, 1000);

        gsap.to(cursorRef.current, {
            opacity: 0,
            repeat: -1,
            yoyo: true,
            duration: 0.4,
            ease: "steps(1)"
        });

        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [lines]);

    return (
        <InteractiveCard className="border border-brand-obsidian/10 bg-brand-obsidian text-brand-ivory/80 p-10 h-[320px] flex flex-col font-jetbrains text-sm relative overflow-hidden shadow-xl hover:shadow-2xl transition-shadow cursor-crosshair">
            <div className="text-brand-gold/60 text-xs mb-6 uppercase border-b border-brand-ivory/10 pb-4 tracking-widest flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
                Architect's Ledger // Protocol Sync
            </div>
            <div ref={containerRef} className="flex-1 overflow-y-auto w-full space-y-3 scrollbar-hide pointer-events-none">
                {lines.map((line, i) => (
                    <div key={i} className="opacity-90 tracking-wide text-xs">
                        <span className="text-brand-gold mr-3">◆</span>{line}
                    </div>
                ))}
                <div>
                    <span className="text-brand-gold mr-3">◆</span>
                    <span ref={cursorRef} className="inline-block w-2 bg-brand-gold h-4 translate-y-1"></span>
                </div>
            </div>
        </InteractiveCard>
    );
};

const ProtocolScheduler = () => {
    const days = ['M', 'T', 'W', 'T', 'F'];
    const cursorRef = useRef<HTMLDivElement>(null);
    const tlRef = useRef<gsap.core.Timeline | null>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
            tlRef.current = tl;

            days.forEach((_, i) => {
                tl.to(cursorRef.current, {
                    x: `${i * 100}%`,
                    duration: 0.3,
                    ease: "power2.inOut"
                });
            });

            // Gentle pulse on Friday
            tl.to(cursorRef.current, {
                backgroundColor: '#C9A84C',
                duration: 0.3,
            });
            tl.to(cursorRef.current, {
                scale: 1.05,
                duration: 0.4,
                yoyo: true,
                repeat: 3,
                ease: "power1.inOut"
            });
            tl.to(cursorRef.current, {
                backgroundColor: 'rgba(13, 13, 18, 0.05)',
                scale: 1,
                duration: 0.3
            });
        });

        return () => ctx.revert();
    }, [days.length]);

    const handleDayHover = (idx: number) => {
        if (tlRef.current) tlRef.current.pause();

        gsap.to(cursorRef.current, {
            x: `${idx * 100}%`,
            duration: 0.3,
            ease: "power3.out",
            backgroundColor: idx === 4 ? '#C9A84C' : 'rgba(13, 13, 18, 0.05)',
            scale: 1
        });
    };

    const handleMouseLeaveTimeline = () => {
        if (tlRef.current) tlRef.current.play();
    };

    return (
        <InteractiveCard className="group border border-brand-obsidian/10 p-10 bg-white/50 backdrop-blur-sm h-[320px] flex flex-col justify-between shadow-sm hover:shadow-xl transition-shadow duration-700">
            <div className="font-jetbrains text-xs uppercase text-brand-obsidian/40 flex justify-between tracking-wider">
                Rebalancing Target
                <span className="text-brand-gold group-hover:animate-pulse">Active</span>
            </div>

            <div className="w-full">
                <div className="text-sm font-inter font-medium uppercase tracking-widest text-brand-obsidian/60 mb-8 pointer-events-none">
                    Execution Trigger
                </div>

                <div
                    onMouseLeave={handleMouseLeaveTimeline}
                    className="relative flex justify-between items-center text-sm font-jetbrains font-bold py-6 border-b border-t border-brand-obsidian/10"
                >
                    <div
                        ref={cursorRef}
                        className="absolute left-0 top-0 bottom-0 w-1/5 bg-brand-obsidian/5 pointer-events-none rounded-sm"
                    />
                    {days.map((day, idx) => (
                        <div
                            key={idx}
                            onMouseEnter={() => handleDayHover(idx)}
                            className={`flex-1 text-center z-10 w-[20%] cursor-pointer ${idx === 4 ? 'text-brand-gold' : 'text-brand-obsidian/40 hover:text-brand-obsidian'}`}
                        >
                            {day}
                        </div>
                    ))}
                </div>
            </div>
        </InteractiveCard>
    );
};
