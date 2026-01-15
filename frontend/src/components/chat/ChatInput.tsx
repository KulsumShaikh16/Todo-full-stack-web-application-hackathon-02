import React, { useState, useRef, useEffect } from 'react';
import { SendHorizonal, Loader2, Sparkles } from 'lucide-react';

interface ChatInputProps {
    onSendMessage: (message: string) => void;
    isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
    const [message, setMessage] = useState('');
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (message.trim() && !isLoading) {
            onSendMessage(message.trim());
            setMessage('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
            inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 200)}px`;
        }
    }, [message]);

    return (
        <div className="max-w-4xl mx-auto w-full group">
            <div className="relative flex flex-col items-center">
                {/* Glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[24px] blur opacity-20 group-focus-within:opacity-40 transition duration-500"></div>

                <form
                    onSubmit={handleSubmit}
                    className="relative w-full bg-[#121212]/80 backdrop-blur-2xl border border-white/10 rounded-[22px] p-2 flex items-end gap-2 shadow-2xl transition-all duration-300 focus-within:border-white/20"
                >
                    <div className="flex-1 flex items-center min-h-[44px] pl-3">
                        <Sparkles size={16} className="text-zinc-600 mr-3 hidden sm:block" />
                        <textarea
                            ref={inputRef}
                            rows={1}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Message FocusFlow AI..."
                            disabled={isLoading}
                            className="w-full bg-transparent border-none text-[15px] text-zinc-100 placeholder-zinc-500 focus:ring-0 resize-none py-2.5 max-h-[200px] overflow-y-auto scrollbar-hide"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!message.trim() || isLoading}
                        className={`flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-[18px] transition-all duration-300 shadow-lg ${!message.trim() || isLoading
                                ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed opacity-50'
                                : 'bg-white text-black hover:scale-105 active:scale-95'
                            }`}
                    >
                        {isLoading ? <Loader2 size={18} className="animate-spin" /> : <SendHorizonal size={18} />}
                    </button>
                </form>

                <div className="flex items-center gap-4 mt-3">
                    <p className="text-[10px] text-zinc-500 font-medium tracking-tight uppercase">
                        Gemini 1.5 Flash Active
                    </p>
                    <span className="w-1 h-1 rounded-full bg-zinc-800"></span>
                    <p className="text-[10px] text-zinc-500 font-medium tracking-tight uppercase">
                        Contextual Memory Enabled
                    </p>
                </div>
            </div>
        </div>
    );
};
