
import { clsx } from 'clsx';

interface PaDenLoaderProps {
    fullScreen?: boolean;
}

export const PaDenLoader = ({ fullScreen = true }: PaDenLoaderProps) => {
    return (
        <div className={clsx(
            "flex flex-col items-center justify-center",
            fullScreen ? "fixed inset-0 z-50 bg-zinc-950/90 backdrop-blur-md" : "w-full min-h-[300px]"
        )}>
            {/* Background Effects (only for full screen) */}
            {fullScreen && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />
                </div>
            )}

            <div className="relative z-10 flex flex-col items-center">
                {/* Logo Container */}
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-purple-500/30 blur-2xl rounded-full animate-pulse-glow" />
                    <h1 className="relative text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white animate-shimmer bg-[length:200%_auto]"
                        style={{ fontFamily: "'Outfit', sans-serif" }}>
                        PaDen
                    </h1>
                </div>

                {/* Advanced Loading Bar */}
                <div className="w-64 h-1.5 bg-zinc-800/50 rounded-full overflow-hidden backdrop-blur-sm border border-white/5 mx-auto mb-4">
                    <div className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 animate-[shimmer_1.5s_infinite_linear] bg-[length:200%_100%]" />
                </div>

                {/* Status Text */}
                <p className="text-zinc-400 text-sm font-medium tracking-wide animate-pulse" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    Preparing your dashboard...
                </p>
            </div>
        </div>
    );
};
