import { create } from 'zustand';

export const useAppStore = create((set) => ({
  // User state
  user: {
    id: localStorage.getItem('userId') || Math.random().toString(36).substr(2, 9),
    name: localStorage.getItem('userName') || `User_${Math.random().toString(36).substr(2, 5)}`
  },
  
  setUser: (user) => {
    localStorage.setItem('userId', user.id);
    localStorage.setItem('userName', user.name);
    set({ user });
  },

  // Comments state
  comments: [],
  setComments: (comments) => set({ comments }),
  addComment: (comment) => set((state) => ({
    comments: [...state.comments, comment]
  })),
  updateCommentLikes: (commentId, likes) => set((state) => ({
    comments: state.comments.map(c => c.id === commentId ? { ...c, likes } : c)
  })),

  // Room state
  currentRoom: null,
  setCurrentRoom: (room) => set({ currentRoom: room }),
  activeUsers: 0,
  setActiveUsers: (count) => set({ activeUsers: count }),

  // Typing indicators
  typingUsers: [],
  addTypingUser: (userName) => set((state) => ({
    typingUsers: [...new Set([...state.typingUsers, userName])]
  })),
  removeTypingUser: () => set({ typingUsers: [] }),

  // Trends state
  trends: [],
  setTrends: (trends) => set({ trends }),
  updateTrend: (trend) => set((state) => {
    const idx = state.trends.findIndex(t => t.id === trend.id);
    if (idx !== -1) {
      const updated = [...state.trends];
      updated[idx] = trend;
      return { trends: updated };
    }
    return { trends: [...state.trends, trend] };
  }),

  // Notifications state
  notifications: [],
  setNotifications: (notifications) => set({ notifications }),
  addNotification: (notification) => set((state) => ({
    notifications: [...state.notifications, notification]
  })),
  markNotificationAsRead: (notificationId) => set((state) => ({
    notifications: state.notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    )
  })),

  // UI state
  showChatOverlay: false,
  setShowChatOverlay: (show) => set({ showChatOverlay: show }),
  showNotificationCenter: false,
  setShowNotificationCenter: (show) => set({ showNotificationCenter: show }),
}));
