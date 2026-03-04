import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

export const Hero = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const topCurtainRef = useRef<HTMLDivElement>(null);
    const bottomCurtainRef = useRef<HTMLDivElement>(null);
    const alphaTextRef = useRef<HTMLHeadingElement>(null);
    const subTextRef = useRef<HTMLDivElement>(null);
    const btnRef = useRef<HTMLButtonElement>(null);

    useLayoutEffect(() => {
        // Prevent browser from restoring previous scroll position on reload
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }

        // Force the page to start at the absolute top immediately before paint
        window.scrollTo(0, 0);

        // Lock scroll and block all pointer/touch interactions globally during preloader
        document.body.style.overflow = 'hidden';
        document.body.style.pointerEvents = 'none';

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                onComplete: () => {
                    // Unlock scroll and interactions after the cinematic sequence
                    document.body.style.overflow = '';
                    document.body.style.pointerEvents = '';
                }
            });

            // Initial State setup for fade elements
            gsap.set([subTextRef.current, btnRef.current], { opacity: 0, y: 20 });
            gsap.set(alphaTextRef.current, { color: '#FFFFFF' });

            // 1. The Spark: Color Shift (Wait 0.5s, then shift to Gold)
            tl.to(alphaTextRef.current, {
                color: '#C4A47C', // Champagne Gold
                duration: 1,
                ease: 'power2.inOut'
            }, 0.5);

            // 2. The Reveal: Curtains Split
            tl.to(topCurtainRef.current, {
                yPercent: -100,
                duration: 1.5,
                ease: 'power4.inOut' // Equivalent heavy ease
            }, "+=0.1");

            tl.to(bottomCurtainRef.current, {
                yPercent: 100,
                duration: 1.5,
                ease: 'power4.inOut'
            }, "<");

            // 3. The Fade-In: Hero Unveiling (at 50% of the curtain split)
            tl.to([subTextRef.current, btnRef.current], {
                opacity: 1,
                y: 0,
                duration: 1.2,
                stagger: 0.15,
                ease: 'power3.out'
            }, "-=0.75");

            // Magnetic Button Effect
            const btn = btnRef.current;
            if (btn) {
                const handleMouseMove = (e: MouseEvent) => {
                    const rect = btn.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;

                    gsap.to(btn, {
                        x: x * 0.4,
                        y: y * 0.4,
                        duration: 0.8,
                        ease: 'power4.out',
                    });
                };

                const handleMouseLeave = () => {
                    gsap.to(btn, {
                        x: 0,
                        y: 0,
                        duration: 0.8,
                        ease: 'power4.out',
                    });
                };

                btn.addEventListener('mousemove', handleMouseMove);
                btn.addEventListener('mouseleave', handleMouseLeave);

                return () => {
                    btn.removeEventListener('mousemove', handleMouseMove);
                    btn.removeEventListener('mouseleave', handleMouseLeave);
                };
            }
        }, containerRef);

        return () => {
            document.body.style.overflow = '';
            document.body.style.pointerEvents = '';
            ctx.revert();
        };
    }, []);

    return (
        <section
            ref={containerRef}
            className="relative w-full h-[100dvh] overflow-hidden bg-brand-ivory flex flex-col justify-center items-center p-8 md:p-16 lg:p-24"
        >
            {/* The Void: Preloader Curtains */}
            <div ref={topCurtainRef} className="fixed top-0 left-0 w-full h-[50vh] bg-[#0A0A0A] z-40 will-change-transform pointer-events-none" />
            <div ref={bottomCurtainRef} className="fixed bottom-0 left-0 w-full h-[50vh] bg-[#0A0A0A] z-40 will-change-transform pointer-events-none" />

            {/* Background Image: Light marble texture */}
            <div
                className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1620292788327-010ed19e075c?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat opacity-[0.15] mix-blend-multiply"
            />

            {/* Content Wrap (z-50 to stay above curtains for 'Alpha.' text) */}
            <div className="relative z-50 w-full max-w-7xl mx-auto flex flex-col items-center justify-center text-center gap-12 mt-16 pb-16">

                <div className="flex flex-col items-center gap-0">
                    <div ref={subTextRef} className="overflow-hidden pb-2 opacity-0">
                        <h1 className="text-brand-obsidian font-bold text-sm sm:text-lg md:text-2xl tracking-[0.3em] uppercase mb-4 opacity-80">
                            PRECISION BEYOND
                        </h1>
                    </div>
                    <div className="pb-4 px-4">
                        <h2
                            ref={alphaTextRef}
                            className="text-[#FFFFFF] font-playfair italic text-8xl md:text-[12rem] lg:text-[15rem] leading-[0.8] px-4 drop-shadow-sm will-change-transform"
                        >
                            Alpha.
                        </h2>
                    </div>
                </div>

                <button
                    ref={btnRef}
                    className="group relative px-10 py-4 border border-brand-obsidian/20 text-brand-obsidian font-inter font-medium tracking-wide rounded-full overflow-hidden will-change-transform bg-brand-ivory/50 backdrop-blur-md shadow-sm btn-hover-slide opacity-0"
                >
                    <span className="relative z-10 flex items-center gap-3 transition-colors duration-500 group-hover:text-brand-ivory">
                        Unlock the Bucket
                        <svg
                            className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </span>
                </button>

            </div>
        </section>
    );
};
