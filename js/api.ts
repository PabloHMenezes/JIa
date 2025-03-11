import { config } from './config';

interface Message {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export class JesusAI {
    private conversationHistory: Message[];

    constructor() {
        this.conversationHistory = [
            { role: 'system', content: config.systemPrompt }
        ];
    }

    async getResponse(userMessage: string): Promise<string> {
        try {
            // Adiciona a mensagem do usuário ao histórico
            this.conversationHistory.push({ role: 'user', content: userMessage });

            // Faz a chamada à API
            const response = await fetch(config.apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${config.apiKey}`,
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'Conversa com Jesus',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: config.model,
                    messages: this.conversationHistory
                })
            });

            if (!response.ok) {
                throw new Error('Erro na chamada da API');
            }

            const data = await response.json();
            const aiResponse = data.choices[0].message.content;

            // Adiciona a resposta ao histórico
            this.conversationHistory.push({ role: 'assistant', content: aiResponse });

            // Mantém apenas as últimas 10 mensagens para não sobrecarregar
            if (this.conversationHistory.length > 11) { // 1 system + 10 mensagens
                this.conversationHistory = [
                    this.conversationHistory[0],
                    ...this.conversationHistory.slice(-10)
                ];
            }

            return aiResponse;
        } catch (error) {
            console.error('Erro:', error);
            return "Meu filho, estou tendo dificuldades para processar sua mensagem. Por favor, tente novamente em alguns momentos.";
        }
    }
} 