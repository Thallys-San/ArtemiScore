import React, { useState, useRef, useEffect, useCallback } from 'react';

// Componente FieldError com ARIA (mantido como está)
function FieldError({ error, id }) {
    if (!error) return null;
    return (
        <div
            id={`${id}-error`}
            role="alert"
            aria-live="polite"
            style={{ color: 'var(--red)', fontSize: '0.9rem', marginTop: 4 }}
        >
            {error}
        </div>
    );
}

// Componente de Notificação (mantido como está após a correção visual)
function Notification({ message, type, onClose }) {
    useEffect(() => {
        if (!message) return;

        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [message, onClose]);

    if (!message) return null;

    const bgColor = type === 'success' ? 'var(--green)' : 'var(--red)';
    const textColor = 'white';

    return (
        <div
            style={{
                padding: '10px 20px',
                borderRadius: '5px',
                backgroundColor: bgColor,
                color: textColor,
                marginBottom: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}
            role="status"
            aria-live="polite"
        >
            <span>{message}</span>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: textColor, cursor: 'pointer', fontSize: '1.2em' }}>
                &times;
            </button>
        </div>
    );
}

// AccountSection (mantido como está)
function AccountSection({
    username, setUsername,
    email, setEmail,
    bio, setBio,
    profileImage,
    fileInputRef, handleImageChange,
    handleAccountSubmit,
    errors = {},
    isSubmitting,
    setErrors,
}) {
    const onImageChange = (e) => {
        handleImageChange(e);
        setErrors(prev => ({ ...prev, profileImage: undefined }));
    };

    return (
        <div className="settings-section">
            <h2>
                <i className="ri-user-settings-line" aria-hidden="true"></i> Configurações da Conta
            </h2>
            <form onSubmit={handleAccountSubmit} autoComplete="off" noValidate>
                <div className="form-group">
                    <label htmlFor="username">Nome de Usuário</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={e => {
                            setUsername(e.target.value);
                            setErrors(prev => ({ ...prev, username: undefined }));
                        }}
                        placeholder="Seu nome de usuário"
                        autoComplete="username"
                        aria-describedby={errors.username ? "username-error" : undefined}
                        aria-invalid={!!errors.username}
                        required
                        maxLength={32}
                    />
                    <FieldError error={errors.username} id="username" />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={e => {
                            setEmail(e.target.value);
                            setErrors(prev => ({ ...prev, email: undefined }));
                        }}
                        placeholder="Seu email"
                        autoComplete="email"
                        aria-describedby={errors.email ? "email-error" : undefined}
                        aria-invalid={!!errors.email}
                        required
                        maxLength={64}
                    />
                    <FieldError error={errors.email} id="email" />
                </div>
                <div className="form-group">
                    <label htmlFor="bio">Bio</label>
                    <textarea
                        id="bio"
                        value={bio}
                        onChange={e => {
                            setBio(e.target.value);
                            setErrors(prev => ({ ...prev, bio: undefined }));
                        }}
                        placeholder="Fale um pouco sobre você..."
                        aria-describedby={errors.bio ? "bio-error" : undefined}
                        aria-invalid={!!errors.bio}
                        required
                        maxLength={200}
                        rows={3}
                    />
                    <small style={{ display: 'block', textAlign: 'right', color: '#666' }}>
                        {bio.length}/200 caracteres
                    </small>
                    <FieldError error={errors.bio} id="bio" />
                </div>
                <div className="profile-image-upload">
                    <img
                        src={profileImage || 'https://ui-avatars.com/api/?name=User&background=eee&color=555'}
                        alt="Avatar do Usuário"
                        aria-label="Pré-visualização da imagem de perfil"
                        style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', marginBottom: 8, border: '2px solid #eee' }}
                    />
                    <label htmlFor="profileImage" className="custom-file-upload" tabIndex={0} style={{ cursor: 'pointer', color: '#007bff' }}>
                        <i className="ri-upload-cloud-line" aria-hidden="true" /> Alterar Imagem de Perfil
                    </label>
                    <input
                        id="profileImage"
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        ref={fileInputRef}
                        onChange={onImageChange}
                        aria-label="Alterar imagem de perfil"
                        style={{ display: 'none' }}
                    />
                    <small style={{ display: 'block', marginTop: 8, color: '#666' }}>
                        Formatos suportados: PNG, JPEG, WebP (Máx. 2MB)
                    </small>
                    <FieldError error={errors.profileImage} id="profileImage" />
                </div>
                <div className="button-group">
                    <button
                        type="button"
                        className="profile-btn secondary"
                        onClick={() => {
                            setUsername('');
                            setEmail('');
                            setBio('');
                            setErrors({});
                        }}
                        disabled={isSubmitting}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="profile-btn"
                        disabled={isSubmitting || !username.trim() || !email.trim() || !bio.trim()}
                        style={{ opacity: (!username.trim() || !email.trim() || !bio.trim()) ? 0.6 : 1 }}
                    >
                        {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </div>
            </form>
        </div>
    );
}

// PasswordSection (mantido como está)
function PasswordSection({
    currentPassword, setCurrentPassword,
    newPassword, setNewPassword,
    confirmNewPassword, setConfirmNewPassword,
    handlePasswordSubmit,
    errors = {},
    isSubmitting,
    setErrors,
}) {
    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length > 0) strength++;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return Math.min(strength, 5);
    };

    const passwordStrength = calculatePasswordStrength(newPassword);

    const getPasswordStrengthColor = () => {
        if (passwordStrength <= 2) return 'var(--red)';
        if (passwordStrength === 3) return 'var(--orange)';
        return 'var(--green)';
    };

    const getPasswordStrengthText = () => {
        if (newPassword.length === 0) return '';
        if (passwordStrength <= 2) return 'Fraca';
        if (passwordStrength === 3) return 'Média';
        if (passwordStrength === 4) return 'Forte';
        return 'Muito forte';
    };

    return (
        <div className="settings-section">
            <h2>
                <i className="ri-lock-line" aria-hidden="true"></i> Segurança e Senha
            </h2>
            <form onSubmit={handlePasswordSubmit} autoComplete="off" noValidate>
                <div className="form-group">
                    <label htmlFor="currentPassword">Senha Atual</label>
                    <input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={e => {
                            setCurrentPassword(e.target.value);
                            setErrors(prev => ({ ...prev, currentPassword: undefined }));
                        }}
                        placeholder="Sua senha atual"
                        autoComplete="current-password"
                        aria-describedby={errors.currentPassword ? "currentPassword-error" : undefined}
                        aria-invalid={!!errors.currentPassword}
                        required
                    />
                    <FieldError error={errors.currentPassword} id="currentPassword" />
                </div>
                <div className="form-group">
                    <label htmlFor="newPassword">Nova Senha</label>
                    <input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={e => {
                            setNewPassword(e.target.value);
                            setErrors(prev => ({ ...prev, newPassword: undefined }));
                        }}
                        placeholder="Nova senha (mínimo 8 caracteres)"
                        autoComplete="new-password"
                        aria-describedby={errors.newPassword ? "newPassword-error" : undefined}
                        aria-invalid={!!errors.newPassword}
                        required
                        minLength={8}
                    />
                    <div style={{ marginTop: 8 }}>
                        <div style={{
                            display: 'flex',
                            gap: 4,
                            marginBottom: 4
                        }}>
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    style={{
                                        height: 4,
                                        flex: 1,
                                        backgroundColor: i < passwordStrength ? getPasswordStrengthColor() : '#eee',
                                        borderRadius: 2
                                    }}
                                />
                            ))}
                        </div>
                        <small style={{ color: '#666' }}>
                            {getPasswordStrengthText()}
                        </small>
                    </div>
                    <FieldError error={errors.newPassword} id="newPassword" />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmNewPassword">Confirmar Nova Senha</label>
                    <input
                        id="confirmNewPassword"
                        type="password"
                        value={confirmNewPassword}
                        onChange={e => {
                            setConfirmNewPassword(e.target.value);
                            setErrors(prev => ({ ...prev, confirmNewPassword: undefined }));
                        }}
                        placeholder="Confirme a nova senha"
                        autoComplete="new-password"
                        aria-describedby={errors.confirmNewPassword ? "confirmNewPassword-error" : undefined}
                        aria-invalid={!!errors.confirmNewPassword}
                        required
                    />
                    <FieldError error={errors.confirmNewPassword} id="confirmNewPassword" />
                </div>
                <div className="button-group">
                    <button
                        type="submit"
                        className="profile-btn"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Alterando...' : 'Alterar Senha'}
                    </button>
                </div>
            </form>
        </div>
    );
}

// NotificationSection (mantido como está)
function NotificationSection({
    emailNotifications, setEmailNotifications,
    pushNotifications, setPushNotifications,
    forumActivity, setForumActivity,
    handleNotificationsSubmit,
    isSubmitting
}) {
    return (
        <div className="settings-section">
            <h2>
                <i className="ri-notification-3-line" aria-hidden="true"></i> Preferências de Notificação
            </h2>
            <form onSubmit={handleNotificationsSubmit}>
                <div className="checkbox-group">
                    <input
                        type="checkbox"
                        id="emailNotifications"
                        checked={emailNotifications}
                        onChange={e => setEmailNotifications(e.target.checked)}
                        aria-describedby="emailNotificationsHelp"
                    />
                    <label htmlFor="emailNotifications">Receber notificações por email</label>
                    <small id="emailNotificationsHelp" style={{ display: 'block', color: '#666', marginLeft: 24 }}>
                        Receba atualizações importantes por email
                    </small>
                </div>
                <div className="checkbox-group">
                    <input
                        type="checkbox"
                        id="pushNotifications"
                        checked={pushNotifications}
                        onChange={e => setPushNotifications(e.target.checked)}
                        aria-describedby="pushNotificationsHelp"
                    />
                    <label htmlFor="pushNotifications">Receber notificações push (no navegador)</label>
                    <small id="pushNotificationsHelp" style={{ display: 'block', color: '#666', marginLeft: 24 }}>
                        Permita notificações do navegador para receber atualizações em tempo real
                    </small>
                </div>
                <div className="checkbox-group">
                    <input
                        type="checkbox"
                        id="forumActivity"
                        checked={forumActivity}
                        onChange={e => setForumActivity(e.target.checked)}
                        aria-describedby="forumActivityHelp"
                    />
                    <label htmlFor="forumActivity">Notificações de atividade no fórum</label>
                    <small id="forumActivityHelp" style={{ display: 'block', color: '#666', marginLeft: 24 }}>
                        Receba notificações quando houver respostas nos seus tópicos
                    </small>
                </div>
                <div className="button-group">
                    <button
                        type="submit"
                        className="profile-btn"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Salvando...' : 'Salvar Preferências'}
                    </button>
                </div>
            </form>
        </div>
    );
}

// DangerSection (MELHORADO: Feedback de desativação)
function DangerSection({ handleDeactivate, isSubmitting }) {
    const [confirmText, setConfirmText] = useState('');
    const [showDeactivateModal, setShowDeactivateModal] = useState(false);
    const [deactivationError, setDeactivationError] = useState(''); // Novo estado para erro de desativação

    const handleDeactivateClick = () => {
        if (confirmText.trim().toLowerCase() === 'confirmar') {
            setShowDeactivateModal(true);
            setDeactivationError(''); // Limpa o erro ao abrir o modal
        } else {
            // Opcional: Feedback imediato se o texto não for 'CONFIRMAR'
            // setDeactivationError('Por favor, digite "CONFIRMAR" corretamente.');
        }
    };

    const confirmDeactivation = async () => {
        setDeactivationError(''); // Limpa qualquer erro anterior
        try {
            await handleDeactivate(); // Chama a função do pai
            setShowDeactivateModal(false); // Fecha o modal após sucesso
        } catch (error) {
            setDeactivationError('Erro ao desativar conta. Tente novamente.'); // Define um erro específico
        }
    };

    return (
        <div className="settings-section">
            <h2>
                <i className="ri-delete-bin-7-line" aria-hidden="true"></i> Gerenciamento da Conta
            </h2>
            <p className="danger-text">
                Aqui você pode gerenciar sua conta, incluindo a opção de desativá-la.
                <strong> Atenção: </strong>Esta ação é irreversível e removerá todos os seus dados.
            </p>
            <div className="form-group" style={{ marginTop: 16 }}>
                <label htmlFor="confirmDeactivate">
                    Digite <strong>"CONFIRMAR"</strong> para habilitar o botão de desativação
                </label>
                <input
                    id="confirmDeactivate"
                    type="text"
                    value={confirmText}
                    onChange={e => setConfirmText(e.target.value)}
                    placeholder="Digite CONFIRMAR"
                    style={{ marginBottom: 8 }}
                    aria-describedby={deactivationError ? "deactivation-error" : undefined}
                    aria-invalid={!!deactivationError}
                />
                {deactivationError && (
                    <FieldError error={deactivationError} id="deactivation" />
                )}
            </div>
            <div className="button-group">
                <button
                    type="button"
                    onClick={handleDeactivateClick}
                    className="profile-btn danger"
                    disabled={confirmText.trim().toLowerCase() !== 'confirmar' || isSubmitting}
                    aria-describedby="deactivateWarning"
                >
                    <i className="ri-close-circle-line" aria-hidden="true" /> Desativar Conta
                </button>
                <small id="deactivateWarning" style={{ color: 'var(--red)', display: 'block', marginTop: 8 }}>
                    Esta ação não pode ser desfeita. Todos os seus dados serão permanentemente removidos.
                </small>
            </div>

            {showDeactivateModal && (
                <div className="modal-overlay"
                    // Estilos do modal - idealmente em um arquivo CSS
                    style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center',
                        zIndex: 1000
                    }}>
                    <div className="modal-content"
                        // Estilos do conteúdo do modal - idealmente em um arquivo CSS
                        style={{
                            backgroundColor: 'white', padding: '30px', borderRadius: '8px', maxWidth: '500px',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)', textAlign: 'center'
                        }}>
                        <h3>Confirmar Desativação de Conta</h3>
                        <p>Tem certeza absoluta que deseja desativar sua conta? Esta ação é irreversível e removerá todos os seus dados.</p>
                        {isSubmitting && <p style={{ color: 'var(--blue)' }}>Processando desativação...</p>} {/* Feedback de loading no modal */}
                        {deactivationError && <p style={{ color: 'var(--red)' }}>{deactivationError}</p>} {/* Erro dentro do modal */}
                        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
                            <button
                                className="profile-btn secondary"
                                onClick={() => {
                                    setShowDeactivateModal(false);
                                    setDeactivationError(''); // Limpa erro ao fechar
                                }}
                                disabled={isSubmitting}
                            >
                                Cancelar
                            </button>
                            <button
                                className="profile-btn danger"
                                onClick={confirmDeactivation}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Desativando...' : 'Sim, Desativar Minha Conta'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Funções de Validação (mantidas como estão)
const validateAccountForm = (username, email, bio) => {
    let errors = {};
    if (!username.trim()) errors.username = 'Digite o nome de usuário.';
    if (!email.trim()) errors.email = 'Digite o email.';
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'Digite um email válido.';
    }
    if (!bio.trim()) errors.bio = 'Digite sua bio.';
    if (bio.length > 200) errors.bio = 'A bio deve ter no máximo 200 caracteres.';
    return errors;
};

const validatePasswordForm = (currentPassword, newPassword, confirmNewPassword) => {
    let errors = {};
    if (!currentPassword) errors.currentPassword = 'Digite a senha atual.';
    if (!newPassword) errors.newPassword = 'Digite a nova senha.';
    if (newPassword.length < 8) errors.newPassword = 'A senha deve ter pelo menos 8 caracteres.';
    if (!confirmNewPassword) errors.confirmNewPassword = 'Confirme a nova senha.';
    if (newPassword && confirmNewPassword && newPassword !== confirmNewPassword) {
        errors.confirmNewPassword = 'As senhas não coincidem.';
    }
    return errors;
};

function ConfigScreen() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [bio, setBio] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [forumActivity, setForumActivity] = useState(false);

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '' });

    const fileInputRef = useRef();

    // Carregar dados do usuário (simulação)
    useEffect(() => {
        const timer = setTimeout(() => {
            setUsername('');
            setEmail('');
            setBio('');
            setProfileImage('');
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const handleImageChange = useCallback((e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            setErrors(prev => ({ ...prev, profileImage: 'O arquivo deve ter no máximo 2MB.' }));
            return;
        }
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            setErrors(prev => ({ ...prev, profileImage: 'Formato de arquivo não suportado. Use JPEG, PNG ou WebP.' }));
            return;
        }

        setErrors(prev => ({ ...prev, profileImage: undefined }));
        const reader = new FileReader();
        reader.onload = (ev) => setProfileImage(ev.target.result);
        reader.readAsDataURL(file);
    }, []);

    const handleAccountSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        const newErrors = validateAccountForm(username, email, bio);
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsSubmitting(false);
            return;
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setNotification({ message: 'Dados da conta salvos com sucesso!', type: 'success' });
        } catch (error) {
            setNotification({ message: 'Ocorreu um erro ao salvar os dados.', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        const newErrors = validatePasswordForm(currentPassword, newPassword, confirmNewPassword);
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsSubmitting(false);
            return;
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setNotification({ message: 'Senha alterada com sucesso!', type: 'success' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (error) {
            setNotification({ message: 'Ocorreu um erro ao alterar a senha.', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNotificationsSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            setNotification({ message: 'Preferências de notificação salvas com sucesso!', type: 'success' });
        } catch (error) {
            setNotification({ message: 'Ocorreu um erro ao salvar as preferências.', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeactivate = async () => {
        setIsSubmitting(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            // Simulação de erro: descomente a linha abaixo para testar o erro
            // throw new Error('Simulando falha na desativação.');
            setNotification({ message: 'Conta desativada com sucesso!', type: 'success' });
            setTimeout(() => {
                if (window.history.length > 1) {
                    window.history.back();
                } else {
                    window.location.href = '/';
                }
            }, 1000);
        } catch (error) {
            setNotification({ message: 'Ocorreu um erro ao desativar a conta.', type: 'error' });
            // Rejeita a promise para que o erro seja capturado em DangerSection
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBack = () => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = '/';
        }
    };

    return (
        <main>
            <div className="settings-container">
                <button
                    type="button"
                    className="profile-btn secondary"
                    style={{ marginBottom: 24 }}
                    onClick={handleBack}
                >
                    <i className="ri-arrow-left-line" aria-hidden="true" /> Voltar
                </button>

                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification({ message: '', type: '' })}
                />

                <AccountSection
                    username={username}
                    setUsername={setUsername}
                    email={email}
                    setEmail={setEmail}
                    bio={bio}
                    setBio={setBio}
                    profileImage={profileImage}
                    fileInputRef={fileInputRef}
                    handleImageChange={handleImageChange}
                    handleAccountSubmit={handleAccountSubmit}
                    errors={errors}
                    setErrors={setErrors}
                    isSubmitting={isSubmitting}
                />
                <PasswordSection
                    currentPassword={currentPassword}
                    setCurrentPassword={setCurrentPassword}
                    newPassword={newPassword}
                    setNewPassword={setNewPassword}
                    confirmNewPassword={confirmNewPassword}
                    setConfirmNewPassword={setConfirmNewPassword}
                    handlePasswordSubmit={handlePasswordSubmit}
                    errors={errors}
                    setErrors={setErrors}
                    isSubmitting={isSubmitting}
                />
                <NotificationSection
                    emailNotifications={emailNotifications}
                    setEmailNotifications={setEmailNotifications}
                    pushNotifications={setPushNotifications}
                    setPushNotifications={setPushNotifications}
                    forumActivity={forumActivity}
                    setForumActivity={setForumActivity}
                    handleNotificationsSubmit={handleNotificationsSubmit}
                    isSubmitting={isSubmitting}
                />
                <DangerSection
                    handleDeactivate={handleDeactivate}
                    isSubmitting={isSubmitting}
                />
            </div>
        </main>
    );
}

export default ConfigScreen;
