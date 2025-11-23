import React from 'react';
import './RecommendationPanel.css';

export const RecommendationPanel = ({ recommendations = [], watchQueue = [] }) => {
  return (
    <div className="recommendation-panel">
      <div className="panel-section">
        <h3>Recommended For You</h3>
        <div className="items-grid">
          {recommendations.length === 0 ? (
            <div className="no-items">No recommendations yet</div>
          ) : (
            recommendations.map((rec) => (
              <div key={rec.id} className="recommendation-card">
                <div className="card-image">{rec.image || '📺'}</div>
                <h4>{rec.title}</h4>
                <p>{rec.description}</p>
                <div className="card-footer">
                  <span className="score">⭐ {rec.score || '8.5'}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="panel-section">
        <h3>Watch Queue</h3>
        <div className="queue-list">
          {watchQueue.length === 0 ? (
            <div className="no-items">Queue is empty</div>
          ) : (
            watchQueue.map((item, index) => (
              <div key={item.id} className="queue-item">
                <span className="queue-number">{index + 1}</span>
                <div className="queue-info">
                  <h5>{item.title}</h5>
                  <p>{item.episode}</p>
                </div>
                <span className="queue-status">{item.status}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
