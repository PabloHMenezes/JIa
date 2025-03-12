class Auth {
    constructor() {
        this.isLogin = true;
        this.setupListeners();
    }

    setupListeners() {
        const authForm = document.getElementById('authForm');
        const switchAuth = document.getElementById('switchAuth');
        const nameField = document.getElementById('nameField');
        const authTitle = document.getElementById('authTitle');
        const submitBtn = authForm.querySelector('.submit-btn span');

        switchAuth.addEventListener('click', (e) => {
            e.preventDefault();
            this.isLogin = !this.isLogin;
            
            // Atualiza a UI
            nameField.style.display = this.isLogin ? 'none' : 'block';
            authTitle.textContent = this.isLogin ? 'Login' : 'Registro';
            submitBtn.textContent = this.isLogin ? 'Entrar' : 'Registrar';
            switchAuth.textContent = this.isLogin ? 'Registrar-se' : 'Fazer Login';
        });

        authForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const name = document.getElementById('name').value;

            if (this.isLogin) {
                await this.login(email, password);
            } else {
                await this.register(email, password, name);
            }
        });
    }

    async login(email, password) {
        try {
            // Aqui você faria a chamada para sua API de login
            // Por enquanto, vamos simular com localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                // Login bem sucedido
                localStorage.setItem('currentUser', JSON.stringify({
                    name: user.name,
                    email: user.email
                }));
                this.updateUI(user);
                toggleLoginModal();
            } else {
                alert('Email ou senha incorretos');
            }
        } catch (error) {
            console.error('Erro no login:', error);
            alert('Erro ao fazer login');
        }
    }

    async register(email, password, name) {
        try {
            // Aqui você faria a chamada para sua API de registro
            // Por enquanto, vamos simular com localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            if (users.some(u => u.email === email)) {
                alert('Este email já está registrado');
                return;
            }

            users.push({ email, password, name });
            localStorage.setItem('users', JSON.stringify(users));

            // Auto-login após registro
            localStorage.setItem('currentUser', JSON.stringify({
                name,
                email
            }));

            this.updateUI({ name, email });
            toggleLoginModal();
        } catch (error) {
            console.error('Erro no registro:', error);
            alert('Erro ao registrar');
        }
    }

    updateUI(user) {
        // Atualiza o header com info do usuário
        const headerTitle = document.querySelector('.header-title');
        let userInfo = headerTitle.querySelector('.user-info');
        
        if (!userInfo) {
            userInfo = document.createElement('div');
            userInfo.className = 'user-info';
            headerTitle.appendChild(userInfo);
        }

        userInfo.innerHTML = `
            <span class="user-name">${user.name}</span>
            <button class="logout-btn" onclick="auth.logout()">
                <i class="fas fa-sign-out-alt"></i>
            </button>
        `;
    }

    logout() {
        localStorage.removeItem('currentUser');
        location.reload();
    }

    checkAuth() {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (user) {
            this.updateUI(user);
        }
    }
} 