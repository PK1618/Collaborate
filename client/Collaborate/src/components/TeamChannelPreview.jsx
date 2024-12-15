import React, { useState } from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';
import UserProfileModal from './UserProfileModal'; // Import the new modal component

const TeamChannelPreview = ({
        setActiveChannel,
        setIsCreating,
        setIsEditing,
        setToggleContainer,
        channel,
        type,
}) => {
        const { channel: activeChannel, client } = useChatContext();
        const [selectedUser, setSelectedUser] = useState(null); // State to store clicked user data

        // Render Team Channels
        const ChannelPreview = () => (
                <p className="channel-preview__item"># {channel?.data?.name || channel?.data?.id}</p>
        );

        // Render Direct Message Channels
        const DirectPreview = () => {
                const members = Object.values(channel.state.members).filter(
                        ({ user }) => user.id !== client.userID
                );

                const otherUser = members[0]?.user;

                return (
                        <div className="channel-preview__item single">
                                <div
                                        className="channel-preview__avatar"
                                        onClick={(e) => {
                                                e.stopPropagation(); // Prevent channel click event
                                                setSelectedUser(otherUser);
                                        }}
                                >
                                        <Avatar
                                                image={otherUser?.image || '/default-profile.png'}
                                                name={otherUser?.fullName || otherUser?.id}
                                                size={24}
                                        />
                                </div>
                                <p>{otherUser?.fullName || otherUser?.id}</p>
                        </div>
                );
        };

        return (
                <>
                        <div
                                className={
                                        channel?.id === activeChannel?.id
                                                ? 'channel-preview__wrapper__selected'
                                                : 'channel-preview__wrapper'
                                }
                                onClick={() => {
                                        setIsCreating(false);
                                        setIsEditing(false);
                                        setActiveChannel(channel);
                                        if (setToggleContainer) {
                                                setToggleContainer((prevState) => !prevState);
                                        }
                                }}
                        >
                                {type === 'team' ? <ChannelPreview /> : <DirectPreview />}
                        </div>

                        {/* User Profile Modal */}
                        {selectedUser && (
                                <UserProfileModal
                                        user={selectedUser}
                                        onClose={() => setSelectedUser(null)}
                                />
                        )}
                </>
        );
};

export default TeamChannelPreview;