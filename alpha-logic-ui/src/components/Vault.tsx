import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SHIELD_SVG = (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-brand-gold mb-6 shield-svg">
        <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path className="shield-inner" d="M12 8V16M12 12H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const LOCK_SVG = (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-brand-gold mb-6 lock-svg">
        <path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path className="lock-shackle" d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="16" r="1" fill="currentColor" />
    </svg>
);

const SERVER_SVG = (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-brand-gold mb-6 server-svg">
        <rect x="2" y="4" width="20" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle className="server-light" cx="6" cy="6.5" r="1" fill="currentColor" />
        <rect x="2" y="15" width="20" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle className="server-light" cx="6" cy="17.5" r="1" fill="currentColor" />
        <path className="server-data" d="M12 9V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const Vault = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Staggered Text and Card Reveal
            gsap.fromTo(".vault-reveal",
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    stagger: 0.15,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 75%",
                        toggleActions: "play none none reverse"
                    }
                }
            );

            // Infinite SVG Animations
            // Lock Shackle subtly unlocking / moving up
            gsap.to(".lock-shackle", {
                y: -2,
                duration: 1.5,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut"
            });

            // Server blinking lights
            gsap.to(".server-light", {
                opacity: 0.3,
                duration: 0.6,
                repeat: -1,
                yoyo: true,
                stagger: 0.4,
                ease: "power2.inOut"
            });

            // Server data processing flow
            gsap.fromTo(".server-data",
                { strokeDasharray: "2 4", strokeDashoffset: 12 },
                { strokeDashoffset: 0, duration: 1.2, repeat: -1, ease: "linear" }
            );

            // Shield inner scanning/drawing effect
            gsap.fromTo(".shield-inner",
                { strokeDasharray: 20, strokeDashoffset: 20 },
                { strokeDashoffset: 0, duration: 2.5, repeat: -1, yoyo: true, ease: "power2.inOut" }
            );

        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={containerRef}
            className="w-full bg-brand-obsidian py-24 md:py-36 px-6 relative overflow-hidden flex flex-col items-center"
        >
            <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay pointer-events-none"></div>

            <div className="max-w-7xl w-full z-10 flex flex-col md:flex-row gap-16 lg:gap-24" ref={contentRef}>

                {/* Left section: Headline */}
                <div className="md:w-[40%] flex flex-col justify-center items-start">
                    <div className="vault-reveal inline-flex items-center gap-3 mb-8 px-4 py-2 rounded-full border border-brand-gold/20 bg-brand-gold/5 backdrop-blur-md">
                        <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse"></span>
                        <p className="text-brand-gold text-xs font-jetbrains uppercase tracking-[0.2em] font-medium">
                            The Vault
                        </p>
                    </div>

                    <h2 className="vault-reveal text-5xl md:text-6xl lg:text-7xl font-playfair italic text-brand-ivory tracking-tight leading-[1.1] mb-8">
                        Uncompromising <br />
                        <span className="opacity-60 text-brand-ivory/50">Security.</span>
                    </h2>

                    <p className="vault-reveal text-brand-ivory/40 font-inter text-xs md:text-sm leading-loose max-w-xs font-medium tracking-widest uppercase mt-4">
                        Zero-Trust Architecture. <br /> Absolute Algorithmic Integrity.
                    </p>
                </div>

                {/* Right section: Sophisticated Grid */}
                <div className="md:w-[60%] grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
                    {/* Glowing background blob behind the grid */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-brand-gold/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

                    {/* Feature 1: Tall glass card */}
                    <div className="vault-reveal group sm:row-span-2 relative z-10 p-10 bg-[#0A0A0E]/80 backdrop-blur-xl border border-brand-ivory/5 hover:border-brand-gold/30 rounded-2xl transition-all duration-700 flex flex-col justify-between overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                        <div className="mb-12 relative z-10 transform group-hover:scale-110 transition-transform duration-700 origin-left">
                            {LOCK_SVG}
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-brand-ivory text-2xl font-playfair mb-3 leading-tight">Non-Custodial</h3>
                            <p className="text-brand-ivory/40 font-inter text-xs font-medium tracking-wide leading-relaxed">
                                Capital remains entirely in your personal brokerage account.
                            </p>
                        </div>
                    </div>

                    {/* Feature 2: Standard glass card */}
                    <div className="vault-reveal group relative z-10 p-8 bg-[#0A0A0E]/80 backdrop-blur-xl border border-brand-ivory/5 hover:border-brand-gold/30 rounded-2xl transition-all duration-700 flex flex-col shadow-xl">
                        <div className="absolute inset-0 bg-gradient-to-tr from-brand-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                        <div className="mb-6 relative z-10 transform group-hover:-translate-y-2 transition-transform duration-700 origin-center">
                            {SHIELD_SVG}
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-brand-ivory text-xl font-playfair mb-2">Encrypted</h3>
                            <p className="text-brand-ivory/40 font-inter text-xs font-medium tracking-wide leading-relaxed">
                                256-bit AES API security.
                            </p>
                        </div>
                    </div>

                    {/* Feature 3: Standard glass card */}
                    <div className="vault-reveal group relative z-10 p-8 bg-[#0A0A0E]/80 backdrop-blur-xl border border-brand-ivory/5 hover:border-brand-gold/30 rounded-2xl transition-all duration-700 flex flex-col shadow-xl">
                        <div className="absolute inset-0 bg-gradient-to-tl from-brand-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                        <div className="mb-6 relative z-10 transform group-hover:-translate-y-2 transition-transform duration-700 origin-center">
                            {SERVER_SVG}
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-brand-ivory text-xl font-playfair mb-2">Isolated</h3>
                            <p className="text-brand-ivory/40 font-inter text-xs font-medium tracking-wide leading-relaxed">
                                Zero-trust cloud enclaves.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
