import React, { useState } from 'react';
import '../layout/css/AvatarDisplay.css'

export const DEFAULT_PROFILE_PIC = "https://raw.githubusercontent.com/Thallys-San/ArtemiScore/main/profile_pic.png";

const AvatarDisplay = ({ src, alt, size = 'medium', className = '' }) => {
  const [imageUrl, setImageUrl] = useState(src || DEFAULT_PROFILE_PIC);
  
  // Tamanhos pré-definidos
  const sizeMap = {
    small: '64px',
    medium: '128px',
    large: '180px',
    xlarge: '320px'
  };

  const handleImageError = () => {
    setImageUrl(DEFAULT_PROFILE_PIC);
  };

  return (
    <div 
  className={`avatar-container ${className} large`}
  style={{
    '--avatar-size': sizeMap.large
  }}
>
      <img
        src={imageUrl}
        alt={alt || "Foto de perfil do usuário"}
        className="avatar-image"
        onError={handleImageError}
        loading="lazy"
      />
    </div>
  );
};

export default AvatarDisplay;
