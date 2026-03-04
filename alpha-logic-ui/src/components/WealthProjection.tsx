import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const WealthProjection = () => {
    const [investment, setInvestment] = useState(100000);
    const [years, setYears] = useState(5);
    const containerRef = useRef<HTMLDivElement>(null);
    const outputRef = useRef<HTMLDivElement>(null);

    const projectedValue = investment * Math.pow(1 + 0.24, years);

    // Format currency
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(value);
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(outputRef.current, {
                opacity: 0.5,
                y: 20,
                duration: 0.5,
                ease: 'power2.out'
            });
        }, outputRef);
        return () => ctx.revert();
    }, [investment, years]);

    return (
        <section
            ref={containerRef}
            className="w-full bg-[#121212] text-brand-ivory py-32 px-8 md:px-16 border-t border-brand-obsidian border-opacity-50"
        >
            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">

                {/* Left Side: Inputs */}
                <div className="flex flex-col space-y-16 lg:pr-16">
                    <div className="space-y-4 border-b border-brand-ivory/10 pb-8">
                        <h2 className="text-sm md:text-base font-inter font-semibold tracking-[0.2em] uppercase text-brand-ivory/40">
                            The Wealth Projection
                        </h2>
                        <h3 className="font-playfair italic text-4xl md:text-5xl text-brand-ivory">
                            Calculate the Impact.
                        </h3>
                    </div>

                    <div className="space-y-12">
                        {/* Slider 1: Initial Investment */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-end">
                                <label className="font-inter font-medium text-sm text-brand-ivory/60 uppercase tracking-widest">
                                    Initial Investment
                                </label>
                                <div className="font-jetbrains text-xl text-brand-gold font-bold">
                                    {formatCurrency(investment)}
                                </div>
                            </div>
                            <div className="relative w-full h-8 flex items-center">
                                {/* Custom Slider Track */}
                                <div className="absolute w-full h-1 bg-brand-ivory/10 rounded-full" />
                                {/* Custom Slider Fill */}
                                <div
                                    className="absolute h-1 bg-brand-gold rounded-full pointer-events-none"
                                    style={{ width: `${((investment - 50000) / (1000000 - 50000)) * 100}%` }}
                                />
                                <input
                                    type="range"
                                    min="50000"
                                    max="1000000"
                                    step="10000"
                                    value={investment}
                                    onChange={(e) => setInvestment(Number(e.target.value))}
                                    className="absolute w-full appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-brand-gold [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_15px_rgba(201,168,76,0.5)] [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:bg-brand-gold [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:rounded-full"
                                />
                            </div>
                            <div className="flex justify-between font-jetbrains text-xs text-brand-ivory/40">
                                <span>₹50k</span>
                                <span>₹10L</span>
                            </div>
                        </div>

                        {/* Slider 2: Time Horizon */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-end">
                                <label className="font-inter font-medium text-sm text-brand-ivory/60 uppercase tracking-widest">
                                    Time Horizon
                                </label>
                                <div className="font-jetbrains text-xl text-brand-gold font-bold">
                                    {years} {years === 1 ? 'Year' : 'Years'}
                                </div>
                            </div>
                            <div className="relative w-full h-8 flex items-center">
                                {/* Custom Slider Track */}
                                <div className="absolute w-full h-1 bg-brand-ivory/10 rounded-full" />
                                {/* Custom Slider Fill */}
                                <div
                                    className="absolute h-1 bg-brand-gold rounded-full pointer-events-none"
                                    style={{ width: `${((years - 1) / (10 - 1)) * 100}%` }}
                                />
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    step="1"
                                    value={years}
                                    onChange={(e) => setYears(Number(e.target.value))}
                                    className="absolute w-full appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-brand-gold [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_15px_rgba(201,168,76,0.5)] [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:bg-brand-gold [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:rounded-full"
                                />
                            </div>
                            <div className="flex justify-between font-jetbrains text-xs text-brand-ivory/40">
                                <span>1 YR</span>
                                <span>10 YRS</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Massive Output */}
                <div className="flex flex-col items-center lg:items-end text-center lg:text-right space-y-4">
                    <p className="font-inter text-sm md:text-base text-brand-ivory/60 uppercase tracking-widest mb-2">
                        Projected Total Return
                    </p>

                    <div
                        ref={outputRef}
                        className="font-playfair italic text-6xl md:text-8xl lg:text-[7rem] text-brand-gold leading-none drop-shadow-[0_0_40px_rgba(201,168,76,0.15)]"
                    >
                        {formatCurrency(projectedValue)}
                    </div>

                    <p className="font-jetbrains text-xs md:text-sm text-brand-ivory/30 pt-8 uppercase tracking-wider">
                        * Based on a projected 24% historical CAGR.
                    </p>
                </div>

            </div>
        </section>
    );
};
