import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const faqs = [
    {
        question: "How does the discretionary trading system work?",
        answer: "The Master Architect continuously analyzes market data, identifying patterns and structuring positions based on predefined, meticulously backtested frameworks. The entire process is hand-curated to ensure supreme discretion over capital."
    },
    {
        question: "Are my funds actually secure?",
        answer: "Yes. We operate on a strictly non-custodial model. Your funds remain entirely in your own brokerage account (like Zerodha, Groww, or Upstox) via the Smallcase Gateway. We only have authorization to execute trades."
    },
    {
        question: "Can I withdraw my capital at any time?",
        answer: "Absolutely. Since your funds are stored in your own demat/brokerage account, you retain complete liquidity and control. You can halt the strategy deployment and withdraw your funds whenever you choose."
    },
    {
        question: "What happens during severe market crashes?",
        answer: "Our protocols are designed with built-in risk management. Depending on the architecture, the Master Architect may hedge positions, tighten stop-losses, or exit to cash entirely during periods of extreme volatility to preserve your capital."
    }
];

export const KnowledgeBase = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(textRef.current,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section
            ref={containerRef}
            className="w-full bg-brand-ivory py-24 md:py-32 px-6 flex flex-col items-center border-t border-brand-obsidian/10"
        >
            <div ref={textRef} className="max-w-4xl w-full flex flex-col items-center">
                <p className="text-brand-obsidian/40 text-xs font-jetbrains uppercase tracking-[0.2em] mb-4 text-center">
                    Knowledge Base
                </p>
                <h2 className="text-4xl md:text-5xl font-serif text-brand-obsidian text-center mb-16 tracking-tight">
                    Frequently Asked Questions
                </h2>

                <div className="w-full space-y-4">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div
                                key={index}
                                className="group border border-brand-obsidian/10 hover:border-brand-obsidian/30 bg-white/50 backdrop-blur-sm transition-all duration-300 rounded-sm overflow-hidden"
                            >
                                <button
                                    onClick={() => toggleAccordion(index)}
                                    className="w-full flex justify-between items-center p-6 text-left cursor-pointer outline-none"
                                >
                                    <span className="font-inter font-medium text-lg md:text-xl text-brand-obsidian group-hover:text-brand-gold transition-colors duration-300">
                                        {faq.question}
                                    </span>
                                    <span className={`text-brand-gold font-jetbrains text-2xl transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
                                        +
                                    </span>
                                </button>

                                <div
                                    className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                                >
                                    <p className="p-6 pt-0 text-brand-obsidian/70 font-inter leading-relaxed text-sm md:text-base">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
