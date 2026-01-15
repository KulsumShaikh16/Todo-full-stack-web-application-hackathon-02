import React from 'react';
import { ConversationListItem } from '../../lib/chat-api';
import { MessageSquare, Plus, Trash2, Calendar, Target } from 'lucide-react';

interface ConversationSidebarProps {
    conversations: ConversationListItem[];
    activeId?: number;
    onSelect: (id: number) => void;
    onNew: () => void;
    onDelete: (id: number) => void;
}

export const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
    conversations,
    activeId,
    onSelect,
    onNew,
    onDelete,
}) => {
    return (
        <div className="w-72 sm:w-80 h-full border-r border-white/5 flex flex-col bg-black/60 backdrop-blur-3xl relative z-10 overflow-hidden">
            {/* Sidebar Header */}
            <div className="p-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[14px] flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Target size={20} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-white tracking-widest uppercase">FocusFlow</h2>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">Intelligence Suite</p>
                    </div>
                </div>

                <button
                    onClick={onNew}
                    className="w-full h-12 bg-white text-black hover:bg-zinc-200 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 shadow-xl active:scale-95 text-[13px] font-black uppercase tracking-wider"
                >
                    <Plus size={18} strokeWidth={3} />
                    New Stream
                </button>
            </div>

            <div className="px-6 mb-4 flex items-center justify-between">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">History</span>
                <div className="h-[1px] flex-1 bg-white/5 ml-4"></div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto px-3 space-y-1 custom-scrollbar">
                {conversations.length === 0 ? (
                    <div className="text-center py-20 px-8">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/5">
                            <MessageSquare size={20} className="text-zinc-700" />
                        </div>
                        <p className="text-xs text-zinc-600 font-medium">Your intelligence streams will appear here</p>
                    </div>
                ) : (
                    conversations.map((conv) => (
                        <div
                            key={conv.id}
                            className={`group relative flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 border ${activeId === conv.id
                                    ? 'bg-blue-600/10 border-blue-500/30 text-white'
                                    : 'border-transparent text-zinc-500 hover:bg-white/[0.03] hover:text-zinc-200'
                                }`}
                            onClick={() => onSelect(conv.id)}
                        >
                            {activeId === conv.id && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-full blur-[2px]"></div>
                            )}

                            <div className="flex-1 min-w-0">
                                <h4 className="text-[13px] font-bold truncate tracking-tight mb-1">
                                    {conv.title || 'Analysis Stream'}
                                </h4>
                                <div className="flex items-center gap-2 text-[10px] font-semibold text-zinc-600">
                                    <Calendar size={10} strokeWidth={3} />
                                    {new Date(conv.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </div>
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(conv.id);
                                }}
                                className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/20 hover:text-red-400 rounded-xl transition-all duration-200 text-zinc-600 active:scale-90"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Sidebar Footer */}
            <div className="p-6 mt-auto border-t border-white/5 bg-black/20">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600/20 to-purple-600/20 border border-white/10 flex items-center justify-center">
                            <Sparkles size={14} className="text-blue-400" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-white uppercase tracking-tight">System Status</p>
                            <p className="text-[9px] text-emerald-500 font-black uppercase">Operational</p>
                        </div>
                    </div>
                    <div className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[8px] text-zinc-500 font-black tracking-widest uppercase">
                        v2.1
                    </div>
                </div>
            </div>
        </div>
    );
};

const Sparkles = ({ size, className }: { size: number, className: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
        <path d="M5 3v4"></path>
        <path d="M19 17v4"></path>
        <path d="M3 5h4"></path>
        <path d="M17 19h4"></path>
    </svg>
);
