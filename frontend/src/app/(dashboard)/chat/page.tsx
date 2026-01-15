'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { chatApi, MessageResponse, ConversationListItem } from '@/lib/chat-api';
import { ChatContainer } from '@/components/chat/ChatContainer';
import { ChatInput } from '@/components/chat/ChatInput';
import { ConversationSidebar } from '@/components/chat/ConversationSidebar';
import { LoadingPage } from '@/components/ui/loading';
import { LogOut, LayoutDashboard, Menu, X, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function ChatPage() {
    const { user, logout } = useAuth();
    const [conversations, setConversations] = useState<ConversationListItem[]>([]);
    const [activeConversationId, setActiveConversationId] = useState<number | undefined>();
    const [messages, setMessages] = useState<MessageResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadConversations = useCallback(async () => {
        setError(null);
        try {
            const data = await chatApi.getConversations();
            setConversations(data.conversations);
        } catch (err) {
            console.error('Failed to load conversations', err);
            setError('Failed to load conversations');
        } finally {
            setInitialLoading(false);
        }
    }, []);

    const loadMessages = useCallback(async (id: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await chatApi.getConversation(id);
            setMessages(data.messages);
            setActiveConversationId(id);
        } catch (err) {
            console.error('Failed to load messages', err);
            setError('Failed to load message history');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadConversations();
    }, [loadConversations]);

    useEffect(() => {
        if (activeConversationId) {
            loadMessages(activeConversationId);
        }
    }, [activeConversationId, loadMessages]);

    const handleSendMessage = async (text: string) => {
        const tempUserMsg: MessageResponse = {
            id: Date.now(),
            role: 'user',
            content: text,
            created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, tempUserMsg]);
        setIsLoading(true);
        setError(null);

        try {
            const response = await chatApi.sendMessage(text, activeConversationId);

            if (!activeConversationId) {
                setActiveConversationId(response.conversation_id);
                loadConversations();
            }

            const assistantMsg: MessageResponse = {
                id: Date.now() + 1,
                role: 'assistant',
                content: response.response,
                tool_calls: JSON.stringify(response.tool_calls),
                created_at: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, assistantMsg]);
        } catch (err) {
            console.error('Failed to send message', err);
            setError(err instanceof Error ? err.message : 'Failed to get a response from the AI');
        } finally {
            setIsLoading(false);
        }
    };

    const handleNewConversation = () => {
        setActiveConversationId(undefined);
        setMessages([]);
    };

    const handleDeleteConversation = async (id: number) => {
        try {
            await chatApi.deleteConversation(id);
            if (activeConversationId === id) {
                setActiveConversationId(undefined);
                setMessages([]);
            }
            loadConversations();
        } catch (err) {
            console.error('Failed to delete conversation', err);
        }
    };

    if (initialLoading) return <LoadingPage />;

    return (
        <div className="flex h-screen bg-[#020202] text-zinc-100 overflow-hidden font-sans selection:bg-blue-500/30">
            {/* Background Decorative Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Mobile Sidebar Toggle */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:scale-105 active:scale-95 transition-all text-white border border-white/20"
            >
                {isSidebarOpen ? <X /> : <Menu />}
            </button>

            {/* Sidebar */}
            <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative z-40 h-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]`}>
                <ConversationSidebar
                    conversations={conversations}
                    activeId={activeConversationId}
                    onSelect={loadMessages}
                    onNew={handleNewConversation}
                    onDelete={handleDeleteConversation}
                />
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col relative bg-transparent backdrop-blur-[2px]">
                {/* Header */}
                <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-black/40 backdrop-blur-xl sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <Link href="/todos" className="group flex items-center gap-2 text-zinc-400 hover:text-white transition-all duration-300">
                            <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                                <LayoutDashboard size={18} />
                            </div>
                            <span className="font-medium hidden sm:inline text-sm tracking-tight text-white/70 group-hover:text-white">Dashboard</span>
                        </Link>
                        <div className="h-4 w-[1px] bg-white/10 hidden sm:block"></div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                                <Sparkles size={16} className="text-blue-400 relative" />
                            </div>
                            <h1 className="text-sm font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent uppercase">
                                FocusFlow AI
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-xs font-semibold text-zinc-200">{user?.name || 'User'}</span>
                            <span className="text-[10px] text-zinc-500 font-medium">{user?.email}</span>
                        </div>
                        <div className="h-8 w-[1px] bg-white/10 ml-2"></div>
                        <button
                            onClick={() => logout()}
                            className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-300"
                            title="Logout"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </header>

                {/* Chat Content */}
                <div className="flex-1 relative overflow-hidden flex flex-col">
                    {error && (
                        <div className="mx-6 mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                                    <X size={14} />
                                </div>
                                <span className="font-medium">{error}</span>
                            </div>
                            <button
                                onClick={() => setError(null)}
                                className="text-red-400/50 hover:text-red-400 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}
                    <ChatContainer messages={messages} isLoading={isLoading} />
                </div>

                {/* Input Area */}
                <div className="relative z-10 px-4 pb-4">
                    <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
                </div>
            </div>
        </div>
    );
}
