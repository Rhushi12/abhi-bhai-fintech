import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const TheStrategist = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const signaturePathRef = useRef<SVGPathElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Content Reveal
            gsap.from(contentRef.current!.children, {
                y: 50,
                opacity: 0,
                duration: 1.2,
                stagger: 0.1,
                ease: 'power4.out',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 60%',
                }
            });

            // Signature Drawing Animation
            if (signaturePathRef.current) {
                const length = signaturePathRef.current.getTotalLength();
                gsap.set(signaturePathRef.current, {
                    strokeDasharray: length,
                    strokeDashoffset: length
                });

                gsap.to(signaturePathRef.current, {
                    strokeDashoffset: 0,
                    duration: 3,
                    ease: 'power2.inOut',
                    scrollTrigger: {
                        trigger: signaturePathRef.current,
                        start: 'top 80%',
                    }
                });
            }
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={containerRef}
            className="w-full bg-brand-ivory text-brand-obsidian py-32 flex flex-col items-center"
        >
            <div className="max-w-7xl mx-auto w-full px-8 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

                {/* Left Side: B&W Portrait */}
                <div className="relative aspect-[3/4] overflow-hidden group">
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] group-hover:scale-105"
                        style={{
                            backgroundImage: "url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1587&auto=format&fit=crop')",
                            filter: 'grayscale(100%) contrast(1.2)'
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-ivory via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Right Side: Minimalist Text */}
                <div ref={contentRef} className="flex flex-col justify-center space-y-12">
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-playfair italic leading-tight text-brand-obsidian">
                        "2 years of market preparation. One singular vision for Alpha."
                    </h2>

                    <div className="w-16 h-px bg-brand-gold" />

                    <div className="font-inter text-brand-obsidian/60 leading-relaxed max-w-md">
                        The convergence of institutional execution and retail accessibility. Every parameter is measured, every variable calculated. We do not guess. We synthesize pure signal.
                    </div>

                    {/* SVG Signature */}
                    <div className="mt-8 relative w-48 h-24">
                        <svg
                            viewBox="0 0 300 100"
                            className="w-full h-full drop-shadow-sm"
                            preserveAspectRatio="xMidYMid meet"
                        >
                            <path
                                ref={signaturePathRef}
                                d="M 30,70 C 50,20 80,10 90,40 C 100,70 70,80 60,60 C 50,40 100,50 120,50 
                                   M 140,50 L 140,80 M 140,65 L 160,65 M 180,50 C 180,50 160,80 180,80 C 200,80 190,50 190,50 L 210,80 L 230,50 L 230,80
                                   M 250,65 C 250,50 270,50 270,65 C 270,80 250,80 250,65"
                                fill="none"
                                stroke="#C9A84C"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <div className="absolute -bottom-4 right-8 font-inter text-[10px] tracking-widest uppercase text-brand-obsidian/40">
                            Chief Strategist
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};
