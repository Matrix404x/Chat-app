import React, { useState, useRef } from 'react';
import { auth, db, storage } from '../config/firebase';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [bio, setBio] = useState('');
  // store both the selected File and a preview data URL
  const [selectedFile, setSelectedFile] = useState(null);
  const [profileImage, setProfileImage] = useState(user?.photoURL || null);
  const [previewImage, setPreviewImage] = useState(user?.photoURL || null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage('');

      let photoURL = profileImage || null;

      // If a new file is selected, upload it to Firebase Storage and get a public URL
      if (selectedFile) {
        try {
          const uid = auth.currentUser.uid;
          const fileRef = storageRef(storage, `profiles/${uid}/${Date.now()}_${selectedFile.name}`);
          // uploadBytes with the File object and content type metadata
          await uploadBytes(fileRef, selectedFile, { contentType: selectedFile.type });
          photoURL = await getDownloadURL(fileRef);
        } catch (uploadErr) {
          console.error('Failed to upload profile image:', uploadErr);
          throw new Error('Failed to upload profile image.');
        }
      }

      // Update Firebase Auth profile with the download URL (or existing URL/null)
      await updateProfile(auth.currentUser, {
        displayName: displayName || auth.currentUser.email,
        photoURL: photoURL || null,
      });

      // Update Firestore user document
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(
        userRef,
        {
          displayName: displayName || auth.currentUser.email,
          email: auth.currentUser.email,
          photoURL: photoURL || null,
          bio: bio,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <button className="btn-ghost" onClick={() => navigate('/home')}>← Back</button>
          <h1>Profile Settings</h1>
        </div>

        <form className="profile-form" onSubmit={handleSaveProfile}>
          {/* Profile Picture */}
          <div className="profile-picture-section">
            <div className="avatar-display">
              {previewImage ? (
                <img src={previewImage} alt="Profile" />
              ) : (
                <div className="avatar-placeholder">
                  {(displayName || user?.email || '?').charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="upload-actions">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                className="btn-upload"
                onClick={() => fileInputRef.current?.click()}
              >
                Change Picture
              </button>
            </div>
          </div>

          {/* Display Name */}
          <div className="field">
            <label>Full Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              maxLength={50}
            />
          </div>

          {/* Bio */}
          <div className="field">
            <label>Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell others about yourself..."
              maxLength={160}
              rows={3}
            />
            <small style={{ color: 'var(--muted)' }}>{bio.length}/160</small>
          </div>

          {/* Account Details (Read-only) */}
          <div className="account-details">
            <h3>Account Information</h3>
            <div className="detail-row">
              <span className="label">Email</span>
              <span className="value">{user?.email}</span>
            </div>
            <div className="detail-row">
              <span className="label">User ID</span>
              <span className="value" style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                {user?.uid}
              </span>
            </div>
            <div className="detail-row">
              <span className="label">Account Created</span>
              <span className="value">
                {user?.metadata?.creationTime
                  ? new Date(user.metadata.creationTime).toLocaleDateString()
                  : 'N/A'}
              </span>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className={`status-message ${message.includes('Error') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}

          {/* Save Button */}
          <button
            type="submit"
            className="btn-save"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;

