import { useState } from 'react';
import { Sparkles, Check, RefreshCw, X } from 'lucide-react';
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

    const fetchSuggestion = async () => {
        setLoading(true);
        setError('');
        setSuggestion('');

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

    const handleClose = () => {
        setOpen(false);
        setSuggestion('');
        setError('');
    };

    return (
        <div className="relative">
            {/* Trigger Button */}
            <button
                type="button"
                onClick={handleOpen}
                className={clsx(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                    "bg-purple-600/10 text-purple-400 border border-purple-500/20",
                    "hover:bg-purple-600/20 hover:text-purple-300 hover:border-purple-500/30",
                    "active:scale-95"
                )}
            >
                <Sparkles size={12} className="animate-sparkle" />
                {label}
            </button>

            {/* Suggestion Panel */}
            {open && (
                <div className="absolute z-50 top-full mt-2 left-0 right-0 sm:right-auto sm:min-w-[380px] max-w-md animate-fade-in">
                    <div className="glass-purple rounded-xl shadow-2xl shadow-purple-900/20 overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-purple-500/10">
                            <div className="flex items-center gap-2">
                                <Sparkles size={14} className="text-purple-400" />
                                <span className="text-xs font-semibold text-purple-300">AI Suggestion</span>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-1 text-zinc-500 hover:text-white rounded transition-colors"
                            >
                                <X size={14} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="px-4 py-4">
                            {loading ? (
                                <div className="space-y-2">
                                    <div className="h-3 w-3/4 animate-shimmer rounded" />
                                    <div className="h-3 w-full animate-shimmer rounded" />
                                    <div className="h-3 w-2/3 animate-shimmer rounded" />
                                </div>
                            ) : error ? (
                                <p className="text-xs text-red-400">{error}</p>
                            ) : (
                                <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap">
                                    {suggestion}
                                </p>
                            )}
                        </div>

                        {/* Actions */}
                        {!loading && suggestion && (
                            <div className="flex items-center gap-2 px-4 py-3 border-t border-purple-500/10 bg-purple-900/10">
                                <button
                                    onClick={handleAccept}
                                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium bg-purple-600 text-white hover:bg-purple-500 transition-colors"
                                >
                                    <Check size={12} /> Accept
                                </button>
                                <button
                                    onClick={fetchSuggestion}
                                    className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-700 transition-colors"
                                >
                                    <RefreshCw size={12} /> Retry
                                </button>
                                <button
                                    onClick={handleClose}
                                    className="inline-flex items-center justify-center py-2 px-3 rounded-lg text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors"
                                >
                                    Dismiss
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
