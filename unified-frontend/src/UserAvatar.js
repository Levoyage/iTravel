import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import placeholderImage from './assets/images/placeholder-image.png';
import './UserAvatar.css';

const UserAvatar = () => {
  const { user } = useAuth();
  const [avatarPreview, setAvatarPreview] = useState('');

  useEffect(() => {
    if (user && user.avatarUrl) {
      const avatarUrl = `${process.env.REACT_APP_API_URL}/download_avatar/${user.avatarUrl}`;
      console.log('Setting avatar preview to:', avatarUrl);
      setAvatarPreview(avatarUrl);
    } else {
      setAvatarPreview(placeholderImage);
    }
  }, [user]);

  useEffect(() => {
    // 清理对象 URL
    return () => {
      if (avatarPreview && avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/upload_avatar`, {
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
      const newAvatarUrl = `${process.env.REACT_APP_API_URL}/download_avatar/${fileId}`;
      setAvatarPreview(newAvatarUrl);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    }
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const objectUrl = URL.createObjectURL(file);
      setAvatarPreview(objectUrl); // 临时 URL 用于预览
      handleFileUpload(file); // 上传文件
    }
  };

  return (
    <div className="user-avatar">
      <img src={avatarPreview} alt={user.username} className="profile-picture" />
      <div className="user-details">
        <h1>{user.username}</h1>
        <label className="custom-upload-button">
          Upload Avatar
          <input type="file" onChange={handleAvatarChange} className="avatar-upload" />
        </label>
      </div>
    </div>
  );
};

export default UserAvatar;
