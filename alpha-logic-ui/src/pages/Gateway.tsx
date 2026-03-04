import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const SCENES = {
    S1: '/videos/scene 1.mp4',
    S2: '/videos/scene 2.mp4',
    S3_1: '/videos/scene 3 1 first shot.mp4',
    S3_2: '/videos/scene 3 looped shop 2.mp4',
    S3_3: '/videos/scene 3 shot 3 back to original.mp4'
};

const isLoopingScene = (scene: string) => {
    return [SCENES.S1, SCENES.S2, SCENES.S3_2].includes(scene);
};

function getNextScene(current: string, target: string) {
    if (current === target) return current;

    if (current === SCENES.S3_2 || current === SCENES.S3_1) {
        if (target !== SCENES.S3_2) return SCENES.S3_3;
        if (current === SCENES.S3_1) return SCENES.S3_2;
    }

    if (current === SCENES.S3_3) {
        if (target === SCENES.S3_2) return SCENES.S3_1;
        return target;
    }

    if (target === SCENES.S3_2) {
        return SCENES.S3_1;
    }

    return target;
}

type VideoLayer = {
    id: string;
    src: string;
    loop: boolean;
};

function VideoLayerComponent({
    layer,
    isBase,
    onReady,
    onEnded
}: {
    layer: VideoLayer;
    isBase: boolean;
    onReady?: (id: string) => void;
    onEnded?: () => void;
}) {
    const [opacityClass, setOpacityClass] = useState('opacity-0');
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.loop = layer.loop;
        }
    }, [layer.loop]);

    const handleLoadedData = () => {
        setOpacityClass('opacity-100');
        if (onReady) onReady(layer.id);
    };

    return (
        <video
            ref={videoRef}
            src={layer.src}
            muted
            playsInline
            autoPlay
            onLoadedData={handleLoadedData}
            onEnded={onEnded}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1000ms] ease-in-out ${isBase ? 'opacity-100 z-0' : `${opacityClass} z-10`
                }`}
        />
    );
}

export function Gateway() {
    const navigate = useNavigate();
    const [layers, setLayers] = useState<VideoLayer[]>([
        { id: Date.now().toString(), src: SCENES.S1, loop: true }
    ]);

    const [currentScene, setCurrentScene] = useState(SCENES.S1);
    const [targetScene, setTargetScene] = useState(SCENES.S1);
    const [isSignUp, setIsSignUp] = useState(false);

    useEffect(() => {
        setLayers(prev => {
            if (prev.length === 0) return prev;

            const shouldLoop = currentScene === targetScene ? isLoopingScene(currentScene) : false;
            const currentTop = prev[prev.length - 1];

            if (currentTop.loop !== shouldLoop) {
                const newStack = [...prev];
                newStack[newStack.length - 1] = { ...currentTop, loop: shouldLoop };
                return newStack;
            }
            return prev;
        });
    }, [targetScene, currentScene]);

    const transitionToScene = useCallback((targetSrc: string, loop: boolean) => {
        setLayers(prev => {
            const currentTop = prev[prev.length - 1];
            if (currentTop?.src === targetSrc) {
                return prev;
            }
            return [...prev, { id: Math.random().toString(), src: targetSrc, loop }];
        });
    }, []);

    const handleLayerReady = useCallback((id: string) => {
        setTimeout(() => {
            setLayers(prev => {
                const targetIndex = prev.findIndex(l => l.id === id);
                if (targetIndex > 0) {
                    return prev.slice(targetIndex);
                }
                return prev;
            });
        }, 1200); // Extended from 600ms to 1200ms to guarantee overlap
    }, []);

    const handleVideoEnded = useCallback(() => {
        const nextScene = getNextScene(currentScene, targetScene);

        if (nextScene === currentScene) {
            transitionToScene(currentScene, true);
            return;
        }

        transitionToScene(nextScene, isLoopingScene(nextScene));
        setCurrentScene(nextScene);
    }, [currentScene, targetScene, transitionToScene]);

    const handleEmailFocus = () => setTargetScene(SCENES.S2);
    const handlePasswordFocus = () => setTargetScene(SCENES.S3_2);

    const handleBlur = () => {
        setTimeout(() => {
            if (document.activeElement?.tagName !== 'INPUT') {
                setTargetScene(SCENES.S1);
            }
        }, 50);
    };

    return (
        <div className="w-screen h-screen grid grid-cols-10 overflow-hidden selection:bg-[#0D0D12] selection:text-[#FAF8F5]">
            {/* The Video (Left 70%) with the Unifying Glaze tracking */}
            <div className="col-span-10 md:col-span-7 relative h-full bg-[#0D0D12] overflow-hidden filter brightness-95 contrast-[1.05] saturate-50">

                {layers.map((layer, index) => {
                    const isBase = index < layers.length - 1;
                    const isTop = index === layers.length - 1;

                    return (
                        <VideoLayerComponent
                            key={layer.id}
                            layer={layer}
                            isBase={isBase}
                            onReady={!isBase ? handleLayerReady : undefined}
                            onEnded={isTop ? handleVideoEnded : undefined}
                        />
                    );
                })}

                {/* The Unifying Glaze Overlay */}
                <div className="absolute inset-0 z-20 mix-blend-overlay bg-[#C9A84C]/10 pointer-events-none" />
                <div className="absolute inset-0 z-20 bg-black/10 pointer-events-none" />
            </div>

            {/* The Form (Right 30%) */}
            <div className="col-span-10 md:col-span-3 h-full flex flex-col justify-center px-8 md:px-12 xl:px-16 bg-[#FAF8F5] z-30 shadow-[-20px_0_40px_rgba(0,0,0,0.4)]">

                {/* Back to Home */}
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 mb-10 font-inter text-[11px] font-semibold text-slate-400 hover:text-[#0D0D12] uppercase tracking-[0.15em] transition-colors group w-fit"
                >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </button>

                <h1 className="font-playfair italic font-medium text-4xl lg:text-5xl text-[#0D0D12] mb-12 drop-shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
                    {isSignUp ? "Join The Reserve." : "The Reserve Awaits."}
                </h1>

                <form className="flex flex-col gap-8" onSubmit={(e) => e.preventDefault()}>

                    {/* FULL NAME Field (Only visibly rendered during Sign Up) */}
                    {isSignUp && (
                        <div className="flex flex-col gap-2 animate-fade-in-up">
                            <label className="font-inter text-xs font-semibold text-slate-500 uppercase tracking-[0.2em]">
                                Full Name
                            </label>
                            <input
                                type="text"
                                onFocus={handleEmailFocus}
                                onBlur={handleBlur}
                                placeholder="Satoshi Nakamoto"
                                className="w-full bg-transparent border-b border-slate-400 pb-3 font-jetbrains text-[#0D0D12] focus:outline-none focus:border-[#C9A84C] transition-colors placeholder:text-[#0D0D12]/20"
                            />
                        </div>
                    )}

                    {/* EMAIL Field */}
                    <div className="flex flex-col gap-2">
                        <label className="font-inter text-xs font-semibold text-slate-500 uppercase tracking-[0.2em]">
                            Email Address
                        </label>
                        <input
                            type="email"
                            onFocus={handleEmailFocus}
                            onBlur={handleBlur}
                            placeholder="your@institution.com"
                            className="w-full bg-transparent border-b border-slate-400 pb-3 font-jetbrains text-[#0D0D12] focus:outline-none focus:border-[#C9A84C] transition-colors placeholder:text-[#0D0D12]/20"
                        />
                    </div>

                    {/* PASSWORD Field */}
                    <div className="flex flex-col gap-2">
                        <label className="font-inter text-xs font-semibold text-slate-500 uppercase tracking-[0.2em]">
                            Password
                        </label>
                        <input
                            type="password"
                            onFocus={handlePasswordFocus}
                            onBlur={handleBlur}
                            placeholder="••••••••••••"
                            className="w-full bg-transparent border-b border-slate-400 pb-3 font-jetbrains text-[#0D0D12] focus:outline-none focus:border-[#C9A84C] transition-colors placeholder:text-[#0D0D12]/20"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        onFocus={handleBlur}
                        onMouseEnter={handleBlur}
                        type="submit"
                        className="mt-4 relative overflow-hidden bg-[#0D0D12] text-[#C9A84C] font-inter font-bold text-xs uppercase tracking-[0.25em] py-5 w-full transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-[1.05] shadow-[0_10px_30px_rgba(13,13,18,0.1)] hover:shadow-[0_15px_40px_rgba(13,13,18,0.2)] group"
                    >
                        <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                            {isSignUp ? "Create Account" : "Login"}
                        </span>
                        <div className="absolute inset-0 bg-[#C9A84C]/10 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]" />
                    </button>

                    {/* Toggle / Secondary Link */}
                    <button
                        type="button"
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-center font-inter text-[11px] font-semibold text-slate-400 hover:text-[#0D0D12] uppercase tracking-[0.1em] transition-colors"
                    >
                        {isSignUp ? "Already have an account? Login" : "Create an Account"}
                    </button>

                </form>

                <div className="text-center mt-10 font-jetbrains text-[10px] text-slate-400 uppercase tracking-widest">
                    End-to-end Encryption Enabled
                </div>
            </div>
        </div>
    );
}
