//cadastro de usuario
"use strict";

const DEFAULT_PROFILE_PIC="https://raw.githubusercontent.com/Thallys-San/ArtemiScore/main/profile_pic.png"

document.addEventListener("DOMContentLoaded", async function(){
const form=document.getElementById("registerForm");
const bioInput=document.getElementById("bio");
const charCount=document.getElementById("charCount");
const avatarInput=document.getElementById("avatarUpload");

let profilePicBase64=DEFAULT_PROFILE_PIC; // Usa imagem padrão inicialmente

// Mostra imagem padrão ao carregar a página
document.getElementById("avatarPreview").style.backgroundImage=`url('${DEFAULT_PROFILE_PIC}')`;

// Atualiza o contador de caracteres do campo biografia
bioInput.addEventListener("input",()=>{
    const currentLength=bioInput.value.length;
    charCount.textContent=`(${currentLength}/300)`;
});
// Converte imagem carregada localmente para Base64
avatarInput.addEventListener("change",()=>{
const file=avatarInput.files[0];

if (file && file.size<=2*1024*1024) {// Verifica limite de 2MB
    const reader=new FileReader();

    reader.onload=function(e){
        profilePicBase64=e.target.result; // Salva imagem convertida
        document.getElementById("avatarPreview").style.backgroundImage=`url('${profilePicBase64}')`;
    };

    reader.readAsDataURL(file) // Inicia leitura do arquivo
}else{
    alert("Imagem inválida ou maior que 2MB.");
    avatarInput.value=""; //limpa input
    profilePicBase64=DEFAULT_PROFILE_PIC; //restaura imagem default
    document.getElementById("avatarPreview").style.backgroundImage=`url('${DEFAULT_PROFILE_PIC}')`;
}
});

  // Quando o formulário for enviado
  form.addEventListener("submit",async(event)=>{
    event.preventDefault();// Evita o comportamento padrão de recarregar a página
 
    // Captura dos campos do formulário
    const username=document.getElementById("username").value.trim();
    const email=document.getElementById("email").value.trim();
    const password=document.getElementById("password").value;
    const confirmPassword=document.getElementById("confirm-password").value;
    const bio=bioInput.value.trim();
    const genres=document.getElementById("favorite-genres").value.trim();
    const preferredPlatforms=document.getElementById("preferred-platforms").value.trim();

    // Limpa mensagens de erro anteriores
    clearErrors();

    // Variável de controle de erro
    let hasError=false;

    // Validações básicas
    if (!username) {
        setError("username-error","Informe um nome de usuário.");
        hasError=true;
    }
    if (!email || !validateEmail(email)) {
        setError("email-error","Informe um e-mail válido.");
        hasError=true;
    }
    if (password.length < 8) {
        setError("password-error","A senha deve conter pelo menos 8 caracteres.")
        hasError=true;
    }
    if(password !== confirmPassword){
        setError("confirm-password-error","As senhas não coincidem.")
        hasError=true;
    }
    // Se houver erros, cancela o envio
    if(hasError)return;

    // Monta o objeto com os dados do usuário
    const userData={
        nome: username,
        email: email,
        senha: password,
        descricao: bio,
        foto_perfil: profilePicBase64, // Pode ser imagem padrão ou personalizada
        preferencias_jogos: genres.split(",").map((g)=>g.trim()),
        plataformas_utilizadas: preferredPlatforms.split(",").map((g)=>g.trim()),
    };
    try{
        // Envia para a API
        const response=await fetch("http://localhost:8080/usuarios",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            throw new Error("Erro ao cadastrar usuário! Verifique os dados.");
        }
        alert("Cadastro realizado com sucesso!");
        window.location.href="home.html" // Redireciona após sucesso
    } catch(error){
        setError("generalErrorMessage", error.message); // Exibe erro geral
    }
});
// Função para exibir mensagem de erro
  function setError(elementId, message) {
    const el = document.getElementById(elementId);
    if (el) {
      el.innerText = message;
      el.style.display = "block";
    }
  }

  // Função para limpar todas as mensagens de erro
  function clearErrors() {
    document.querySelectorAll(".error-message").forEach((el) => {
      el.innerText = "";
      el.style.display = "none";
    });
  }

  // Validação simples de e-mail usando regex
  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
});
