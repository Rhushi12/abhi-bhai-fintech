import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ADVANTAGES = [
    {
        number: "01.",
        title: "Institutional Permanence.",
        text: "Retail investors guess. We execute. Our Master Architect scrutinizes thousands of data points to identify mispriced assets before they hit the mainstream radar, constructing portfolios by hand."
    },
    {
        number: "02.",
        title: "Zero Emotional Drag.",
        text: "Markets are driven by fear and greed. By relying entirely on our 2-year backtested protocol, we remove human hesitation from the execution layer."
    },
    {
        number: "03.",
        title: "Absolute Alignment.",
        text: "We don't just build the buckets; we invest in them. The capital of our founders and engineers sits alongside our clients, ensuring our risk is identical to yours."
    }
];

export const AlphaEdge = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const parallaxTitleRef = useRef<HTMLHeadingElement>(null);
    const blocksRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        const title = titleRef.current;

        if (!canvas || !container || !title) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        // Set canvas resolution strictly
        canvas.width = 1920;
        canvas.height = 1080;

        const frameCount = 221;
        const currentFrame = (index: number) => (
            `/alpha-frames/frame_${index.toString().padStart(4, '0')}.webp`
        );

        const images: HTMLImageElement[] = [];
        const alpha = { frame: 0 };

        // Preload all 240 frames
        for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            img.src = currentFrame(i);
            images.push(img);
        }

        const render = () => {
            if (images[alpha.frame]) {
                // Object cover math
                const hRatio = canvas.width / images[alpha.frame].width;
                const vRatio = canvas.height / images[alpha.frame].height;
                const ratio = Math.max(hRatio, vRatio);
                const centerShift_x = (canvas.width - images[alpha.frame].width * ratio) / 2;
                const centerShift_y = (canvas.height - images[alpha.frame].height * ratio) / 2;

                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(images[alpha.frame], 0, 0, images[alpha.frame].width, images[alpha.frame].height,
                    centerShift_x, centerShift_y, images[alpha.frame].width * ratio, images[alpha.frame].height * ratio);
            }
        };

        // Enhance robust rendering for cached images and async loading
        const initialRender = () => {
            if (alpha.frame === 0) render();
        };

        if (images[0].complete) {
            initialRender();
        } else {
            images[0].onload = initialRender;
        }

        // Ensure late-loading images still render if they are the currently active frame
        images.forEach((img, idx) => {
            img.onload = () => {
                if (alpha.frame === idx) render();
            };
        });

        const ctx = gsap.context(() => {
            // Main Pin Timeline
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    start: "top top",
                    end: "+=3000",
                    scrub: 0.5,
                    pin: true,
                }
            });

            // 1. Scrub Canvas Frames
            tl.to(alpha, {
                frame: frameCount - 1,
                snap: "frame",
                ease: "none",
                onUpdate: render,
                duration: 1, // Timeline normalized duration
            }, 0);

            // 2. Title Movement (Start Center -> Top Left over 0-10% progress)
            tl.to(title, {
                top: "3rem", // ~48px
                left: "3rem",
                xPercent: 0,
                yPercent: 0,
                scale: 0.6,
                ease: "power2.inOut",
                duration: 0.15
            }, 0);

            // 3. Sequential Block Reveals (Bottom Right)
            // Block 01 at frame ~80 (80/240 = 33%)
            tl.fromTo(blocksRef.current[0],
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out' },
                0.33
            ).to(blocksRef.current[0], { opacity: 0, duration: 0.1 }, 0.55); // fade out before next

            // Block 02 at frame ~160 (160/240 = 66%)
            tl.fromTo(blocksRef.current[1],
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out' },
                0.66
            ).to(blocksRef.current[1], { opacity: 0, duration: 0.1 }, 0.88);

            // Block 03 at frame ~230 (230/240 = 95%) (Stays visible)
            tl.fromTo(blocksRef.current[2],
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out' },
                0.95
            );

        }, containerRef);

        // Natural Parallax Effect
        const handleMouseMove = (e: MouseEvent) => {
            const x = e.clientX - window.innerWidth / 2;
            const y = e.clientY - window.innerHeight / 2;

            // Layer 3 (Background): Canvas - 0.005 speed
            if (canvasRef.current) {
                gsap.to(canvasRef.current, {
                    x: x * 0.005,
                    y: y * 0.005,
                    duration: 1.2,
                    ease: "cubic-bezier(0.23, 1, 0.32, 1)"
                });
            }

            // Layer 2 (Midground): "Characters" / Title Representation - 0.02 speed
            if (parallaxTitleRef.current) {
                gsap.to(parallaxTitleRef.current, {
                    x: x * 0.02,
                    y: y * 0.02,
                    duration: 1.2,
                    ease: "cubic-bezier(0.23, 1, 0.32, 1)"
                });
            }

            // Layer 1 (Foreground): Text Blocks - 0.04 speed
            blocksRef.current.forEach(block => {
                if (block) {
                    gsap.to(block, {
                        x: x * 0.04,
                        y: y * 0.04,
                        duration: 1.2,
                        ease: "cubic-bezier(0.23, 1, 0.32, 1)"
                    });
                }
            });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            ctx.revert();
        };
    }, []);

    return (
        <section
            ref={containerRef}
            id="alpha-edge"
            className="w-full h-screen bg-brand-obsidian text-brand-obsidian overflow-hidden relative isolation border-t border-brand-obsidian/5"
        >
            {/* Background Canvas (Layer 3) */}
            <canvas
                ref={canvasRef}
                className="absolute w-[105vw] h-[105vh] -left-[2.5vw] -top-[2.5vh] object-cover z-0"
            />

            {/* Transforming Title */}
            <div
                ref={titleRef}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 origin-top-left pointer-events-none"
            >
                <h2
                    ref={parallaxTitleRef}
                    className="font-playfair italic tracking-tighter text-6xl md:text-8xl lg:text-[9rem] text-[#FAF9F6] leading-none drop-shadow-lg whitespace-nowrap [text-shadow:_0_4px_24px_rgb(0_0_0_/_80%)]"
                >
                    The Alpha <span style={{ fontFamily: "'hwcigars', serif" }}>Edge.</span>
                </h2>
            </div>

            {/* Right-Side Gradient for Contrast (Layer 2.5) */}
            <div className="absolute inset-y-0 right-0 w-full md:w-1/2 bg-gradient-to-l from-black/60 via-black/20 to-transparent z-10 pointer-events-none" />

            {/* Advantage Blocks Container (Bottom Right) (Layer 1) */}
            <div className="absolute bottom-8 right-8 md:bottom-16 md:right-16 z-20 w-full max-w-sm md:max-w-lg pointer-events-none">
                <div className="relative w-full h-56 md:h-64 pt-8">
                    {ADVANTAGES.map((advantage, idx) => (
                        <div
                            key={idx}
                            ref={(el) => { blocksRef.current[idx] = el; }}
                            className="absolute inset-0 flex flex-col justify-end opacity-0 pointer-events-auto"
                        >
                            <div className="flex flex-col gap-2 mb-4 px-3">
                                <div className="flex gap-4 items-baseline">
                                    <span className="font-playfair italic text-lg text-[#C9A84C] drop-shadow-md">
                                        {advantage.number}
                                    </span>
                                    <h4 className="font-inter font-bold text-xl md:text-2xl text-[#FAF9F6] uppercase tracking-widest drop-shadow-lg [text-shadow:_0_4px_24px_rgb(0_0_0_/_80%)]">
                                        {advantage.title}
                                    </h4>
                                </div>
                                <p className="font-inter text-[#FAF9F6] font-normal text-base md:text-lg leading-loose [text-shadow:_0_4px_24px_rgb(0_0_0_/_80%)]">
                                    {advantage.text}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
