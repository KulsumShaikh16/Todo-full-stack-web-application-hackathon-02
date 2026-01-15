import { api } from './api';

export interface MessageResponse {
    id: number;
    role: 'user' | 'assistant';
    content: string;
    tool_calls?: string;
    created_at: string;
}

export interface ConversationListItem {
    id: number;
    title?: string;
    created_at: string;
    updated_at: string;
}

export interface ConversationResponse {
    id: number;
    title?: string;
    created_at: string;
    updated_at: string;
    messages: MessageResponse[];
}

export interface ChatRequest {
    message: string;
    conversation_id?: number;
}

export interface ChatResponse {
    conversation_id: number;
    response: string;
    tool_calls: Array<{
        tool: string;
        arguments: any;
        result: any;
    }>;
}

class ChatApiClient {
    private client = api;

    async sendMessage(message: string, conversationId?: number): Promise<ChatResponse> {
        return this.client.fetch<ChatResponse>('/api/chat', {
            method: 'POST',
            body: JSON.stringify({ message, conversation_id: conversationId }),
        });
    }

    async getConversations(): Promise<{ conversations: ConversationListItem[]; total: number }> {
        return this.client.fetch('/api/chat/conversations');
    }

    async getConversation(id: number): Promise<ConversationResponse> {
        return this.client.fetch(`/api/chat/conversations/${id}`);
    }

    async deleteConversation(id: number): Promise<{ status: string; message: string }> {
        return this.client.fetch(`/api/chat/conversations/${id}`, {
            method: 'DELETE',
        });
    }
}

export const chatApi = new ChatApiClient();
