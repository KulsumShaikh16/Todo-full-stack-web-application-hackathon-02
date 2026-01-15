import React from 'react';
import { MessageResponse } from '../../lib/chat-api';
import { User, Bot, CheckCircle2, List, Trash2, Edit3, PlusCircle } from 'lucide-react';

interface ChatMessageProps {
    message: MessageResponse;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const isUser = message.role === 'user';

    const getToolIcon = (name: string) => {
        switch (name) {
            case 'add_task': return <PlusCircle size={14} className="text-green-400" />;
            case 'list_tasks': return <List size={14} className="text-blue-400" />;
            case 'complete_task': return <CheckCircle2 size={14} className="text-emerald-400" />;
            case 'delete_task': return <Trash2 size={14} className="text-red-400" />;
            case 'update_task': return <Edit3 size={14} className="text-amber-400" />;
            default: return null;
        }
    };

    return (
        <div className={`flex w-full mb-8 animate-in fade-in slide-in-from-${isUser ? 'right-4' : 'left-4'} duration-500`}>
            <div className={`flex w-full max-w-[85%] sm:max-w-[75%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto flex-row'}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-xl ${isUser
                        ? 'ml-3 bg-gradient-to-br from-blue-600 to-blue-700 shadow-[0_0_15px_rgba(37,99,235,0.3)]'
                        : 'mr-3 bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 shadow-lg'
                    }`}>
                    {isUser ? <User size={18} className="text-white" /> : <Bot size={18} className="text-blue-400" />}
                </div>

                <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} min-w-0`}>
                    <div className="flex items-center gap-2 mb-1 px-1">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">
                            {isUser ? 'You' : 'FocusFlow'}
                        </span>
                    </div>

                    <div className={`relative px-4 py-3 rounded-2xl shadow-xl transition-all ${isUser
                            ? 'bg-blue-600 text-white rounded-tr-none'
                            : 'bg-zinc-900/40 text-zinc-200 rounded-tl-none border border-white/5 backdrop-blur-md'
                        }`}>
                        <p className="text-[15px] leading-relaxed whitespace-pre-wrap font-medium">
                            {message.content}
                        </p>

                        {message.tool_calls && (
                            <div className={`mt-3 pt-3 border-t ${isUser ? 'border-white/20' : 'border-white/5'}`}>
                                <div className="flex items-center gap-1.5 mb-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                                    <span className={`text-[10px] uppercase tracking-tight font-bold ${isUser ? 'text-white/70' : 'text-zinc-400'}`}>
                                        Active Intelligence
                                    </span>
                                </div>
                                {(() => {
                                    try {
                                        const tools = JSON.parse(message.tool_calls);
                                        return (
                                            <div className="space-y-2">
                                                {tools.map((tc: any, i: number) => (
                                                    <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs leading-none border ${isUser ? 'bg-white/10 border-white/10' : 'bg-white/[0.03] border-white/5'
                                                        }`}>
                                                        {getToolIcon(tc.tool)}
                                                        <span className="font-semibold text-zinc-300 capitalize">{tc.tool.replace('_', ' ')}</span>
                                                        <span className="text-zinc-500 ml-auto font-mono text-[10px]">SUCCESS</span>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    } catch (e) {
                                        return null;
                                    }
                                })()}
                            </div>
                        )}
                    </div>

                    <span className="text-[10px] text-zinc-600 mt-2 px-1 font-medium">
                        {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </div>
        </div>
    );
};
