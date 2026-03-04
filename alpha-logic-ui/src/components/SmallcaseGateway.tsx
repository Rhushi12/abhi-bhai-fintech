import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// 15+ Smallcase integrated brokers represented with elegant typography to mimic their logotypes
const BROKERS = [
    { name: "ZERODHA", id: "zerodha", font: "font-inter font-bold tracking-tight" },
    { name: "upstox", id: "upstox", font: "font-inter font-medium tracking-tight lowercase" },
    { name: "Groww", id: "groww", font: "font-inter font-bold tracking-tighter" },
    { name: "Angel One", id: "angelone", font: "font-serif font-bold italic" },
    { name: "ICICIdirect", id: "icici", font: "font-inter font-black tracking-tighter" },
    { name: "HDFC SKY", id: "hdfc", font: "font-inter font-bold tracking-widest text-[#0D0D12] bg-[#FAF8F5] px-2 py-1 rounded-sm text-sm" },
    { name: "kotak", id: "kotak", font: "font-inter font-bold text-red-500 lowercase" },
    { name: "MOTILAL OSWAL", id: "motilal", font: "font-serif font-semibold uppercase tracking-wider text-sm" },
    { name: "5paisa", id: "5paisa", font: "font-inter font-black italic tracking-tighter text-green-500" },
    { name: "Dhan", id: "dhan", font: "font-inter font-bold tracking-tight" },
    { name: "Alice Blue", id: "alice", font: "font-inter font-normal tracking-wide text-blue-400" },
    { name: "AXIS DIRECT", id: "axis", font: "font-inter font-bold uppercase tracking-wider text-red-400" },
    { name: "SBI Securities", id: "sbi", font: "font-inter font-medium tracking-wide" },
    { name: "Trustline", id: "trust", font: "font-inter font-semibold" },
    { name: "Fyers", id: "fyers", font: "font-inter font-bold italic tracking-tighter text-blue-500" },
];

export const SmallcaseGateway = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);
    const marqueeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 90%",
                    toggleActions: "play none none reverse"
                }
            });

            tl.fromTo(textRef.current,
                { opacity: 0, y: 15, letterSpacing: "0.1em" },
                { opacity: 1, y: 0, letterSpacing: "0.25em", duration: 1.2, ease: "power3.out" }
            )
                .fromTo(marqueeRef.current,
                    { opacity: 0 },
                    { opacity: 1, duration: 1.5, ease: "power2.out" },
                    "-=0.6"
                );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    // Duplicate array to create the infinite scroll effect seamlessly
    const marqueeItems = [...BROKERS, ...BROKERS];

    return (
        <section
            ref={containerRef}
            className="w-full bg-brand-obsidian py-20 md:py-32 border-t border-brand-ivory/10 flex flex-col items-center justify-center overflow-hidden relative"
        >
            <p
                ref={textRef}
                className="text-brand-ivory/50 text-xs md:text-sm font-jetbrains uppercase tracking-[0.25em] mb-16 px-4 text-center z-10"
            >
                Secured by Smallcase Gateway. Integrated with 15+ Brokers.
            </p>

            {/* Marquee Container */}
            <div
                ref={marqueeRef}
                className="w-full overflow-hidden flex whitespace-nowrap relative"
            >
                {/* Fade edges for smooth entry/exit */}
                <div className="absolute inset-y-0 left-0 w-24 md:w-64 bg-gradient-to-r from-brand-obsidian to-transparent z-10"></div>
                <div className="absolute inset-y-0 right-0 w-24 md:w-64 bg-gradient-to-l from-brand-obsidian to-transparent z-10"></div>

                {/* Animated Track */}
                <div className="flex animate-[marquee_40s_linear_infinite] items-center">
                    {marqueeItems.map((broker, index) => (
                        <div
                            key={`${broker.id}-${index}`}
                            className="flex items-center justify-center mx-8 md:mx-16 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-default select-none group"
                        >
                            {/* We use carefully selected typography styling to mimic the varied logotypes of these brokers */}
                            <span className={`text-brand-ivory text-xl md:text-3xl ${broker.font} group-hover:scale-110 transition-transform duration-300`}>
                                {broker.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Subtext */}
            <div className="mt-16 text-brand-ivory/30 text-xs font-inter max-w-xl text-center px-6">
                Connect your existing demat account in seconds.
                Zero friction, seamless execution, and absolute control over your assets.
            </div>
        </section>
    );
};
