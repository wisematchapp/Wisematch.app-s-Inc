
import React, { useState } from 'react';
import { LeagueDetailView } from './components/LeagueDetailView';
import { CompetitionTable } from './components/CompetitionTable';
import { TeamDetailView } from './components/TeamDetailView';
import { MatchDetailView } from './components/MatchDetailView';
import { PlayerDetailView } from './components/PlayerDetailView';
import { BankrollDashboard } from './components/BankrollDashboard';
import { WinstonChat } from './components/WinstonChat';
import { BuildYourTip } from './components/BuildYourTip';
import { SettingsView } from './components/SettingsView';
import { Sidebar } from './components/Sidebar';
import { PromoLanding } from './PromoLanding';

function App() {
  // Inicializa em 'promo' conforme solicitado para dar acesso à Landing Page
  const [currentView, setCurrentView] = useState('promo'); 
  const [selectedLeagueId, setSelectedLeagueId] = useState<string | null>(null); 
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  const handleEnterApp = () => {
    setCurrentView('home');
  };

  const handleSelectCompetition = (id: string) => {
    setSelectedLeagueId(id);
    setSelectedTeamId(null);
    setSelectedMatchId(null);
    setSelectedPlayerId(null);
    window.scrollTo(0, 0);
  };

  const handleSelectTeam = (teamId: string) => {
    setSelectedTeamId(teamId);
    setSelectedMatchId(null);
    setSelectedPlayerId(null);
    window.scrollTo(0, 0);
  }

  const handleSelectMatch = (matchId: string) => {
    setSelectedMatchId(matchId);
    window.scrollTo(0, 0);
  }

  const handleSelectPlayer = (playerId: string) => {
    setSelectedPlayerId(playerId);
    window.scrollTo(0, 0);
  }

  const handleBackToTeam = () => {
    setSelectedMatchId(null);
    window.scrollTo(0, 0);
  }

  const handleBackToLeague = () => {
    setSelectedTeamId(null);
    window.scrollTo(0, 0);
  }

  const handleBackToPrevious = () => {
    setSelectedPlayerId(null);
    window.scrollTo(0, 0);
  }

  const handleBackToCompetitions = () => {
    setSelectedLeagueId(null);
    setSelectedTeamId(null);
    setSelectedMatchId(null);
    setSelectedPlayerId(null);
    window.scrollTo(0, 0);
  };

  const handleSidebarNavigation = (view: string) => {
      setCurrentView(view);
      // Reset detailed selections when switching top-level views
      if (view !== 'home') {
          setSelectedLeagueId(null);
          setSelectedTeamId(null);
          setSelectedMatchId(null);
          setSelectedPlayerId(null);
      } else {
          handleBackToCompetitions();
      }
      window.scrollTo(0, 0);
  }

  // Se a view for 'promo', renderiza a Landing Page exata
  if (currentView === 'promo') {
      return <PromoLanding onEnter={handleEnterApp} />;
  }

  const renderContent = () => {
      if (currentView === 'notifications') {
          return <BankrollDashboard />;
      }
      
      if (currentView === 'winston') {
          return <WinstonChat />;
      }

      if (currentView === 'build-tip') {
          return <BuildYourTip />;
      }

      if (currentView === 'settings') {
          return <SettingsView />;
      }

      // Default Home/Analytics View
      if (selectedPlayerId) {
          return <PlayerDetailView onBack={handleBackToPrevious} playerId={selectedPlayerId} />;
      } else if (selectedMatchId) {
          return <MatchDetailView onBack={handleBackToTeam} matchId={selectedMatchId} onPlayerClick={handleSelectPlayer} />;
      } else if (selectedTeamId) {
          return <TeamDetailView onBack={handleBackToLeague} teamId={selectedTeamId} onMatchClick={handleSelectMatch} />;
      } else if (selectedLeagueId) {
          return <LeagueDetailView onBack={handleBackToCompetitions} onTeamClick={handleSelectTeam} onPlayerClick={handleSelectPlayer} />;
      } else {
          return <CompetitionTable onSelectCompetition={handleSelectCompetition} />;
      }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      
      {/* Sidebar Navigation */}
      <Sidebar onNavigate={handleSidebarNavigation} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative w-full">
        
        {/* Top Decoration Line */}
        <div className="h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 w-full sticky top-0 z-50"></div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 min-h-full">
            {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
