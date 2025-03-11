class JesusAI {
    constructor() {
        this.conversationHistory = [
            { role: 'system', content: config.systemPrompt }
        ];
    }

    cleanResponse(text) {
        console.log('Resposta original:', text);

        // Remove barras invertidas extras e chaves
        text = text
            .replace(/^\\{/, '') // Remove \{ do início
            .replace(/\\"/g, '"') // Remove barras invertidas antes das aspas
            .replace(/^\\\{|\\\}$/g, '') // Remove barras invertidas e chaves no início/fim
            .replace(/^\{|\}$/g, '') // Remove chaves simples no início/fim
            .replace(/^"|"$/g, '') // Remove aspas no início/fim
            .replace(/\\n/g, '\n') // Converte \n em quebras de linha reais
            .replace(/```[a-z]*\n?/g, '') // Remove blocos de código markdown
            .replace(/boxed/gi, '') // Remove a palavra 'boxed' (case insensitive)
            .trim(); // Remove espaços extras no início e fim

        // Se ainda houver um formato JSON com "resposta", tenta extrair
        if (text.includes('"resposta":')) {
            try {
                const match = text.match(/"resposta":\s*"([^"]+)"/);
                if (match && match[1]) {
                    text = match[1];
                }
            } catch (e) {
                console.error('Erro ao extrair resposta do JSON:', e);
            }
        }

        console.log('Resposta limpa:', text);
        return text;
    }

    async getResponse(userMessage) {
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
            console.log('Resposta da API:', data);

            let aiResponse = data.choices[0].message.content;

            // Limpa a resposta
            aiResponse = this.cleanResponse(aiResponse);

            if (!aiResponse) {
                console.error('Resposta vazia após limpeza');
                aiResponse = "Meu filho, perdoe-me, mas houve um problema ao processar minha resposta. Poderia reformular sua pergunta?";
            }

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