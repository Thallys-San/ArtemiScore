import React, { useState, useRef } from 'react';

const DEFAULT_PROFILE_PIC = "https://raw.githubusercontent.com/Thallys-San/ArtemiScore/main/profile_pic.png";

function ProfilePicture({ onAvatarChange }) {
  const [avatarPreview, setAvatarPreview] = useState(DEFAULT_PROFILE_PIC);
  const fileInputRef = useRef(null);

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];

    if (!file || !file.type.startsWith("image/")) {
      alert("Arquivo inválido.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Imagem maior que 2MB.");
      fileInputRef.current.value = "";
      setAvatarPreview(DEFAULT_PROFILE_PIC);
      onAvatarChange(DEFAULT_PROFILE_PIC);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxSize = 128;
        canvas.width = maxSize;
        canvas.height = maxSize;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, maxSize, maxSize);

        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
        setAvatarPreview(compressedBase64);
        onAvatarChange(compressedBase64);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setAvatarPreview(DEFAULT_PROFILE_PIC);
    onAvatarChange(DEFAULT_PROFILE_PIC);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  // Verifica se a foto atual é diferente da padrão
  const isCustomAvatar = avatarPreview !== DEFAULT_PROFILE_PIC;

  return (
    <div className="input-group profile-picture-container">
      <label>Foto de Perfil</label>
      <div className="avatar-upload">
        <div className="avatar-edit">
          <input
            type="file"
            id="avatarUpload"
            accept=".png, .jpg, .jpeg"
            onChange={handleAvatarChange}
            ref={fileInputRef}
          />
          <label htmlFor="avatarUpload"></label>
        </div>
        <div className="avatar-preview">
          <div
            id="avatarPreview"
            style={{
              backgroundImage: `url('${avatarPreview}')`
            }}
          ></div>
        </div>
        {isCustomAvatar && (
         <button
            type="button"
            onClick={handleReset}
            className="reset-avatar-button"
            title="Remover foto"
            aria-label="Remover foto de perfil"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>
      <small className="form-text-hint">
        Formatos suportados: JPG, PNG, JPEG (Máx. 2MB)
      </small>
    </div>
  );
}

export default ProfilePicture;