//cadastro de usuario
"use strict";

const DEFAULT_PROFILE_PIC = "https://raw.githubusercontent.com/Thallys-San/ArtemiScore/main/profile_pic.png";

document.addEventListener("DOMContentLoaded", async function() {
    const form = document.getElementById("registerForm");
    const bioInput = document.getElementById("bio");
    const charCount = document.getElementById("charCount");
    const avatarInput = document.getElementById("avatarUpload");
    const genresSelect = document.getElementById("favorite-genres");
    const genreWarning = document.getElementById("genre-warning");
    const platformsSelect = document.getElementById("preferred-platforms");
    const platformsWarning = document.getElementById("platform-warning");

    let profilePicBase64 = DEFAULT_PROFILE_PIC;

    // Mostra imagem padrão ao carregar a página
    document.getElementById("avatarPreview").style.backgroundImage = `url('${DEFAULT_PROFILE_PIC}')`;

    // Atualiza o contador de caracteres do campo biografia
    bioInput.addEventListener("input", () => {
        const currentLength = bioInput.value.length;
        charCount.textContent = `(${currentLength}/300)`;
    });

    // Configura seleção múltipla com clique único
    function setupMultipleSelect(selectElement, maxSelections, warningElement) {
        selectElement.addEventListener('mousedown', function(e) {
            e.preventDefault();

            const option = e.target;
            if (option.tagName !== 'OPTION') return;

            const wasSelected = option.selected;

            if (!wasSelected && this.selectedOptions.length >= maxSelections) {
                warningElement.style.display = "inline";
                return;
            }

            option.selected = !option.selected;

            if (this.selectedOptions.length > maxSelections) {
                option.selected = false;
                warningElement.style.display = "inline";
            } else {
                warningElement.style.display = "none";
            }

            this.dispatchEvent(new Event('change'));
        });
    }

    // Configura os selects
    setupMultipleSelect(genresSelect, 5, genreWarning);
    setupMultipleSelect(platformsSelect, 3, platformsWarning);

    // Converte imagem carregada localmente para Base64
    avatarInput.addEventListener("change", () => {
        const file = avatarInput.files[0];

        if (file && file.size <= 2 * 1024 * 1024) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profilePicBase64 = e.target.result;
                document.getElementById("avatarPreview").style.backgroundImage = `url('${profilePicBase64}')`;
            };
            reader.readAsDataURL(file);
        } else {
            alert("Imagem inválida ou maior que 2MB.");
            avatarInput.value = "";
            profilePicBase64 = DEFAULT_PROFILE_PIC;
            document.getElementById("avatarPreview").style.backgroundImage = `url('${DEFAULT_PROFILE_PIC}')`;
        }
    });

    // Quando o formulário for enviado
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Captura dos campos do formulário
        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm-password").value;
        const bio = bioInput.value.trim();
        const selectedGenres = Array.from(genresSelect.selectedOptions).map(opt => opt.value);
        const selectedPlatforms = Array.from(platformsSelect.selectedOptions).map(opt => opt.value);

        // Limpa mensagens de erro anteriores
        clearErrors();

        // Validações básicas
        let hasError = false;
        if (!username) {
            setError("username-error", "Informe um nome de usuário.");
            hasError = true;
        }
        if (!email || !validateEmail(email)) {
            setError("email-error", "Informe um e-mail válido.");
            hasError = true;
        }
        if (password.length < 8) {
            setError("password-error", "A senha deve conter pelo menos 8 caracteres.");
            hasError = true;
        }
        if (password !== confirmPassword) {
            setError("confirm-password-error", "As senhas não coincidem.");
            hasError = true;
        }
        if (hasError) return;

        // Monta o objeto com os dados do usuário
        const userData = {
            nome: username,
            email: email,
            senha: password,
            bio: bio,
            foto_perfil: profilePicBase64,
            preferencias_jogos: selectedGenres,
            plataformas_utilizadas: selectedPlatforms,
        };

        try {
            

            // Depois envia os dados do usuário
            const response = await fetch("http://localhost:8080/api/usuarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    //"Authorization":"Bearer "+localStorage.getItem("token")
                },
                body: JSON.stringify(userData)
            });

            if (response.redirected) {
                throw new Error("Redirecionamento inesperado para: " + response.url);
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Erro ao cadastrar usuário");
            }

            const result = await response.json();
            alert("Cadastro realizado com sucesso!");
            window.location.href = "index.html";
        } catch (error) {
            console.error("Erro completo:", error);
            setError("generalErrorMessage", error.message || "Erro ao conectar com o servidor");
        }
    });

    // Função para obter cookie
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    function setError(elementId, message) {
        const el = document.getElementById(elementId);
        if (el) {
            el.innerText = message;
            el.style.display = "block";
        }
    }

    function clearErrors() {
        document.querySelectorAll(".error-message").forEach((el) => {
            el.innerText = "";
            el.style.display = "none";
        });
    }

    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
});