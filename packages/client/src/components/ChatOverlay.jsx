import React, { useEffect, useRef, useState } from 'react';
import { useAppStore } from '../store';
import { Send, Heart } from 'lucide-react';
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
    <div className="flex flex-col h-full bg-transparent text-sm">
      <div className="px-4 py-2 bg-white/5 border-b border-white/5 flex justify-between items-center text-xs text-gray-400">
        <span>Room: {animeId}-{episodeId}</span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          {activeUsers} online
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {comments.map((comment) => (
          <div key={comment.id} className="group animate-fade-in-up">
            <div className="flex items-baseline gap-2 mb-1">
              <span className={`font-bold ${comment.userName === user.name ? 'text-primary' : 'text-secondary'}`}>
                {comment.userName}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="glass-card p-3 rounded-tr-xl rounded-bl-xl rounded-br-xl text-gray-200 break-words relative">
              {comment.text}
              <div className="absolute -right-2 -bottom-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="bg-surface rounded-full p-1 shadow-md hover:text-red-500 transition-colors">
                   <Heart className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {typingUsers.length > 0 && (
          <div className="text-xs text-gray-500 italic px-2 animate-pulse">
            {typingUsers.join(', ')} is typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="p-4 border-t border-white/10 bg-black/20" onSubmit={handleSendMessage}>
        <div className="relative">
          <input
            type="text"
            value={message}
            onChange={handleInputChange}
            placeholder="Say something..."
            className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-4 pr-10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-colors"
          />
          <button 
            type="submit" 
            className="absolute right-1 top-1 p-1.5 bg-primary/20 rounded-full text-primary hover:bg-primary hover:text-white transition-all disabled:opacity-50"
            disabled={!message.trim()}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
