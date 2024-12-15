import React from 'react';

const UserProfileModal = ({ user, onClose }) => {
        return (
                <div className="user-profile__overlay">
                        <div className="user-profile__container">
                                <button className="user-profile__close" onClick={onClose}>
                                        &times;
                                </button>
                                <img
                                        src={user.image || '/default-profile.png'}
                                        alt={user.name || 'User'}
                                        className="user-profile__image"
                                />
                                <h2 className="user-profile__name">{user.name || 'Unknown User'}</h2>
                                <p className="user-profile__email">
                                        {user.email || 'Email not available'}
                                </p>
                        </div>
                </div>
        );
};

export default UserProfileModal;