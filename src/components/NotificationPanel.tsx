import { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, CheckCheck, Building2, MessageSquare, Info, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { clsx } from 'clsx';

interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'property' | 'inquiry' | 'system';
    read: boolean;
    created_at: string;
}

export function NotificationPanel() {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.read).length;

    // Fetch notifications
    useEffect(() => {
        if (user) fetchNotifications();
    }, [user]);

    // Close on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        if (open) document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [open]);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', user?.id)
                .order('created_at', { ascending: false })
                .limit(20);

            if (error) {
                // Table might not exist yet — seed with welcome notification
                console.warn('Notifications table not found, using defaults');
                setNotifications([
                    {
                        id: 'welcome',
                        title: 'Welcome to Homify! 🏠',
                        message: 'Start by listing your first property. Our AI will help you write compelling descriptions.',
                        type: 'system',
                        read: false,
                        created_at: new Date().toISOString(),
                    },
                ]);
                return;
            }

            if (data && data.length > 0) {
                setNotifications(data);
            } else {
                // No notifications yet — show welcome
                setNotifications([
                    {
                        id: 'welcome',
                        title: 'Welcome to Homify! 🏠',
                        message: 'Start by listing your first property. Our AI will help you write compelling descriptions.',
                        type: 'system',
                        read: false,
                        created_at: new Date().toISOString(),
                    },
                ]);
            }
        } catch {
            console.error('Failed to fetch notifications');
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );

        if (id !== 'welcome') {
            await supabase
                .from('notifications')
                .update({ read: true })
                .eq('id', id);
        }
    };

    const markAllRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));

        if (user) {
            await supabase
                .from('notifications')
                .update({ read: true })
                .eq('user_id', user.id)
                .eq('read', false);
        }
    };

    const clearNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));

        if (id !== 'welcome') {
            supabase.from('notifications').delete().eq('id', id);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'property': return Building2;
            case 'inquiry': return MessageSquare;
            default: return Info;
        }
    };

    const getIconBg = (type: string) => {
        switch (type) {
            case 'property': return 'bg-purple-500/15 text-purple-400';
            case 'inquiry': return 'bg-violet-500/15 text-violet-400';
            default: return 'bg-zinc-700/30 text-zinc-400';
        }
    };

    const timeAgo = (date: string) => {
        const diff = Date.now() - new Date(date).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'Just now';
        if (mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    return (
        <div className="relative" ref={panelRef}>
            {/* Bell Button */}
            <button
                onClick={() => setOpen(!open)}
                className={clsx(
                    "relative p-2.5 rounded-xl transition-all",
                    open
                        ? "bg-purple-600/15 text-purple-400"
                        : "text-zinc-500 hover:text-white hover:bg-white/[0.04]"
                )}
            >
                <Bell size={18} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex items-center justify-center min-w-[16px] h-4 px-1 bg-purple-500 text-[9px] font-bold text-white rounded-full shadow-lg shadow-purple-500/40 animate-[scale-in_0.2s_ease-out]">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {open && (
                <div
                    className="absolute right-0 top-full mt-2 w-[340px] sm:w-[380px] max-h-[70vh] rounded-2xl overflow-hidden z-50 animate-fade-in"
                    style={{
                        background: 'rgba(15, 15, 18, 0.95)',
                        backdropFilter: 'blur(24px)',
                        WebkitBackdropFilter: 'blur(24px)',
                        border: '1px solid rgba(63, 63, 70, 0.3)',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 1px rgba(139, 92, 246, 0.1)',
                    }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.04]">
                        <div className="flex items-center gap-2.5">
                            <h3 className="text-sm font-semibold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                Notifications
                            </h3>
                            {unreadCount > 0 && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/20">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-1">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllRead}
                                    className="p-1.5 text-zinc-500 hover:text-purple-400 rounded-lg hover:bg-white/[0.04] transition-all"
                                    title="Mark all as read"
                                >
                                    <CheckCheck size={14} />
                                </button>
                            )}
                            <button
                                onClick={() => setOpen(false)}
                                className="p-1.5 text-zinc-500 hover:text-white rounded-lg hover:bg-white/[0.04] transition-all"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Notification List */}
                    <div className="overflow-y-auto max-h-[50vh] divide-y divide-white/[0.03]">
                        {loading ? (
                            <div className="p-8 flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-10 text-center">
                                <Bell size={24} className="text-zinc-700 mx-auto mb-3" />
                                <p className="text-sm text-zinc-500">No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map((n) => {
                                const Icon = getIcon(n.type);
                                return (
                                    <div
                                        key={n.id}
                                        className={clsx(
                                            "group flex gap-3 px-5 py-4 transition-all cursor-pointer relative",
                                            !n.read
                                                ? "bg-purple-500/[0.03]"
                                                : "hover:bg-white/[0.02]"
                                        )}
                                        onClick={() => markAsRead(n.id)}
                                    >
                                        {/* Unread indicator */}
                                        {!n.read && (
                                            <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-purple-500 rounded-full" />
                                        )}

                                        {/* Icon */}
                                        <div className={clsx("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5", getIconBg(n.type))}>
                                            <Icon size={14} />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <p className={clsx(
                                                "text-[13px] font-medium leading-tight mb-0.5",
                                                n.read ? "text-zinc-400" : "text-white"
                                            )}>
                                                {n.title}
                                            </p>
                                            <p className="text-[12px] text-zinc-500 leading-relaxed line-clamp-2">
                                                {n.message}
                                            </p>
                                            <p className="text-[10px] text-zinc-600 mt-1.5">
                                                {timeAgo(n.created_at)}
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-start gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {!n.read && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); markAsRead(n.id); }}
                                                    className="p-1 text-zinc-600 hover:text-purple-400 rounded transition-colors"
                                                    title="Mark as read"
                                                >
                                                    <Check size={12} />
                                                </button>
                                            )}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); clearNotification(n.id); }}
                                                className="p-1 text-zinc-600 hover:text-red-400 rounded transition-colors"
                                                title="Remove"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="px-5 py-3 border-t border-white/[0.04] text-center">
                            <p className="text-[11px] text-zinc-600">
                                {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
