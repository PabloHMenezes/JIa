import { JesusAI } from './api';

// Inicializa a IA
const jesusAI = new JesusAI();

function toggleTheme(): void {
    const body = document.body;
    const themeIcon = document.querySelector('#themeToggle i');
    
    if (!themeIcon) return;

    if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
    }
}

function updateJesusIcon(state: 'thinking' | 'speaking' | 'smiling'): void {
    const jesusIcon = document.getElementById('jesusIcon');
    if (jesusIcon) {
        jesusIcon.className = 'jesus-icon ' + state;
    }
}

async function sendMessage(): Promise<void> {
    const input = document.getElementById('userInput') as HTMLInputElement;
    const message = input.value.trim();
    
    if (message) {
        // Adiciona mensagem do usuário
        addMessage(message, 'user-message');
        input.value = '';

        // Atualiza o ícone para estado pensativo
        updateJesusIcon('thinking');

        try {
            // Atualiza o ícone para estado falando
            updateJesusIcon('speaking');
            
            // Obtém resposta da IA
            const response = await jesusAI.getResponse(message);
            
            // Adiciona a resposta
            addMessage(response, 'ai-message');
            
            // Atualiza o ícone para estado sorrindo
            updateJesusIcon('smiling');
        } catch (error) {
            console.error('Erro:', error);
            addMessage('Meu filho, estou tendo dificuldades para processar sua mensagem. Por favor, tente novamente em alguns momentos.', 'ai-message');
            updateJesusIcon('smiling');
        }
    }
}

function addMessage(text: string, className: string): void {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${className}`;
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Verifica o tema salvo no localStorage
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        const themeIcon = document.querySelector('#themeToggle i');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }
});

// Adiciona o evento de clique ao botão de tema
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// Permite enviar mensagem com Enter
const userInput = document.getElementById('userInput');
if (userInput) {
    userInput.addEventListener('keypress', (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
} 