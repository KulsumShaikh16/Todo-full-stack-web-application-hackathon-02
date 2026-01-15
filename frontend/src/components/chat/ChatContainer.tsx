import React, { useRef, useEffect } from 'react';
import { MessageResponse } from '../../lib/chat-api';
import { ChatMessage } from './ChatMessage';
import { Loader2, Sparkles, Zap, Shield, Rocket } from 'lucide-react';

interface ChatContainerProps {
    messages: MessageResponse[];
    isLoading: boolean;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({ messages, isLoading }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    return (
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 custom-scrollbar" ref={scrollRef}>
            <div className="max-w-4xl mx-auto">
                {messages.length === 0 && !isLoading && (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in zoom-in-95 duration-1000">
                        {/* Hero Icon */}
                        <div className="relative mb-8">
                            <div className="absolute -inset-4 bg-blue-600/20 rounded-full blur-2xl animate-pulse"></div>
                            <div className="relative w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl border border-white/20 transform rotate-3">
                                <Sparkles className="text-white" size={40} />
                            </div>
                        </div>

                        <h2 className="text-3xl font-black text-white mb-4 tracking-tighter">
                            FocusFlow <span className="text-blue-500">Intelligence</span>
                        </h2>
                        <p className="text-zinc-400 max-w-sm mx-auto text-[15px] leading-relaxed mb-10 font-medium">
                            Experience the future of task management. I can help you organize, track, and complete your goals with simple requests.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl px-4">
                            {[
                                { icon: <Zap size={16} className="text-amber-400" />, text: "Add a task to buy groceries tomorrow morning", title: "Instant Action" },
                                { icon: <List size={16} className="text-blue-400" />, text: "List all my pending tasks from this week", title: "Task Insight" },
                                { icon: <Shield size={16} className="text-emerald-400" />, text: "Mark the 'Submit Report' task as completed", title: "Easy Execution" },
                                { icon: <Rocket size={16} className="text-purple-400" />, text: "Help me organize a plan for my new project", title: "Strategic Planning" }
                            ].map((item, i) => (
                                <div key={i} className="group text-left bg-zinc-900/40 border border-white/5 p-4 rounded-2xl hover:bg-zinc-800/60 hover:border-blue-500/30 transition-all cursor-pointer backdrop-blur-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                        {item.icon}
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 group-hover:text-blue-400 transition-colors">{item.title}</span>
                                    </div>
                                    <p className="text-sm text-zinc-300 font-medium italic opacity-70 group-hover:opacity-100 transition-opacity">
                                        "{item.text}"
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    {messages.map((msg) => (
                        <ChatMessage key={msg.id} message={msg} />
                    ))}
                </div>

                {isLoading && (
                    <div className="flex justify-start mb-8 animate-in fade-in slide-in-from-left-4 duration-300">
                        <div className="flex items-center space-x-3 bg-zinc-900/40 px-5 py-3 rounded-2xl rounded-tl-none border border-white/5 backdrop-blur-xl shadow-xl">
                            <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            </div>
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Processing</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Helper for icon mapping
const List = ({ size, className }: { size: number, className: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="8" y1="6" x2="21" y2="6"></line>
        <line x1="8" y1="12" x2="21" y2="12"></line>
        <line x1="8" y1="18" x2="21" y2="18"></line>
        <line x1="3" y1="6" x2="3.01" y2="6"></line>
        <line x1="3" y1="12" x2="3.01" y2="12"></line>
        <line x1="3" y1="18" x2="3.01" y2="18"></line>
    </svg>
);
