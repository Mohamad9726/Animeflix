import { storage } from './models.js';

// Background job definitions
export const jobs = {
  // Calculate trending metrics
  calculateTrendingMetrics() {
    const metrics = {};

    // Count comments per anime
    for (const [key, comments] of storage.comments.entries()) {
      const [animeId] = key.split(':');

      if (!metrics[animeId]) {
        metrics[animeId] = {
          animeId,
          commentCount: 0,
          activeUsers: 0
        };
      }

      metrics[animeId].commentCount += comments.length;
    }

    // Count active users per anime
    for (const [key, users] of storage.activeUsers.entries()) {
      const [animeId] = key.split(':');

      if (!metrics[animeId]) {
        metrics[animeId] = {
          animeId,
          commentCount: 0,
          activeUsers: 0
        };
      }

      metrics[animeId].activeUsers += users.size;
    }

    return Object.values(metrics);
  },

  // Recalculate trending ranks
  updateTrendingRanks() {
    const metrics = this.calculateTrendingMetrics();

    // Clear old trends
    storage.trends.clear();

    // Add new trends sorted by engagement
    metrics
      .sort((a, b) => {
        const aScore = a.commentCount * 0.7 + a.activeUsers * 0.3;
        const bScore = b.commentCount * 0.7 + b.activeUsers * 0.3;
        return bScore - aScore;
      })
      .slice(0, 10)
      .forEach((metric, index) => {
        storage.trends.set(metric.animeId, {
          rank: index + 1,
          ...metric,
          score: metric.commentCount * 0.7 + metric.activeUsers * 0.3,
          timestamp: new Date().toISOString()
        });
      });

    return Array.from(storage.trends.values());
  },

  // Schedule episode release notifications
  scheduleEpisodeNotifications() {
    const notifications = [];

    // In a real system, this would check for upcoming episode releases
    // and schedule notifications to subscribed users
    for (const [userId, subscriptions] of storage.notificationSubscriptions.entries()) {
      for (const animeId of subscriptions) {
        // Check if new episode is available (placeholder)
        const episodes = Array.from(storage.episodes.values())
          .filter(ep => ep.animeId === animeId)
          .sort((a, b) => b.episodeNumber - a.episodeNumber);

        if (episodes.length > 0) {
          const latestEpisode = episodes[0];
          notifications.push({
            userId,
            animeId,
            episodeId: latestEpisode.id,
            title: `New episode available!`,
            message: `${latestEpisode.title} is now available`
          });
        }
      }
    }

    return notifications;
  },

  // Clean up stale data
  cleanupStaleData() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Clean old watch history (optional: keep records older than 30 days)
    for (const [userId, history] of storage.watchHistory.entries()) {
      const filtered = history.filter(h => {
        const watchDate = new Date(h.watchedAt);
        return watchDate > thirtyDaysAgo;
      });
      storage.watchHistory.set(userId, filtered);
    }

    return { cleaned: true };
  }
};

// Job scheduler (simple version - can be replaced with Bull/Agenda)
export class JobScheduler {
  constructor(io) {
    this.io = io;
    this.jobs = [];
  }

  schedule(name, interval, job) {
    const timer = setInterval(() => {
      try {
        const result = job();
        console.log(`Job executed: ${name}`, result);

        // Broadcast updates via Socket.io if needed
        if (name === 'trending') {
          this.io?.emit('trending-update', result);
        }
      } catch (error) {
        console.error(`Job failed: ${name}`, error);
      }
    }, interval);

    this.jobs.push({ name, timer });
  }

  start() {
    // Calculate trending every 5 minutes
    this.schedule('trending', 5 * 60 * 1000, () => {
      return jobs.updateTrendingRanks();
    });

    // Schedule episode notifications every 10 minutes
    this.schedule('notifications', 10 * 60 * 1000, () => {
      return jobs.scheduleEpisodeNotifications();
    });

    // Cleanup stale data every hour
    this.schedule('cleanup', 60 * 60 * 1000, () => {
      return jobs.cleanupStaleData();
    });

    console.log('Job scheduler started');
  }

  stop() {
    this.jobs.forEach(job => clearInterval(job.timer));
    console.log('Job scheduler stopped');
  }
}
