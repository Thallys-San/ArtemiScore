async function updateUserEmail(user, currentPassword, newEmail) {
  try {
    // Criar credential para reautenticação
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    
    // Reautenticar o usuário para segurança
    await reauthenticateWithCredential(user, credential);
    
    // Atualizar email no Firebase Auth
    await updateEmail(user, newEmail);
    
    // Enviar email de verificação para o novo email
    await sendEmailVerification(user);
    
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}