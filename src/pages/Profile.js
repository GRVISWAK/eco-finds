import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem('user');
    if (!raw) {
      // if not logged in send to login
      navigate('/login', { replace: true });
      return;
    }
    try {
      setUser(JSON.parse(raw));
    } catch {
      localStorage.removeItem('user');
      navigate('/login', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEdit = () => navigate('/profile', { replace: false }); // replace with edit route if you have one
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  if (!user) {
    return (
      <div className="profile-container">
        <div className="empty">Loading profile...</div>
      </div>
    );
  }

  const name =
    user.username || user.name || [user.firstName, user.lastName].filter(Boolean).join(' ') || '—';
  const email = user.email || '—';
  const joined = user.createdAt || user.joinedAt || user.timestamp || user.registeredAt || null;
  const joinedStr = joined ? new Date(joined).toLocaleDateString() : '—';
  const userId = user.id ?? user.userId ?? '—';

  return (
    <div className="profile-container container">
      <h1>User Profile</h1>

      <div className="profile-card">
        <div className="profile-row">
          <div>
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Joined:</strong> {joinedStr}</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button className="btn btn-primary" onClick={handleEdit}>Edit Profile</button>
            <button className="btn" onClick={() => navigate('/my-listings')}>My Listings</button>
            <button className="btn" onClick={() => navigate('/purchases')}>Purchases</button>
            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
          </div>
        </div>

        {user.bio && <p className="profile-bio">{user.bio}</p>}
      </div>
    </div>
  );
}

export default Profile;