import { useState } from 'react';
import { Sparkles, Check, RefreshCw, X, Copy } from 'lucide-react';
import { clsx } from 'clsx';

interface AISuggestProps {
    field: string;
    context: Record<string, string>;
    onAccept: (suggestion: string) => void;
    label?: string;
}

export function AISuggest({ field, context, onAccept, label = 'AI Suggest' }: AISuggestProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [suggestion, setSuggestion] = useState('');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const fetchSuggestion = async () => {
        setLoading(true);
        setError('');
        setSuggestion('');
        setCopied(false);

        try {
            const res = await fetch('/api/ai-suggest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ field, context }),
            });

            if (!res.ok) {
                throw new Error(`Server error ${res.status}`);
            }

            const data = await res.json();
            setSuggestion(data.suggestion || 'No suggestion available.');
        } catch (err: any) {
            setError(err.message || 'Failed to get suggestion');
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = () => {
        setOpen(true);
        fetchSuggestion();
    };

    const handleAccept = () => {
        onAccept(suggestion);
        setOpen(false);
        setSuggestion('');
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(suggestion);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClose = () => {
        setOpen(false);
        setSuggestion('');
        setError('');
    };

    return (
        <>
            {/* ─── Trigger Button ─── */}
            <button
                type="button"
                onClick={handleOpen}
                className={clsx(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
                    "bg-purple-600/15 text-purple-400 border border-purple-500/25",
                    "hover:bg-purple-600/25 hover:text-purple-300 hover:border-purple-500/40 hover:shadow-md hover:shadow-purple-900/20",
                    "active:scale-95"
                )}
            >
                <Sparkles size={12} />
                {label}
            </button>

            {/* ─── Modal Overlay ─── */}
            {open && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    onClick={handleClose}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" style={{ animation: 'fade-in 0.2s ease-out' }} />

                    {/* Modal */}
                    <div
                        className="relative w-full max-w-lg"
                        onClick={(e) => e.stopPropagation()}
                        style={{ animation: 'slide-up 0.3s ease-out' }}
                    >
                        <div className="bg-zinc-900 border border-zinc-700/60 rounded-2xl shadow-2xl shadow-purple-900/20 overflow-hidden">

                            {/* ── Header ── */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/60 bg-gradient-to-r from-purple-900/20 to-transparent">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-purple-600/20 rounded-xl flex items-center justify-center border border-purple-500/20">
                                        <Sparkles size={18} className="text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-white">AI Suggestion</h3>
                                        <p className="text-[11px] text-zinc-500 capitalize">{field.replace('_', ' ')} field</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {/* ── Content ── */}
                            <div className="px-6 py-5 min-h-[140px]">
                                {loading ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-5 h-5 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                                            <span className="text-xs text-purple-400 font-medium">Generating suggestion...</span>
                                        </div>
                                        <div className="h-4 w-4/5 bg-zinc-800 animate-shimmer rounded-md" />
                                        <div className="h-4 w-full bg-zinc-800 animate-shimmer rounded-md" />
                                        <div className="h-4 w-3/5 bg-zinc-800 animate-shimmer rounded-md" />
                                    </div>
                                ) : error ? (
                                    <div className="flex flex-col items-center justify-center py-6 text-center">
                                        <div className="w-12 h-12 bg-zinc-800/80 rounded-full flex items-center justify-center mb-3">
                                            <X size={20} className="text-zinc-500" />
                                        </div>
                                        <p className="text-sm text-zinc-400 mb-1">Something went wrong</p>
                                        <p className="text-xs text-zinc-600 mb-4">{error}</p>
                                        <button
                                            onClick={fetchSuggestion}
                                            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-purple-400 hover:text-purple-300 bg-purple-600/10 hover:bg-purple-600/20 rounded-lg transition-colors"
                                        >
                                            <RefreshCw size={12} /> Try Again
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/40">
                                            <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap">
                                                {suggestion}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* ── Actions ── */}
                            {!loading && suggestion && (
                                <div className="px-6 py-4 border-t border-zinc-800/60 bg-zinc-900/80 flex items-center gap-3">
                                    <button
                                        onClick={handleAccept}
                                        className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium bg-purple-600 text-white hover:bg-purple-500 transition-all shadow-lg shadow-purple-900/30"
                                    >
                                        <Check size={14} /> Use This
                                    </button>
                                    <button
                                        onClick={handleCopy}
                                        className={clsx(
                                            "inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium border transition-all",
                                            copied
                                                ? "text-purple-400 border-purple-500/30 bg-purple-600/10"
                                                : "text-zinc-400 border-zinc-700 hover:text-white hover:bg-zinc-800 hover:border-zinc-600"
                                        )}
                                    >
                                        <Copy size={14} /> {copied ? 'Copied!' : 'Copy'}
                                    </button>
                                    <button
                                        onClick={fetchSuggestion}
                                        className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-700 transition-all"
                                    >
                                        <RefreshCw size={14} /> Retry
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
