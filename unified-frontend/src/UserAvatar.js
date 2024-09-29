import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import placeholderImage from './assets/images/placeholder-image.png';
import './UserAvatar.css';

const UserAvatar = () => {
  const { user, updateUser } = useAuth();
  const [avatarPreview, setAvatarPreview] = useState('');

  useEffect(() => {
    if (user && user.avatarUrl) {
      const avatarUrl = `http://localhost:8080/download_avatar/${user.avatarUrl}`;
      console.log('Setting avatar preview to:', user.avatarUrl);
      setAvatarPreview(avatarUrl);
    } else {
      setAvatarPreview(placeholderImage);
    }
  }, [user]);

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:8080/upload_avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Error uploading file: ' + response.statusText);
      }

      const fileId = await response.text();
      const newAvatarUrl = `http://localhost:8080/download_avatar/${fileId}`;
      setAvatarPreview(newAvatarUrl); // Local state update only

      // Remove the updateUser call
      // alert('File uploaded successfully: ' + fileId);
    } catch (error) {
      console.error('Error uploading file: ', error);
      alert('Error uploading file');
    }
  };


  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const objectUrl = URL.createObjectURL(file);
      setAvatarPreview(objectUrl);//临时URL用于预览
      handleFileUpload(file);//上传，成功后持久化URL
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  return (
    <div className="user-avatar">
      <img src={avatarPreview} alt={user.username} className="profile-picture" />
      <div className="user-details">
        <h1>{user.username}</h1>
        <label className="custom-upload-button">
          Upload Avatar {/* Custom button text */}
          <input type="file" onChange={handleAvatarChange} className="avatar-upload" />
        </label>
      </div>
    </div>
  );
};

export default UserAvatar;