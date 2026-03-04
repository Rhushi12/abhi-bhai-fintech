import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const PerformanceVisualizer = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const linePathRef = useRef<SVGPathElement>(null);
    const labelRef1 = useRef<HTMLDivElement>(null);
    const labelRef2 = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (!linePathRef.current) return;
            const length = linePathRef.current.getTotalLength();

            // Set up initial stroke dash array for drawing effect
            gsap.set(linePathRef.current, {
                strokeDasharray: length,
                strokeDashoffset: length
            });

            // Draw line on scroll
            gsap.to(linePathRef.current, {
                strokeDashoffset: 0,
                ease: 'none',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 60%',
                    end: 'bottom 80%',
                    scrub: 1,
                }
            });

            // Float up labels
            gsap.from([labelRef1.current, labelRef2.current], {
                y: 20,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: 'power4.out',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 50%',
                }
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={containerRef}
            className="w-full py-32 px-8 md:px-16 bg-brand-ivory flex flex-col items-center"
        >
            <div className="max-w-5xl w-full text-center mb-24">
                <h2 className="text-sm md:text-base font-inter font-semibold tracking-[0.2em] uppercase text-brand-obsidian/60 mb-6">
                    Performance Matrix
                </h2>
                <div className="font-playfair italic text-4xl md:text-6xl text-brand-obsidian leading-tight">
                    The Art of <span className="text-brand-gold">Alpha Generation</span>
                </div>
            </div>

            <div className="w-full max-w-5xl relative h-[400px]">
                {/* Y-Axis Labels */}
                <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-data text-xs text-brand-obsidian/40 hidden md:flex">
                    <span>+40%</span>
                    <span>+20%</span>
                    <span>0%</span>
                </div>

                <div className="relative w-full h-full ml-0 md:ml-12 border-b border-l border-brand-obsidian/10">

                    {/* SVG Chart */}
                    <svg
                        viewBox="0 0 1000 400"
                        className="w-full h-full overflow-visible drop-shadow-sm"
                        preserveAspectRatio="none"
                    >
                        {/* Nifty 50 Baseline (Dotted) */}
                        <path
                            d="M 0 350 Q 250 320, 500 250 T 1000 150"
                            fill="none"
                            stroke="#0D0D12"
                            strokeWidth="2"
                            strokeOpacity="0.2"
                            strokeDasharray="4 8"
                        />

                        {/* Alpha Logic Path */}
                        <path
                            ref={linePathRef}
                            d="M 0 350 C 200 340, 300 150, 450 180 S 700 80, 1000 40"
                            fill="none"
                            stroke="#C9A84C"
                            strokeWidth="4"
                            strokeLinecap="round"
                        />
                    </svg>

                    {/* Peak Labels */}
                    <div
                        ref={labelRef1}
                        className="absolute text-brand-obsidian bg-brand-ivory border border-brand-gold/30 px-3 py-1 rounded shadow-sm text-data font-bold text-xs md:text-sm"
                        style={{ left: '42%', top: '35%' }}
                    >
                        +22.4%
                    </div>
                    <div
                        ref={labelRef2}
                        className="absolute text-brand-gold bg-brand-obsidian px-3 py-1 rounded shadow-lg text-data font-bold text-xs md:text-sm"
                        style={{ left: '92%', top: '5%' }}
                    >
                        +38.2%
                    </div>
                </div>

                {/* Legend */}
                <div className="flex justify-center gap-8 mt-8 text-xs font-inter uppercase tracking-widest text-brand-obsidian/60">
                    <div className="flex items-center gap-2">
                        <div className="w-4 border-t-2 border-brand-gold" /> Alpha Logic
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 border-t-2 border-brand-obsidian/20 border-dotted" /> Nifty 50
                    </div>
                </div>
            </div>
        </section>
    );
};
