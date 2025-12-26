
import React, { useState } from 'react';

const LEAGUES = [
  {
    id: 'pl',
    name: 'Premier League',
    teams: [
      { id: 1, meritRank: 1, realRank: 2, name: 'Man City', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg', deltaScore: 1, deltaTrend: 'up', xgDelta: '+0.8', analysis: { type: 'positive', title: 'Elite Performance', description: 'Consistent top-tier metrics across all simulations.' } },
      { id: 2, meritRank: 2, realRank: 1, name: 'Arsenal', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg', deltaScore: -1, deltaTrend: 'down', xgDelta: '-0.2', analysis: { type: 'warning', title: 'Points Surplus', description: 'Slightly overperforming points vs expected threat.' } },
      { id: 3, meritRank: 3, realRank: 3, name: 'Liverpool', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg', deltaScore: 0, deltaTrend: 'stable', xgDelta: '+0.1', analysis: { type: 'neutral', title: 'Stable Trend', description: 'Performance aligned with current league position.' } },
      { id: 4, meritRank: 4, realRank: 9, name: 'Chelsea', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg', deltaScore: 5, deltaTrend: 'strong_up', xgDelta: '+4.2', analysis: { type: 'positive', title: 'High Value', description: 'Huge gap between merit and results. Value pick.' } },
    ]
  },
  {
    id: 'll',
    name: 'La Liga',
    teams: [
      { id: 10, meritRank: 1, realRank: 1, name: 'Real Madrid', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg', deltaScore: 0, deltaTrend: 'stable', xgDelta: '+0.4', analysis: { type: 'positive', title: 'Dominant', description: 'Maintaining elite level with high conversion rate.' } },
      { id: 11, meritRank: 2, realRank: 3, name: 'Barcelona', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg', deltaScore: 1, deltaTrend: 'up', xgDelta: '+1.2', analysis: { type: 'positive', title: 'Under-rewarded', description: 'Generating high xG with poor finishing variance.' } },
    ]
  }
];

const TrendIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'strong_up': return <span className="material-symbols-outlined trend-icon up">keyboard_double_arrow_up</span>;
    case 'up': return <span className="material-symbols-outlined trend-icon up">keyboard_arrow_up</span>;
    case 'strong_down': return <span className="material-symbols-outlined trend-icon down">keyboard_double_arrow_down</span>;
    case 'down': return <span className="material-symbols-outlined trend-icon down">keyboard_arrow_down</span>;
    default: return <span className="material-symbols-outlined trend-icon stable">remove</span>;
  }
};

export const HeroLeagueTable: React.FC = () => {
  const [selectedLeagueId, setSelectedLeagueId] = useState(LEAGUES[0].id);
  const selectedLeague = LEAGUES.find(l => l.id === selectedLeagueId) || LEAGUES[0];

  return (
    <div className="league-table-container">
      <header className="table-header">
        <div className="header-content">
          <div className="live-indicator">
            <div className="live-dot">
              <div className="live-dot-ping"></div>
              <div className="live-dot-core"></div>
            </div>
            <span className="live-text">WISEMATCH.AI PERFORMANCE ENGINE</span>
          </div>
          
          <h2 className="league-title">{selectedLeague.name}</h2>
          
          <p className="league-subtitle">
            Real-time monitoring of <span className="highlight-text">Merit vs Reality</span> based on advanced predictive modeling.
          </p>
        </div>

        <div className="league-selector">
          <select
            value={selectedLeagueId}
            onChange={e => setSelectedLeagueId(e.target.value)}
            className="league-selector-hidden"
          >
            {LEAGUES.map(league => (
              <option key={league.id} value={league.id}>{league.name}</option>
            ))}
          </select>
          
          <div className="league-selector-visible">
            <span className="selector-text">Select League</span>
            <div className="selector-icon-wrapper">
              <span className="material-symbols-outlined selector-icon">swap_vert</span>
            </div>
          </div>
        </div>
      </header>

      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>Merit Rank</th>
              <th>Actual Rank</th>
              <th>Clube</th>
              <th>Delta Score</th>
              <th>xG Delta</th>
              <th>AI Analytics Insight</th>
            </tr>
          </thead>
          <tbody>
            {selectedLeague.teams.map(team => (
              <tr key={team.id}>
                <td>
                  <div className="merit-rank">
                    <span className="merit-rank-value">{team.meritRank}º</span>
                  </div>
                </td>

                <td>
                  <div className="real-rank">
                    <span className="real-rank-value">{team.realRank}º</span>
                  </div>
                </td>

                <td>
                  <div className="team-info">
                    <div className="team-logo-container">
                      <img src={team.logoUrl} alt={team.name} className="team-logo" />
                    </div>
                    <span className="team-name">{team.name}</span>
                  </div>
                </td>

                <td>
                  <div className="delta-score">
                    <span className={`delta-value ${team.deltaScore === 0 ? 'zero' : ''}`}>
                      {team.deltaScore > 0 ? `+${team.deltaScore}` : team.deltaScore}
                    </span>
                    <TrendIcon type={team.deltaTrend} />
                  </div>
                </td>

                <td>
                  <span className={`xg-delta ${team.xgDelta.startsWith('-') ? 'negative' : 'positive'}`}>
                    {team.xgDelta}
                  </span>
                </td>
                
                <td>
                  <div className="analysis-cell">
                    <span className={`analysis-title ${team.analysis.type}`}>
                      {team.analysis.title}
                    </span>
                    <span className="analysis-description">
                      {team.analysis.description}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
