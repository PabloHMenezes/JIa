class SoundManager {
    constructor() {
        this.enabled = localStorage.getItem('soundEnabled') === 'true';
        this.sounds = {
            typing: new Audio('sounds/typing.mp3'),
            message: new Audio('sounds/message.mp3')
        };
        
        // Configurar sons
        this.sounds.typing.loop = true; // Som de digitação em loop
        this.sounds.message.volume = 0.5; // Volume da mensagem mais baixo
        
        // Atualizar ícone do menu
        this.updateMenuIcon();
    }

    toggleSound() {
        this.enabled = !this.enabled;
        localStorage.setItem('soundEnabled', this.enabled);
        this.updateMenuIcon();
        return this.enabled;
    }

    updateMenuIcon() {
        const soundMenuItem = document.querySelector('.menu-items li:has(.fa-volume-up)');
        if (soundMenuItem) {
            const icon = soundMenuItem.querySelector('i');
            icon.className = this.enabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
            soundMenuItem.innerHTML = `${icon.outerHTML} ${this.enabled ? 'Desativar' : 'Ativar'} sons`;
        }
    }

    playTyping() {
        if (this.enabled) {
            this.sounds.typing.play().catch(() => {});
        }
    }

    stopTyping() {
        this.sounds.typing.pause();
        this.sounds.typing.currentTime = 0;
    }

    playMessage() {
        if (this.enabled) {
            this.sounds.message.play().catch(() => {});
        }
    }
} 