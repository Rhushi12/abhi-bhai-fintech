import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PROTOCOL_STEPS = [
    {
        num: "01",
        title: "BESPOKE SELECTION",
        desc: "Hand-curated filtering of top 200 NSE stocks. The Master Architect evaluates momentum, value, and quality factors across multiple timeframes to construct only the highest-conviction portfolios.",
        animation: 'helix'
    },
    {
        num: "02",
        title: "RISK PARITY",
        desc: "Mathematical weight adjustment to minimize drawdown. Each position is sized using inverse-volatility weighting, ensuring no single asset dominates portfolio risk during turbulent market regimes.",
        animation: 'laser'
    },
    {
        num: "03",
        title: "EXECUTION",
        desc: "One-click sync via Smallcase Gateway integration. Your portfolio rebalances in seconds — not hours. Seamless broker connectivity ensures institutional-grade execution at retail scale.",
        animation: 'waveform'
    }
];

export const Protocol = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<Array<HTMLDivElement | null>>([]);
    const svgRefs = useRef<Array<SVGSVGElement | null>>([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Intro Context (Card 0) Fade animation
            gsap.fromTo(".intro-content",
                { opacity: 0, scale: 0.95 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 1.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".intro-screen",
                        start: "top center",
                        toggleActions: "play none none reverse"
                    }
                }
            );

            // Each card takes up 100vh. We pin them progressively so they stack seamlessly over the previous one.
            cardsRef.current.forEach((card) => {
                if (!card) return;

                // For stacking over the previous cards, we pin them once they hit the top of the viewport
                ScrollTrigger.create({
                    trigger: card,
                    start: "top top",
                    pin: true,
                    pinSpacing: false, // Allows the next card to slide right over it
                    // Unpin when the last card finishes its scroll
                    endTrigger: ".protocol-end-marker",
                    end: "bottom top",
                });

                // Content fade up within the card itself
                gsap.fromTo(card.querySelector('.card-content'),
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 60%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            });

            // SVG Animations
            if (svgRefs.current[0]) {
                gsap.to(svgRefs.current[0].querySelectorAll('.helix-path'), {
                    yPercent: -50, ease: "none", duration: 3, repeat: -1, yoyo: true
                });
            }
            if (svgRefs.current[1]) {
                gsap.fromTo(svgRefs.current[1].querySelector('.laser-line'),
                    { y: 10 }, { y: 90, duration: 2, ease: "power1.inOut", repeat: -1, yoyo: true }
                );
            }
            if (svgRefs.current[2]) {
                gsap.to(svgRefs.current[2].querySelectorAll('.wave-bar'), {
                    scaleY: 0.2, duration: 0.8,
                    stagger: { amount: 1, yoyo: true, repeat: -1 },
                    ease: "power2.inOut", transformOrigin: "bottom center"
                });
            }
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const renderSVG = (type: string, index: number) => {
        switch (type) {
            case 'helix':
                return (
                    <svg ref={(el) => { svgRefs.current[index] = el; }} viewBox="0 0 100 100" className="w-full h-full opacity-60">
                        <path className="helix-path" d="M 20 0 Q 80 25, 20 50 T 20 100" fill="none" stroke="#C9A84C" strokeWidth="2" />
                        <path className="helix-path" d="M 80 0 Q 20 25, 80 50 T 80 100" fill="none" stroke="#0D0D12" strokeWidth="2" opacity="0.3" />
                    </svg>
                );
            case 'laser':
                return (
                    <svg ref={(el) => { svgRefs.current[index] = el; }} viewBox="0 0 100 100" className="w-full h-full">
                        <rect x="10" y="10" width="80" height="80" fill="none" stroke="#0D0D12" strokeWidth="1" opacity="0.1" />
                        <line className="laser-line" x1="10" y1="50" x2="90" y2="50" stroke="#C9A84C" strokeWidth="2" strokeDasharray="4 2" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#0D0D12" strokeWidth="1" opacity="0.1" />
                    </svg>
                );
            case 'waveform':
                return (
                    <svg ref={(el) => { svgRefs.current[index] = el; }} viewBox="0 0 100 100" className="w-full h-full flex items-end">
                        {[10, 30, 50, 70, 90].map((x, i) => (
                            <rect key={i} className="wave-bar" x={x} y="20" width="8" height="80" fill="#C9A84C" rx="4" />
                        ))}
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <section
            ref={containerRef}
            id="protocol"
            className="w-full relative text-brand-obsidian"
        >
            {/* Intro Content (Card 0) - Takes up full viewport height */}
            <div
                ref={(el) => { cardsRef.current[0] = el; }}
                className="intro-screen w-full h-screen bg-brand-ivory flex flex-col items-center justify-center z-[1] will-change-transform"
            >
                <div className="intro-content text-center px-4">
                    <h2 className="text-sm md:text-base font-inter font-semibold tracking-[0.2em] uppercase text-brand-obsidian/60 mb-6">
                        System Architecture
                    </h2>
                    <h3 className="font-playfair italic text-5xl md:text-7xl text-brand-obsidian leading-tight">
                        The Protocol Archive
                    </h3>
                </div>
            </div>

            {/* The Stacking Cards (Cards 1 to N) */}
            {PROTOCOL_STEPS.map((step, index) => (
                <div
                    key={step.num}
                    // index + 1 because card 0 is the intro
                    ref={(el) => { cardsRef.current[index + 1] = el; }}
                    className="w-full h-screen bg-brand-ivory flex flex-col items-center justify-center relative will-change-transform"
                    style={{ zIndex: index + 2 }} // Progressively higher z-index so they slide over the pinned ones
                >
                    {/* Dark subtle overlay to give a "shadow" to the slide emerging above it (optional UX polish) */}
                    <div className="absolute inset-x-0 -top-[1px] h-32 bg-gradient-to-b from-black/5 to-transparent pointer-events-none z-10" />

                    <div className="card-content w-full h-full max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-24 md:py-0 gap-12 lg:gap-24">
                        {/* Left: Content (60%) */}
                        <div className="md:w-[60%] flex flex-col justify-center items-start pt-12 md:pt-0 h-auto md:h-full z-10 order-2 md:order-1">
                            <div className="font-jetbrains text-brand-gold font-medium text-2xl md:text-3xl tracking-tight opacity-50 mb-4">
                                PROTOCOL {step.num}
                            </div>

                            <h3 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold tracking-tight mb-8 text-brand-obsidian leading-tight">
                                {step.title}
                            </h3>

                            <p className="font-inter text-sm md:text-base text-brand-obsidian/60 leading-loose max-w-xl font-medium tracking-wide">
                                {step.desc}
                            </p>
                        </div>

                        {/* Right: Animation (40%) */}
                        <div className="md:w-[40%] h-[40vh] md:h-full flex justify-center items-center relative p-8 md:p-12 border-b md:border-b-0 md:border-l border-brand-obsidian/10 order-1 md:order-2">
                            <div className="w-full max-w-[500px] aspect-square relative flex justify-center items-center">
                                {/* Subtle glowing backing for the animation */}
                                <div className="absolute inset-0 bg-brand-gold/5 blur-[80px] rounded-full"></div>
                                {renderSVG(step.animation, index)}
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* End Maker ensures that the last card fully unpins when hitting the next section */}
            <div className="protocol-end-marker w-full h-[1px]"></div>
        </section>
    );
};
