import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Copy, Lock } from 'lucide-react';

export function Sanctum() {
    return (
        <div className="w-full min-h-screen bg-brand-obsidian text-brand-ivory flex flex-col items-center relative isolation overflow-x-hidden selection:bg-brand-gold selection:text-brand-obsidian">
            <AmbientBackground />
            <SanctumHeader />

            <main className="flex-1 flex flex-col items-center justify-center w-full mt-24 mb-16 px-4">
                <AllocationStatus />
                <NetworkCatalyst />
            </main>

            <ProtocolModules />
        </div>
    );
}

// A. Minimalist Header
const SanctumHeader = () => (
    <header className="fixed top-0 left-0 w-full p-6 md:p-8 flex items-center justify-between z-50 pointer-events-none">
        <div className="font-playfair italic font-bold text-2xl md:text-3xl text-brand-ivory tracking-tight drop-shadow-lg pointer-events-auto cursor-default">
            Alpha Logic.
        </div>
        <div className="flex items-center gap-3 font-jetbrains text-[10px] md:text-xs text-brand-ivory/80 uppercase tracking-widest bg-white/[0.03] px-3 md:px-4 py-2 rounded-full backdrop-blur-md border border-white/10 pointer-events-auto shadow-sm">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            <span className="opacity-90">CONNECTION SECURE</span>
        </div>
    </header>
);

// B. Ambient Terminal Background
const AmbientBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        const columns = Math.floor(canvas.width / 40);
        const drops: number[] = new Array(columns).fill(1);

        const draw = () => {
            // Extremely faint trailing effect
            ctx.fillStyle = 'rgba(13, 13, 18, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Faint Champagne Gold Matrix style output
            ctx.fillStyle = 'rgba(201, 168, 76, 0.15)';
            ctx.font = '12px JetBrains Mono';

            for (let i = 0; i < drops.length; i++) {
                const text = Math.random() > 0.5 ? '1' : '0';
                ctx.fillText(text, i * 40, drops[i] * 20);

                // Add variance to how streams drop
                if (drops[i] * 20 > canvas.height && Math.random() > 0.985) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="fixed inset-0 z-0 bg-brand-obsidian pointer-events-none">
            {/* Base Canvas */}
            <canvas ref={canvasRef} className="absolute inset-0 opacity-40 mix-blend-screen" />
            {/* The heavy blur layer sitting on top of the canvas */}
            <div className="absolute inset-0 backdrop-blur-3xl bg-brand-obsidian/60" />
            {/* Dark Vignette to focus the center */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0D0D12_90%)] opacity-90" />
        </div>
    );
};

// C. Allocation Status
const AllocationStatus = () => {
    const numberRef = useRef<HTMLDivElement>(null);
    const targetQueue = 42;

    useEffect(() => {
        let iterations = 0;
        const maxIterations = 45; // Amount of ticks before freezing

        const interval = setInterval(() => {
            if (numberRef.current) {
                if (iterations >= maxIterations) {
                    clearInterval(interval);
                    numberRef.current.innerText = targetQueue.toString().padStart(3, '0');
                    gsap.fromTo(numberRef.current,
                        { scale: 1.1, color: '#FFFFFF', textShadow: '0 0 80px rgba(255,255,255,1)' },
                        { scale: 1, color: '#C9A84C', textShadow: '0 0 40px rgba(201,168,76,0.3)', duration: 0.8, ease: 'power3.out' }
                    );
                } else {
                    // Random 3 digit scramble
                    const randomNum = Math.floor(Math.random() * 900) + 100;
                    numberRef.current.innerText = randomNum.toString();
                    iterations++;
                }
            }
        }, 30);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none text-center">
            <div className="text-slate-400 font-inter text-xs md:text-sm font-medium tracking-[0.4em] uppercase mb-6 opacity-80">
                Current Queue Position
            </div>
            <div
                ref={numberRef}
                className="font-jetbrains text-[7rem] md:text-[14rem] leading-none text-brand-gold font-bold tracking-tighter"
            >
                000
            </div>
            <div className="font-playfair italic text-xl md:text-2xl text-brand-ivory/70 mt-6 max-w-md antialiased text-balance">
                "Patience is the ultimate allocator of capital."
            </div>
        </div>
    );
};

// D. Network Catalyst
const NetworkCatalyst = () => {
    const [copied, setCopied] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);

    const handleCopy = async () => {
        if (copied) return; // Prevent spamming
        await navigator.clipboard.writeText("vanguard.finance/invite/v-042");
        setCopied(true);

        // Morph text color out and in
        gsap.to(textRef.current, { opacity: 0, scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });

        // Glow morph effect on container
        if (containerRef.current) {
            gsap.fromTo(containerRef.current,
                { boxShadow: '0 0 0 rgba(201, 168, 76, 0)', borderColor: 'rgba(201, 168, 76, 0.8)' } as any,
                { boxShadow: '0 0 30px rgba(201, 168, 76, 0.15)', borderColor: 'rgba(255, 255, 255, 0.1)', duration: 1.5, ease: "power2.out", clearProps: "all" } as any
            );
        }

        setTimeout(() => setCopied(false), 3000);
    };

    return (
        <div className="relative z-10 mt-16 max-w-xl w-full">
            <div
                ref={containerRef}
                className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-1.5 pl-6 rounded-full flex items-center justify-between group transition-colors hover:border-white/20 hover:bg-white/[0.05]"
            >
                <div className="font-jetbrains text-sm md:text-base text-brand-ivory/90 truncate tracking-wide pr-4">
                    vanguard.finance/invite/v-042
                </div>
                <button
                    onClick={handleCopy}
                    className={`relative overflow-hidden px-6 py-3.5 rounded-full font-inter font-bold text-[10px] md:text-xs uppercase tracking-widest flex items-center gap-2 hover:scale-[0.98] transition-all flex-shrink-0 ${copied ? 'bg-[#C9A84C] text-brand-obsidian' : 'bg-brand-ivory text-brand-obsidian'}`}
                >
                    <span ref={textRef} className="relative z-10 flex items-center gap-2">
                        {copied ? 'LINK SECURED' : 'COPY'}
                        {!copied && <Copy size={14} className="opacity-80 drop-shadow-sm" />}
                    </span>
                    {/* Hover magnetic sweep effect */}
                    <div className={`absolute inset-0 bg-[#C9A84C] translate-y-[101%] ${!copied ? 'group-hover:translate-y-0' : ''} transition-transform duration-300 ease-out z-0`} />
                </button>
            </div>
            <div className="text-center mt-6 font-jetbrains text-[10px] md:text-xs text-brand-ivory/50 uppercase tracking-[0.2em]">
                <span className="text-brand-gold mr-1 text-sm leading-none align-middle">↑</span>
                Refer 1 peer to advance 15 positions.
            </div>
        </div>
    );
};

// E. Institutional Protocol (Locked Cards)
const MODULES = [
    { title: "Module I", name: "Algorithmic Discovery" },
    { title: "Module II", name: "The Vanguard Tearsheet" },
    { title: "Module III", name: "Capital Deployment" }
];

const ProtocolModules = () => {
    return (
        <div className="relative z-10 mt-auto w-full max-w-[90rem] px-4 md:px-8 pb-8 pt-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {MODULES.map((mod, i) => (
                <LockedModuleCard key={i} title={mod.title} name={mod.name} />
            ))}
        </div>
    );
};

const LockedModuleCard = ({ title, name }: { title: string, name: string }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const iconRef = useRef<HTMLDivElement>(null);

    const handleMouseEnter = () => {
        gsap.to(cardRef.current, { y: -6, duration: 0.3, ease: 'power2.out' });
        // Shake lock animation
        gsap.to(iconRef.current, {
            x: 4,
            duration: 0.08,
            yoyo: true,
            repeat: 5,
            ease: "sine.inOut",
            onComplete: () => { gsap.set(iconRef.current, { x: 0 }); }
        });
    };

    const handleMouseLeave = () => {
        gsap.to(cardRef.current, { y: 0, duration: 0.5, ease: 'power3.out' });
    };

    return (
        <div
            ref={cardRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="group cursor-not-allowed bg-brand-obsidian/40 border border-white/[0.05] backdrop-blur-md p-8 flex flex-col items-center justify-center gap-5 transition-colors hover:bg-white/[0.04] hover:border-white/10 rounded-sm"
        >
            <div ref={iconRef} className="bg-black/40 p-3 rounded-full border border-white/10 text-brand-ivory/30 group-hover:text-red-400 group-hover:border-red-400/40 transition-colors shadow-inner">
                <Lock size={18} strokeWidth={1.5} />
            </div>
            <div className="text-center">
                <div className="font-jetbrains text-[10px] text-brand-ivory/40 uppercase tracking-[0.25em] mb-2 flex items-center justify-center gap-2">
                    {title}
                    <span className="text-red-400/70 border border-red-400/20 bg-red-400/10 px-1.5 py-0.5 rounded-sm [font-size:8px] leading-none text-shadow-sm">LOCKED</span>
                </div>
                <div className="font-playfair italic text-lg text-brand-ivory/70 group-hover:text-brand-ivory transition-colors">
                    {name}
                </div>
            </div>
        </div>
    );
};
