import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const MarqueeTicker = () => {
    const tickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to(tickerRef.current, {
                xPercent: -50,
                ease: 'none',
                duration: 20,
                repeat: -1
            });
        }, tickerRef);

        return () => ctx.revert();
    }, []);

    const content = "[ THE_RESERVE_PERFORMANCE: +24.8% CAGR ] \u00A0\u00A0\u00A0 [ DISCRETIONARY_OVERSIGHT: ACTIVE ] \u00A0\u00A0\u00A0 [ PROTOCOL_STATUS: BESPOKE ]";

    return (
        <div className="w-full relative overflow-hidden bg-brand-obsidian text-brand-ivory py-3 border-y border-brand-ivory/10">
            {/* Glass light-leak blur edges */}
            <div className="absolute top-0 bottom-0 left-0 w-16 md:w-32 bg-gradient-to-r from-brand-obsidian to-transparent z-10 pointer-events-none backdrop-blur-sm mask-image:linear-gradient(to_right,black,transparent)" />
            <div className="absolute top-0 bottom-0 right-0 w-16 md:w-32 bg-gradient-to-l from-brand-obsidian to-transparent z-10 pointer-events-none backdrop-blur-sm mask-image:linear-gradient(to_left,black,transparent)" />

            <div className="flex whitespace-nowrap opacity-80" ref={tickerRef}>
                <div className="text-data text-xs md:text-sm tracking-widest text-brand-gold">
                    {content}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </div>
                <div className="text-data text-xs md:text-sm tracking-widest text-brand-gold">
                    {content}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </div>
                <div className="text-data text-xs md:text-sm tracking-widest text-brand-gold">
                    {content}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </div>
            </div>
        </div>
    );
};
