// Inicializa a IA
const jesusAI = new JesusAI();

function toggleTheme() {
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

function updateJesusIcon(state) {
    const jesusIcon = document.getElementById('jesusIcon');
    if (jesusIcon) {
        jesusIcon.className = 'jesus-icon ' + state;
    }
}

function showTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.style.display = 'flex';
        // Garante que o indicador fique visível rolando a tela
        typingIndicator.scrollIntoView({ behavior: 'smooth' });
    }
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.style.display = 'none';
    }
}

async function sendMessage() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();
    
    if (message) {
        // Adiciona mensagem do usuário
        addMessage(message, 'user-message');
        input.value = '';

        // Atualiza o ícone para estado pensativo
        updateJesusIcon('thinking');
        
        // Mostra o indicador de digitação
        showTypingIndicator();

        try {
            // Atualiza o ícone para estado falando
            updateJesusIcon('speaking');
            
            // Obtém resposta da IA
            const response = await jesusAI.getResponse(message);
            
            // Esconde o indicador de digitação
            hideTypingIndicator();
            
            // Adiciona a resposta
            addMessage(response, 'ai-message');
            
            // Atualiza o ícone para estado sorrindo
            updateJesusIcon('smiling');
        } catch (error) {
            console.error('Erro:', error);
            hideTypingIndicator();
            addMessage('Meu filho, estou tendo dificuldades para processar sua mensagem. Por favor, tente novamente em alguns momentos.', 'ai-message');
            updateJesusIcon('smiling');
        }
    }
}

function addMessage(text, className) {
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
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// Menu functionality
const menuToggle = document.getElementById('menuToggle');
const sideMenu = document.getElementById('sideMenu');
const menuOverlay = document.getElementById('menuOverlay');
const closeMenu = document.getElementById('closeMenu');

// Adicionar eventos aos itens do menu
document.querySelector('.menu-items').addEventListener('click', async (e) => {
    const item = e.target.closest('li');
    if (!item) return;

    if (item.textContent.includes('Limpar conversa')) {
        location.reload();
        toggleMenu();
    } else if (item.textContent.includes('Compartilhar')) {
        toggleMenu();
        toggleCompartilharModal();
    } else if (item.textContent.includes('Sobre')) {
        toggleMenu();
        toggleModal();
    } else if (item.textContent.includes('Reportar erro')) {
        toggleMenu();
        toggleReportarModal();
    }
});

function toggleMenu() {
    sideMenu.classList.toggle('active');
    menuOverlay.classList.toggle('active');
}

menuToggle.addEventListener('click', toggleMenu);
closeMenu.addEventListener('click', toggleMenu);
menuOverlay.addEventListener('click', toggleMenu);

// Fechar menu com tecla Esc
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sideMenu.classList.contains('active')) {
        toggleMenu();
    }
});

// Prevenir propagação de cliques dentro do menu
sideMenu.addEventListener('click', (e) => {
    e.stopPropagation();
});

// Modal functionality
const sobreModal = document.getElementById('sobreModal');
const closeModalBtn = document.querySelector('.close-modal');

function toggleModal() {
    sobreModal.classList.toggle('active');
    document.body.style.overflow = sobreModal.classList.contains('active') ? 'hidden' : '';
}

// Fechar modal
closeModalBtn.addEventListener('click', toggleModal);
sobreModal.addEventListener('click', (e) => {
    if (e.target === sobreModal) {
        toggleModal();
    }
});

// Fechar modal com ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sobreModal.classList.contains('active')) {
        toggleModal();
    }
});

// Compartilhar functionality
const compartilharModal = document.getElementById('compartilharModal');
const shareLinkInput = document.getElementById('shareLink');
const copyLinkBtn = document.getElementById('copyLink');
const shareWhatsAppBtn = document.getElementById('shareWhatsApp');

function toggleCompartilharModal() {
    compartilharModal.classList.toggle('active');
    document.body.style.overflow = compartilharModal.classList.contains('active') ? 'hidden' : '';
    
    if (compartilharModal.classList.contains('active')) {
        const shareUrl = window.location.href;
        shareLinkInput.value = shareUrl;
        
        // Atualizar link do WhatsApp
        const shareText = encodeURIComponent("Venha conversar com seu melhor amigo!\n\n") + encodeURIComponent(shareUrl);
        shareWhatsAppBtn.href = `https://api.whatsapp.com/send?text=${shareText}`;
    }
}

// Copiar link
copyLinkBtn.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(shareLinkInput.value);
        
        copyLinkBtn.classList.add('copied');
        const originalText = copyLinkBtn.innerHTML;
        copyLinkBtn.innerHTML = '<i class="fas fa-check"></i> Copiado!';
        
        setTimeout(() => {
            copyLinkBtn.classList.remove('copied');
            copyLinkBtn.innerHTML = originalText;
        }, 2000);
    } catch (err) {
        console.error('Erro ao copiar:', err);
        alert('Não foi possível copiar o link. Por favor, tente novamente.');
    }
});

// Adicionar close handlers para o modal de compartilhamento
compartilharModal.querySelector('.close-modal').addEventListener('click', toggleCompartilharModal);
compartilharModal.addEventListener('click', (e) => {
    if (e.target === compartilharModal) {
        toggleCompartilharModal();
    }
});

// Atualizar ESC handler para incluir o modal de compartilhamento
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (sobreModal.classList.contains('active')) {
            toggleModal();
        } else if (compartilharModal.classList.contains('active')) {
            toggleCompartilharModal();
        }
    }
});

// Reportar erro functionality
const reportarModal = document.getElementById('reportarModal');
const reportForm = document.getElementById('reportForm');

function toggleReportarModal() {
    reportarModal.classList.toggle('active');
    document.body.style.overflow = reportarModal.classList.contains('active') ? 'hidden' : '';
}

// Handle form submission
reportForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const errorType = document.getElementById('errorType').value;
    const errorDescription = document.getElementById('errorDescription').value;
    const submitBtn = reportForm.querySelector('.submit-btn');
    
    // Aqui você pode implementar o envio real do relatório
    // Por enquanto, vamos apenas simular
    
    // Mostrar feedback de envio
    const originalText = submitBtn.innerHTML;
    submitBtn.classList.add('sent');
    submitBtn.innerHTML = '<i class="fas fa-check"></i> Relatório Enviado!';
    
    // Limpar formulário e fechar modal após delay
    setTimeout(() => {
        submitBtn.classList.remove('sent');
        submitBtn.innerHTML = originalText;
        reportForm.reset();
        toggleReportarModal();
    }, 2000);
});

// Adicionar close handlers para o modal de reporte
reportarModal.querySelector('.close-modal').addEventListener('click', toggleReportarModal);
reportarModal.addEventListener('click', (e) => {
    if (e.target === reportarModal) {
        toggleReportarModal();
    }
});

// Atualizar ESC handler para incluir o modal de reporte
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (sobreModal.classList.contains('active')) {
            toggleModal();
        } else if (compartilharModal.classList.contains('active')) {
            toggleCompartilharModal();
        } else if (reportarModal.classList.contains('active')) {
            toggleReportarModal();
        }
    }
}); 