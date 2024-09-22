import React, { useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Navigate, Link } from 'react-router-dom';
import UserAvatar from './UserAvatar';
import UserGuides from './UserGuides';
import UserPOIs from './UserPOIs';
import LoadingSpinner from './LoadingSpinner';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    console.log('ProfilePage user:', user); // 检查 user 对象是否正确传递
  }, [user, loading]);// 依赖项为 user 和 loading，只有它们变化时才会执行

  //在用户数据未加载完成时（即 loading 为 true），不进行重定向或者渲染内容，等待数据加载完成后再执行登录检查和渲染页面
   if (loading) {
    return <LoadingSpinner />;
  }


    if (!user || !user.id) {
        console.log('No user found, redirecting to login');
    } else {
        console.log('User found:', user);
    }
  

  return (
    <div className="profile-container">
      {/* Sidebar Navigation */}
      <div className="offcanvas offcanvas-start" style={{ width: '200px', backgroundColor: 'black', color: 'white' }} tabindex="-1" id="offcanvas" data-bs-keyboard="false" data-bs-backdrop="false">
        <div className="offcanvas-header">
          <h6 className="offcanvas-title" id="offcanvasLabel">Menu</h6>
          <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body px-0">
          <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-start" id="menu">
            <li className="nav-item">
              <a href="#guides" className="nav-link text-truncate">
                <i className="bi bi-compass"></i><span className="ms-1 d-none d-sm-inline">My Guides</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="#pois" className="nav-link text-truncate">
                <i className="bi bi-geo-alt-fill"></i><span className="ms-1 d-none d-sm-inline">My POIs</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Profile Content */}
      <div className="content-container">
        <div className="user-profile">
          <UserAvatar />
        </div>
        <div className="profile-container">
          <Link to="/edit-profile">Edit Profile</Link>
        </div>

        {/* My Guides Section */}
        <section id="guides">
          <h2 className="section-title">🧭My Guides</h2>
          <UserGuides />
        </section>

        {/* My Saved POIs Section */}
        <section id="pois">
          <h2 className="section-title">📍My POIs</h2>
          <UserPOIs />
        </section>
      </div>

      {/* Button to open sidebar */}
      <button className="btn open-sidebar-btn" data-bs-toggle="offcanvas" data-bs-target="#offcanvas" role="button">
        <i className="bi bi-arrow-right-square-fill fs-3"></i>
      </button>
    </div>
  );
};

export default ProfilePage;
