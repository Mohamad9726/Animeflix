import React, { useEffect } from 'react';
import { useAppStore } from '../store';
import { onTrendUpdate } from '../services/socket';
import './TrendsTicker.css';

export const TrendsTicker = () => {
  const { trends, setTrends, updateTrend } = useAppStore();

  useEffect(() => {
    const handleTrendUpdate = (trend) => {
      updateTrend(trend);
    };

    onTrendUpdate(handleTrendUpdate);
  }, [updateTrend]);

  const topTrends = trends.sort((a, b) => b.count - a.count).slice(0, 10);

  return (
    <div className="trends-ticker">
      <div className="ticker-header">
        <h3>Trending Now</h3>
      </div>
      <div className="ticker-content">
        {topTrends.length === 0 ? (
          <div className="no-trends">No trends yet</div>
        ) : (
          <div className="trends-list">
            {topTrends.map((trend, index) => (
              <div key={trend.id} className="trend-item">
                <span className="trend-rank">#{index + 1}</span>
                <span className="trend-name">{trend.name}</span>
                <span className="trend-count">{trend.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
