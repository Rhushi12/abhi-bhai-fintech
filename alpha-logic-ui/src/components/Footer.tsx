import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const Footer = () => {
    const btnRef = useRef<HTMLButtonElement>(null);
    const pulseRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Magnetic Button Effect
            const btn = btnRef.current;
            if (btn) {
                btn.addEventListener('mousemove', (e) => {
                    const rect = btn.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;

                    gsap.to(btn, {
                        x: x * 0.4,
                        y: y * 0.4,
                        duration: 0.8,
                        ease: 'power4.out',
                    });
                });

                btn.addEventListener('mouseleave', () => {
                    gsap.to(btn, {
                        x: 0,
                        y: 0,
                        duration: 0.8,
                        ease: 'power4.out',
                    });
                });
            }

            // System Operational Pulse
            gsap.to(pulseRef.current, {
                opacity: 0.4,
                scale: 1.5,
                duration: 1.5,
                repeat: -1,
                yoyo: true,
                ease: 'power1.inOut'
            });

        });

        return () => ctx.revert();
    }, []);

    return (
        <footer className="w-full bg-brand-obsidian text-brand-ivory relative overflow-hidden flex flex-col justify-between">
            {/* Top Section: Membership / CTA */}
            <div className="w-full py-32 px-8 md:px-16 flex flex-col items-center border-b border-brand-ivory/10">
                <div className="max-w-4xl mx-auto w-full text-center space-y-12">
                    <div className="font-jetbrains text-brand-gold uppercase tracking-widest text-xs md:text-sm">
                        [ INVITATION ONLY ]
                    </div>

                    <h2 className="font-playfair italic text-5xl md:text-7xl lg:text-8xl leading-tight">
                        Enter the Vanguard.
                    </h2>

                    <p className="font-inter text-brand-ivory/60 max-w-xl mx-auto text-lg md:text-xl">
                        Access to the Alpha Logic protocol is strictly limited. Sync your Smallcase account to initiate the sequence.
                    </p>

                    <div className="pt-8">
                        <button
                            ref={btnRef}
                            className="group relative px-12 py-5 bg-brand-gold text-brand-obsidian font-inter font-bold tracking-wide rounded-full overflow-hidden will-change-transform shadow-[0_0_30px_rgba(201,168,76,0.3)] hover:shadow-[0_0_50px_rgba(201,168,76,0.5)] transition-shadow duration-500"
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                Request Access
                                <svg
                                    className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </span>
                            <div className="absolute inset-0 bg-white translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] mix-blend-overlay opacity-50" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Footer Links & Status */}
            <div className="w-full py-12 px-8 md:px-16 flex flex-col md:flex-row justify-between items-center gap-8 font-jetbrains text-xs tracking-wider uppercase text-brand-ivory/40">

                <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center w-3 h-3">
                        <div ref={pulseRef} className="absolute inset-0 rounded-full bg-green-500" />
                        <div className="relative w-1.5 h-1.5 rounded-full bg-green-400" />
                    </div>
                    <span>System Operational</span>
                </div>

                <div className="flex gap-8">
                    <a href="#" className="hover:text-brand-gold transition-colors duration-300">MANIFESTO</a>
                    <a href="#" className="hover:text-brand-gold transition-colors duration-300">PROTOCOL</a>
                    <a href="#" className="hover:text-brand-gold transition-colors duration-300">LEGAL</a>
                </div>

                <div>
                    &copy; {new Date().getFullYear()} ALPHA LOGIC
                </div>

            </div>
        </footer>
    );
};
