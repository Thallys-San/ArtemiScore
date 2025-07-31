import React, { useState, useRef } from 'react';

const DEFAULT_PROFILE_PIC = "https://raw.githubusercontent.com/Thallys-San/ArtemiScore/main/profile_pic.png";

function AvatarUpload({ onAvatarChange }) {
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
        onAvatarChange(compressedBase64); // envia para o componente pai
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <label htmlFor="avatarInput">Foto de Perfil:</label>
      <input
        type="file"
        id="avatarInput"
        accept="image/*"
        onChange={handleAvatarChange}
        ref={fileInputRef}
      />
      <div
        id="avatarPreview"
        style={{
          marginTop: '10px',
          width: '128px',
          height: '128px',
          borderRadius: '50%',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundImage: `url('${avatarPreview}')`,
          border: '2px solid #ccc'
        }}
      />
    </div>
  );
}

export default ProfilePicture;
