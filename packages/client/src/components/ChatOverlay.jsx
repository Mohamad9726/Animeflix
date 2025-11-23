import React, { useEffect, useRef, useState } from 'react';
import { useAppStore } from '../store';
import {
  sendComment,
  emitTyping,
  emitStopTyping,
  onNewComment,
  onUserJoined,
  onUserLeft,
  onUserTyping,
  onUserStopTyping,
  onCommentLiked
} from '../services/socket';
import './ChatOverlay.css';

export const ChatOverlay = ({ animeId, episodeId }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const {
    user,
    comments,
    addComment,
    activeUsers,
    setActiveUsers,
    typingUsers,
    addTypingUser,
    removeTypingUser,
    updateCommentLikes
  } = useAppStore();

  useEffect(() => {
    const handleNewComment = (comment) => {
      addComment(comment);
      scrollToBottom();
    };

    const handleUserJoined = ({ activeUsers: count }) => {
      setActiveUsers(count);
    };

    const handleUserLeft = ({ activeUsers: count }) => {
      setActiveUsers(count);
    };

    const handleUserTyping = ({ userName }) => {
      addTypingUser(userName);
    };

    const handleUserStopTyping = () => {
      removeTypingUser();
    };

    const handleCommentLiked = ({ commentId, likes }) => {
      updateCommentLikes(commentId, likes);
    };

    onNewComment(handleNewComment);
    onUserJoined(handleUserJoined);
    onUserLeft(handleUserLeft);
    onUserTyping(handleUserTyping);
    onUserStopTyping(handleUserStopTyping);
    onCommentLiked(handleCommentLiked);

    scrollToBottom();
  }, [addComment, setActiveUsers, addTypingUser, removeTypingUser, updateCommentLikes]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);

    if (!isTyping) {
      setIsTyping(true);
      emitTyping({ animeId, episodeId, userName: user.name });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      emitStopTyping({ animeId, episodeId });
    }, 2000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendComment({
        animeId,
        episodeId,
        userId: user.id,
        userName: user.name,
        text: message
      });
      setMessage('');
      setIsTyping(false);
    }
  };

  return (
    <div className="chat-overlay">
      <div className="chat-header">
        <h3>Live Comments</h3>
        <span className="active-users">{activeUsers} online</span>
      </div>

      <div className="messages-container">
        {comments.map((comment) => (
          <div key={comment.id} className="message">
            <div className="message-header">
              <span className="username">{comment.userName}</span>
              <span className="timestamp">{new Date(comment.timestamp).toLocaleTimeString()}</span>
            </div>
            <div className="message-content">{comment.text}</div>
            <div className="message-actions">
              <button className="like-btn">
                ❤️ {comment.likes > 0 ? comment.likes : ''}
              </button>
            </div>
          </div>
        ))}
        {typingUsers.length > 0 && (
          <div className="typing-indicator">
            {typingUsers.join(', ')} is typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={message}
          onChange={handleInputChange}
          placeholder="Write a comment..."
          className="chat-input"
        />
        <button type="submit" className="send-btn">Send</button>
      </form>
    </div>
  );
};
