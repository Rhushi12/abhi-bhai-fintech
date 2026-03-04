import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

const NAV_LINKS = [
    { label: 'Protocol', href: '#protocol' },
    { label: 'Performance', href: '#performance' },
    { label: 'Archives', href: '#archives' },
];

const HIDE_NAV_SECTIONS = ['alpha-edge'];

export function NavBar() {
    const navRef = useRef<HTMLElement>(null);
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const hasEnteredRef = useRef(false);

    // GSAP entrance animation
    useEffect(() => {
        gsap.set(navRef.current, { y: -100, opacity: 0 });

        const timer = setTimeout(() => {
            gsap.to(navRef.current, {
                y: 0,
                opacity: 1,
                duration: 1.2,
                ease: 'power3.out',
                onComplete: () => {
                    hasEnteredRef.current = true;
                    if (navRef.current) {
                        navRef.current.style.opacity = '';
                        navRef.current.style.transform = '';
                    }
                },
            });
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    // Scroll-driven: section edge eats the navbar pixel-by-pixel
    const handleScroll = useCallback(() => {
        setScrolled(window.scrollY > 50);

        if (!hasEnteredRef.current || !navRef.current) return;

        const nav = navRef.current;
        const navHeight = nav.offsetHeight;
        let pushY = 0;

        for (const id of HIDE_NAV_SECTIONS) {
            const section = document.getElementById(id);
            if (!section) continue;

            const rect = section.getBoundingClientRect();

            // When section top enters the navbar zone, push navbar up
            if (rect.top < navHeight && rect.bottom > 0) {
                pushY = Math.max(pushY, navHeight - rect.top);
            }
        }

        pushY = Math.min(pushY, navHeight);
        nav.style.transform = `translateY(${-pushY}px)`;
        nav.style.pointerEvents = pushY >= navHeight ? 'none' : 'auto';
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const scrollToSection = (href: string) => {
        const el = document.querySelector(href);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const bgClass = scrolled
        ? 'bg-brand-ivory/80 backdrop-blur-xl shadow-[0_1px_0_rgba(13,13,18,0.06)]'
        : 'bg-transparent';

    return (
        <nav
            ref={navRef}
            className={`fixed top-0 left-0 right-0 z-[60] will-change-transform ${bgClass}`}
            style={{ opacity: 0, transition: 'background-color 0.5s, box-shadow 0.5s' }}
        >
            <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between h-16 md:h-20">
                {/* Logo / Wordmark */}
                <button
                    onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center gap-2 group"
                >
                    <span className="font-playfair italic text-xl md:text-2xl text-brand-obsidian tracking-tight group-hover:text-brand-gold transition-colors duration-300">
                        Alpha.
                    </span>
                </button>

                {/* Center Navigation Links */}
                <div className="hidden md:flex items-center gap-10">
                    {NAV_LINKS.map((link) => (
                        <button
                            key={link.label}
                            onClick={() => scrollToSection(link.href)}
                            className="relative font-inter text-[11px] font-semibold text-brand-obsidian/50 uppercase tracking-[0.2em] hover:text-brand-obsidian transition-colors duration-300 group"
                        >
                            {link.label}
                            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-brand-gold group-hover:w-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]" />
                        </button>
                    ))}
                </div>

                {/* CTA */}
                <button
                    onClick={() => navigate('/login')}
                    className="px-5 py-2 border border-brand-obsidian/15 text-brand-obsidian font-inter font-semibold text-[11px] uppercase tracking-[0.15em] rounded-full hover:bg-brand-obsidian hover:text-brand-ivory transition-all duration-400 hover:shadow-[0_4px_20px_rgba(13,13,18,0.15)]"
                >
                    Enter Gateway
                </button>
            </div>
        </nav>
    );
}
