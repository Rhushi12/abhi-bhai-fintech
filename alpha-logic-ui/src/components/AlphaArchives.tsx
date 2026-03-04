import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STRATEGIES = [
    {
        title: "The Momentum Vanguard",
        cagr: "+32.4%",
        volatility: "HIGH",
        text: "Captures high-velocity breakouts.",
        path: "M 0,80 Q 20,80 30,60 T 50,70 T 70,30 T 90,50 T 130,20 T 170,40 T 200,10 T 250,30 L 300,0",
        delay: 0
    },
    {
        title: "Value Arbitrage",
        cagr: "+22.1%",
        volatility: "LOW",
        text: "Deep value extraction.",
        path: "M 0,80 Q 50,70 100,50 T 200,30 T 300,15",
        delay: 0
    },
    {
        title: "Sector Rotation",
        cagr: "+26.8%",
        volatility: "MED",
        text: "Dynamic capital reallocation.",
        path: "M 0,80 Q 30,20 60,60 T 120,30 T 180,50 T 240,10 T 300,20",
        delay: 0
    }
];

export const AlphaArchives = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollWrapperRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
    const pathsRef = useRef<(SVGPathElement | null)[]>([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const container = containerRef.current;
            const scrollWrapper = scrollWrapperRef.current;
            const textElement = textRef.current;

            if (container && scrollWrapper && textElement) {
                // Determine layout constraints completely dynamically.
                // ScrollTrigger guarantees that during its refresh cycle, all associated 
                // transforms are reverted, making getBoundingClientRect() highly accurate.
                const getCalculations = () => {
                    const firstCard = cardsRef.current[0];
                    const lastCard = cardsRef.current[cardsRef.current.length - 1];
                    let catchUp = 0;
                    let scrollTargetWidth = scrollWrapper.scrollWidth - window.innerWidth;

                    if (firstCard && textElement) {
                        const textRect = textElement.getBoundingClientRect();
                        const cardRect = firstCard.getBoundingClientRect();
                        const gap = window.innerWidth >= 768 ? 64 : 32;

                        catchUp = Math.max(0, cardRect.left - textRect.right - gap);
                    }

                    if (lastCard) {
                        // Calculate exact scroll distance required to put the last card in the center of the viewport
                        // This replaces the full scrollWidth distance
                        const lastCardRect = lastCard.getBoundingClientRect();
                        const scrollWrapperRect = scrollWrapper.getBoundingClientRect();

                        // Center point we want the card to reach
                        const targetViewportCenter = window.innerWidth / 2;

                        // How far is the card's center from the wrapper's left edge
                        const cardCenterFromWrapperLeft = (lastCardRect.left - scrollWrapperRect.left) + (lastCardRect.width / 2);

                        // The total distance we need to shift the wrapper X constraint
                        // so that `cardCenterFromWrapperLeft` aligns with `targetViewportCenter`
                        scrollTargetWidth = cardCenterFromWrapperLeft - targetViewportCenter;
                    }

                    return { scrollWidth: scrollTargetWidth, catchUp };
                };

                // Trigger 1: Scroll the cards container
                const horizontalScroll = gsap.to(scrollWrapper, {
                    x: () => -getCalculations().scrollWidth,
                    ease: "none",
                    scrollTrigger: {
                        trigger: container,
                        start: "top top",
                        end: () => `+=${getCalculations().scrollWidth}`,
                        scrub: 1,
                        pin: true,
                        anticipatePin: 1,
                        invalidateOnRefresh: true
                    }
                });

                // Trigger 2: Move the text exactly synchronously once the distance closes
                gsap.to(textElement, {
                    x: () => {
                        const { scrollWidth, catchUp } = getCalculations();
                        return -(scrollWidth - catchUp);
                    },
                    ease: "none",
                    scrollTrigger: {
                        trigger: container,
                        // Start moving exactly when the first card catches up
                        start: () => `top+=${getCalculations().catchUp} top`,
                        // End dragging identically with the cards wrapper
                        end: () => `+=${getCalculations().scrollWidth}`,
                        scrub: 1,
                        invalidateOnRefresh: true
                    }
                });

                // Trigger 3: Animate Sparklines when individual cards reach center
                cardsRef.current.forEach((card, i) => {
                    const path = pathsRef.current[i];
                    if (!card || !path) return;

                    const length = path.getTotalLength();
                    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

                    // We use containerAnimation to detect exactly when the card intersects the viewport center horizontally
                    gsap.to(path, {
                        strokeDashoffset: 0,
                        duration: 1.5,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: card,
                            containerAnimation: horizontalScroll,
                            start: "center center",
                            toggleActions: "play none none reverse",
                        }
                    });
                });
            }
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={containerRef}
            className="w-full h-screen bg-brand-ivory text-brand-obsidian overflow-hidden flex items-center relative isolation"
        >
            {/* Horizontal Scroll Wrapper */}
            <div
                ref={scrollWrapperRef}
                className="relative z-0 flex items-center h-full w-max pt-64 lg:pt-0 pl-[100vw] lg:pl-[40vw] pr-16 md:pr-32"
            >
                <div className="flex gap-8 md:gap-16 items-center">
                    {STRATEGIES.map((strategy, idx) => (
                        <div
                            key={idx}
                            ref={el => { cardsRef.current[idx] = el; }}
                            className="relative z-10 w-[85vw] md:w-[500px] h-[500px] bg-white rounded-sm shadow-2xl shadow-black/5 p-12 flex flex-col justify-between border border-brand-obsidian/5 flex-shrink-0"
                        >
                            <div className="space-y-6 flex-1">
                                <h4 className="font-playfair text-2xl md:text-3xl lg:text-4xl text-brand-obsidian leading-tight">
                                    {strategy.title}
                                </h4>

                                <div className="font-jetbrains text-xs md:text-sm text-brand-obsidian/60 tracking-wider flex flex-col gap-2 relative z-20">
                                    <div className="flex justify-between border-b border-brand-obsidian/10 pb-2">
                                        <span>CAGR:</span>
                                        <span className="text-brand-obsidian font-bold">{strategy.cagr}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-brand-obsidian/10 pb-2">
                                        <span>VOLATILITY:</span>
                                        <span className="text-brand-obsidian font-bold">{strategy.volatility}</span>
                                    </div>
                                </div>

                                {/* Animated SVG Sparkline */}
                                <div className="w-full h-24 my-4 relative pointer-events-none">
                                    <svg
                                        viewBox="0 0 300 80"
                                        className="w-full h-full absolute inset-0 overflow-visible drop-shadow-sm"
                                        preserveAspectRatio="none"
                                    >
                                        <defs>
                                            <linearGradient id={`grad-${idx}`} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.2" />
                                                <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>

                                        {/* Filled Gradient underneath the line */}
                                        <path
                                            d={`${strategy.path} L 300,80 L 0,80 Z`}
                                            fill={`url(#grad-${idx})`}
                                            className="opacity-50"
                                        />

                                        {/* Actively Drawn Stroke Path */}
                                        <path
                                            ref={el => { pathsRef.current[idx] = el; }}
                                            d={strategy.path}
                                            fill="none"
                                            stroke="#C9A84C"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            </div>

                            <div className="space-y-8 relative z-20 mt-auto">
                                <p className="font-inter text-brand-obsidian/70 text-base md:text-lg">
                                    {strategy.text}
                                </p>

                                <button className="group font-inter uppercase tracking-widest text-xs md:text-sm text-brand-gold font-bold flex items-center gap-2 pb-1 border-b border-brand-gold hover:text-brand-obsidian hover:border-brand-obsidian transition-colors duration-300 w-fit">
                                    View Strategy
                                    <svg
                                        className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sticky Header Section - Placed last in DOM to ensure highest rendering order along with z-index */}
            <div
                ref={textRef}
                className="absolute left-8 md:left-16 top-32 lg:top-1/2 lg:-translate-y-1/2 z-[100] w-fit max-w-[85vw] md:max-w-[40vw] pointer-events-none"
            >
                <h2 className="text-sm md:text-base font-inter font-semibold tracking-[0.2em] uppercase text-brand-obsidian/60 mb-4 drop-shadow-sm">
                    The Alpha Archives
                </h2>
                <h3 className="font-playfair italic text-5xl md:text-7xl text-brand-gold leading-tight drop-shadow-sm">
                    Select Your Alpha.
                </h3>
            </div>
        </section>
    );
};
