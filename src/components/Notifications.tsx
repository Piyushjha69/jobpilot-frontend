import { useState, useRef, useEffect } from "react";
import { Bell, FileText, Calendar, Gift, Info, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
    id: string;
    type: "application" | "interview" | "offer" | "system";
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
}

const mockNotifications: Notification[] = [
    {
        id: "1",
        type: "application",
        title: "Application Received",
        message: "Your application for Senior Frontend Developer at Stripe was received.",
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    {
        id: "2",
        type: "interview",
        title: "Interview Scheduled",
        message: "Your interview with Google is scheduled for tomorrow at 2:00 PM.",
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
        id: "3",
        type: "offer",
        title: "New Offer",
        message: "Congratulations! You received an offer from Meta.",
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
        id: "4",
        type: "system",
        title: "Profile Update",
        message: "Complete your profile to improve job matches.",
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },
];

const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
        case "application":
            return FileText;
        case "interview":
            return Calendar;
        case "offer":
            return Gift;
        case "system":
            return Info;
    }
};

const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
};

export function Notifications() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter((n) => !n.read).length;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const dismissNotification = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all"
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs font-medium bg-violet-500 text-white rounded-full">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[#111111] border border-white/5 rounded-xl shadow-xl z-50 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                        <h3 className="text-sm font-semibold text-white">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors"
                            >
                                <Check className="h-3 w-3" />
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="px-4 py-8 text-center text-white/40 text-sm">
                                No new notifications
                            </div>
                        ) : (
                            notifications.map((notification) => {
                                const Icon = getNotificationIcon(notification.type);
                                return (
                                    <div
                                        key={notification.id}
                                        className={cn(
                                            "group flex gap-3 px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer",
                                            !notification.read && "bg-violet-500/5"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center",
                                                !notification.read
                                                    ? "bg-violet-500/20 text-violet-400"
                                                    : "bg-white/5 text-white/40"
                                            )}
                                        >
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <p
                                                    className={cn(
                                                        "text-sm font-medium truncate",
                                                        !notification.read ? "text-white" : "text-white/60"
                                                    )}
                                                >
                                                    {notification.title}
                                                </p>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        dismissNotification(notification.id);
                                                    }}
                                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded transition-all"
                                                >
                                                    <X className="h-3 w-3 text-white/40" />
                                                </button>
                                            </div>
                                            <p className="text-xs text-white/40 mt-0.5 line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-white/30 mt-1">
                                                {formatTimeAgo(notification.createdAt)}
                                            </p>
                                        </div>
                                        {!notification.read && (
                                            <div className="flex-shrink-0 h-2 w-2 rounded-full bg-violet-500 mt-2" />
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Notifications;
