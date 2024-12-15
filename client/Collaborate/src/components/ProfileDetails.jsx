import React, { useState } from 'react';
import { useChatContext } from 'stream-chat-react';

const ProfileDetails = ({ user, onClose }) => {
        const { client } = useChatContext();
        const [name, setName] = useState(user.name || '');
        const [email, setEmail] = useState(user.email || ''); // Stream doesn't have email by default
        const [updating, setUpdating] = useState(false); // Loading state

        const handleUpdate = async () => {
                try {
                        setUpdating(true);
                        await client.partialUpdateUser({
                                id: user.id, // User ID in Stream
                                set: {
                                        name,
                                        email, // Stream allows custom fields like "email"
                                },
                        });
                        alert('Profile updated successfully!');
                        onClose(); // Close the modal after update
                } catch (error) {
                        console.error('Error updating profile:', error);
                        alert('Failed to update profile. Please try again.');
                } finally {
                        setUpdating(false);
                }
        };

        return (
                <div className="profile-details__overlay">
                        <div className="profile-details__container">
                                <button className="profile-details__close" onClick={onClose}>
                                        &times;
                                </button>
                                <h2 className="profile-details__title">Profile</h2>

                                <p className="profile-details__description">
                                        Update your profile information below. Click 'Update' to save changes.
                                </p>

                                <label htmlFor="name" className="profile-details__label">Name</label>
                                <input
                                        id="name"
                                        className="profile-details__input"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                />

                                <label htmlFor="email" className="profile-details__label">Email</label>
                                <input
                                        id="email"
                                        className="profile-details__input"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                />

                                <button
                                        className="profile-details__update-button"
                                        onClick={handleUpdate}
                                        disabled={updating}
                                >
                                        {updating ? 'Updating...' : 'Update'}
                                </button>
                        </div>
                </div>
        );
};

export default ProfileDetails;