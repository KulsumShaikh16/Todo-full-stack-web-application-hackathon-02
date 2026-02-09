'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { chatApi, MessageResponse, ConversationListItem } from '@/lib/chat-api';
import { ChatContainer } from '@/components/chat/ChatContainer';
import { ChatInput } from '@/components/chat/ChatInput';
import { ConversationSidebar } from '@/components/chat/ConversationSidebar';
import { LoadingPage } from '@/components/ui/loading';
import { Menu, X, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
        <div className="flex h-full w-full bg-transparent overflow-hidden">
            {/* Conversation Sidebar - Secondary */}
            <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative z-40 h-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]`}>
                <ConversationSidebar
                    conversations={conversations}
                    activeId={activeConversationId}
                    onSelect={loadMessages}
                    onNew={handleNewConversation}
                    onDelete={handleDeleteConversation}
                />
            </div>

            {/* Main Chat Content */}
            <div className="flex-1 flex flex-col relative bg-transparent">
                {/* Status Bar */}
                <div className="h-14 border-b border-white/5 flex items-center justify-between px-8 bg-black/20 backdrop-blur-md sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-25"></div>
                            <Sparkles size={14} className="text-blue-400 relative" />
                        </div>
                        <h2 className="text-[10px] font-black tracking-[0.3em] text-white uppercase">FocusFlow AI Terminal</h2>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Neural Link Latency: 24ms</span>
                    </div>
                </div>

                {/* Error Pulse */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mx-8 mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-[10px] font-black uppercase tracking-widest flex items-center justify-between"
                        >
                            <span className="flex items-center gap-2 italic">
                                <AlertCircle size={14} /> Error Detected: {error}
                            </span>
                            <button onClick={() => setError(null)}><X size={14} /></button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Messages Hub */}
                <div className="flex-1 overflow-hidden flex flex-col pt-4">
                    <ChatContainer messages={messages} isLoading={isLoading} />
                </div>

                {/* Input Matrix */}
                <div className="px-8 pb-8 pt-4">
                    <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
                </div>
            </div>

            {/* Mobile Toggle */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-600/40 text-white border border-white/20"
            >
                {isSidebarOpen ? <X /> : <Menu />}
            </button>
        </div>
    );
}
