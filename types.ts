
export interface Competition {
  id: string;
  country: string;
  league: string;
  region: RegionFilter; // Added region for filtering
  logo?: string; 
  status: 'Em curso' | 'Terminado';
  year: string;
  progress: number;
  homeWin: number;
  draw: number;
  awayWin: number;
  avgGoals: number;
  btts: number;
  over15: number;
  over25: number;
  corners: number;
  avgCards: number; 
  totalGames: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  type: 'attack' | 'defense';
}

export enum RegionFilter {
  ALL = 'Todos',
  EUROPE = 'Europa',
  SOUTH_AMERICA = 'América do Sul',
  NORTH_AMERICA = 'América do Norte',
  ASIA = 'Ásia',
  AFRICA = 'África',
  WORLD = 'Mundo' // Added World category
}

// Detailed View Types
export interface TeamStanding {
  team: string;
  logo?: string; 
  meritRank: number;
  actualRank: number;
  deltaScore: number; 
  xgDelta: number; 
  aiStatus: 'STABLE' | 'UNLUCKY' | 'CAUTION' | 'MAX VALUE' | 'RISK';
  aiDescription: string;
}

export interface PlayerStat {
  rank: number;
  name: string;
  team: string;
  value: number;
}

export interface TeamStatRank {
  rank: number;
  team: string;
  logo?: string; 
  value: number; 
  perMatch: number;
}

export interface LeagueStats {
  goalsPerMatch: number;
  cornersPerMatch: number;
  yellowCardsPerMatch: number;
  redCardsPerMatch: number;
  homeAdvantage: number;
  homeWinPercentage: number;
  drawPercentage: number;
  awayWinPercentage: number;
  minutesPerGoal: number;
  cleanSheetsPercentage: number;
  bttsPercentage: number;
}

export interface GoalTiming {
  interval: string;
  value: number;
  type?: 'home' | 'away'; // Added optional type for specific team breakdown if needed
}

export interface RadarData {
  subject: string;
  A: number; // Team / Home
  B: number; // League Avg / Away
  C?: number; // Cluster Avg
  fullMark: number;
}

// --- PLAYER DETAIL TYPES (NEW) ---

export interface SubstituteOption {
  id: string;
  name: string;
  metrics: { label: string; player: number; sub: number }[];
  tacticalAnalysis: string;
  impactAnalysis: string;
}

export interface PlayerDetail {
  id: string;
  name: string;
  position: string;
  team: string;
  photo: string;
  teamLogo: string;
  
  // 1. Impact Score
  impactScore: number; // 0 to 10
  impactLabel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'ROTATION';
  
  // AI Analysis
  aiAnalysis: string;

  // 2. Efficiency Panel
  stats: {
    goalsPer90: number;
    minutesPlayedPercent: number; // Dependence
    teamGoalContribution: number; // % Share
    cardRisk: 'Low' | 'Medium' | 'High';
    matchesPlayed: number;
    minutesPlayed: number;
    totalGoals: number;
  };

  // 3. Predictive Analysis
  predictive: {
    xgLoss: number; // e.g. -0.45
    winRateWith: number;
    winRateWithout: number;
    tacticalVulnerability: string;
    marketImpact: string; // "Over 2.5 Goals"
    substituteComparison: {
      subName: string;
      metrics: { label: string; player: number; sub: number }[]; // Comparison data for chart
    };
    substitutes?: SubstituteOption[]; // New field for selectable substitutes
  };
}

// --- TEAM DETAIL SPECIFIC TYPES ---

export interface TeamDetail {
  id: string;
  name: string;
  league: string;
  logo: string;
  aiRank: string;
  delta: string;
  status: 'UNLUCKY' | 'STABLE' | 'RISK';
  
  // Section 1: DNA
  clusterName: string;
  clusterTags: string;
  tacticalRadar: RadarData[];
  aiAnalysis: string;

  // Section 2: Vulnerabilities & Spec
  vulnerabilityText: string;
  counterAttackVulnerability: number;
  vulnerabilityMetrics: {
    timeWindow: string;
    timeWindowRisk: string; // e.g., "High Risk"
    periodXG: string;
    periodXGDesc: string;
    lossRate: string;
    lossRateDesc: string;
    suggestedBet: string;
  };
  
  specializationData: { 
      category: string; 
      openPlay: number; 
      setPiece: number; 
      counter: number; 
  }[];
  specializationNote: string;

  // Section 3: Trends
  xgTrend: { match: string; value: number }[];
  xgTrendInsight: string;

  // Section 4: Performance Tabs Data
  statsTabs: {
    performance: { label: string; value: number; leagueAvg: number }[];
    goals: { label: string; value: number; leagueAvg: number }[];
    shots: { label: string; value: number; leagueAvg: number }[];
    halves: { label: string; value: number; leagueAvg: number }[];
    over: { label: string; value: number; leagueAvg: number }[];
    under: { label: string; value: number; leagueAvg: number }[];
    moments: { label: string; value: number; leagueAvg: number }[];
    extras: { label: string; value: number; leagueAvg: number }[];
  };

  // Section 5: Context
  absenceImpact: {
    lossXG: number;
    description: string;
  };
  upcomingMatches: {
    id: string; // Added ID for routing
    opponent: string;
    logo?: string;
    date: string;
    venue: 'HOME' | 'AWAY';
    difficultyColor: string; // red, yellow, green
  }[];
}

// --- MATCH DETAIL (H2H) TYPES ---

export interface StatItem {
  label: string;
  home: number | string;
  away: number | string;
  unit?: string;
}

export interface StatSection {
  title: string;
  iconType: 'chart' | 'ball' | 'target' | 'clock' | 'flag' | 'card' | 'grid' | 'timer' | 'trending-up' | 'trending-down' | 'shield';
  items: StatItem[];
}

export interface SquadAbsence {
    player: string;
    position: string;
    team: 'home' | 'away';
    reason: 'Lesão' | 'Suspensão' | 'Internacional' | 'Dúvida';
    importance: 'Crítico' | 'Alto' | 'Moderado' | 'Rotação';
    tacticalImpact: string; // Specific impact of this player missing
}

export interface MatchDetail {
  id: string;
  homeTeam: { name: string; logo: string; cluster: string };
  awayTeam: { name: string; logo: string; cluster: string };
  date: string;
  competition: string;
  
  // 1. Executive Summary
  mainPrediction: {
    label: string;
    probability: number;
    color: string; // hex
  };
  aiSummary: string;

  // 2. Tactical Clash
  clashTitle: string;
  clashAnalysis: string;
  tacticalComparison: { subject: string; home: number; away: number; fullMark: number }[]; // Unified comparison

  // Detailed Comparison Tabs (Home vs Away)
  statsTabs: {
    performance: { label: string; home: number; away: number }[];
    goals: { label: string; home: number; away: number }[];
    shots: { label: string; home: number; away: number }[];
    halves: { label: string; home: number; away: number }[];
    over: { label: string; home: number; away: number }[];
    under: { label: string; home: number; away: number }[];
    moments: { label: string; home: number; away: number }[];
    extras: { label: string; home: number; away: number }[];
  };

  // Detailed Full List Stats
  detailedStats: StatSection[];
  
  // Detailed Text Analysis Report
  comprehensiveAnalysis: string;

  // Comparative Trend
  xgTrend: { match: string; home: number; away: number }[];
  xgTrendInsight: string;
  bttsLast5: number; // Added for H2H visual

  // Vulnerability & Spec Comparison
  vulnerabilityComparison: {
      home: { text: string; counterRisk: number };
      away: { text: string; counterRisk: number };
  };
  vulnerabilityInsight: string; // New insight field for vulnerability scenarios

  // Rich Metrics for detailed cards
  detailedMetrics: {
      home: {
          vulnerabilityText: string;
          counterAttackVulnerability: number;
          vulnerabilityMetrics: {
            timeWindow: string;
            timeWindowRisk: string;
            periodXG: string;
            periodXGDesc: string;
            lossRate: string;
            lossRateDesc: string;
            suggestedBet: string;
          };
          specializationData: { category: string; openPlay: number; setPiece: number; counter: number }[];
          specializationNote: string;
      };
      away: {
          vulnerabilityText: string;
          counterAttackVulnerability: number;
          vulnerabilityMetrics: {
            timeWindow: string;
            timeWindowRisk: string;
            periodXG: string;
            periodXGDesc: string;
            lossRate: string;
            lossRateDesc: string;
            suggestedBet: string;
          };
          specializationData: { category: string; openPlay: number; setPiece: number; counter: number }[];
          specializationNote: string;
      };
  };

  specializationComparison: {
      home: { category: string; openPlay: number; setPiece: number; counter: number }[];
      away: { category: string; openPlay: number; setPiece: number; counter: number }[];
  };

  // 3. Vulnerabilities & Context Cards
  timingChart: { interval: string; homeScored: number; awayConceded: number; riskLevel: number }[];
  timingInsight: string;
  
  // Improved Absences Structure
  squadContext: {
    homeAbsences: SquadAbsence[];
    awayAbsences: SquadAbsence[];
    netXGImpactHome: number;
    netXGImpactAway: number;
    insight: string;
  };
  
  // Improved Discipline Structure
  discipline: {
    referee: string;
    style: string; // e.g., "Rigoroso", "Deixa Jogar"
    stats: {
        avgFouls: number;
        avgYellows: number;
        avgReds: number;
        penaltiesAwarded: number; // percentage or count
    };
    conflictIndex: number; // 1-10
    insight: string;
  };
  
  // Improved Weather Structure
  weather: {
    condition: string;
    temperature: string;
    humidity: string;
    wind: string;
    precipitation: string;
    impact: string;
    iconType: 'wind' | 'rain' | 'sun' | 'snow' | 'cloud'; 
  };

  // 4. Statistical Validation
  validationMetrics: {
    label: string;
    historicalAvg: number;
    aiProbability: number;
    trend: 'up' | 'down' | 'stable';
  }[];
  
  // Legacy support
  comparativeData?: any; 
  absenceImpact?: any; // kept for compatibility if needed, but superseded by squadContext
}

// --- BANKROLL MANAGEMENT TYPES ---
export interface BankrollBet {
    id: string;
    date: string;
    event: string;
    market: string;
    selection: string;
    odd: number;
    stake: number;
    result: 'WIN' | 'LOSS' | 'PUSH' | 'PENDING';
    profit: number;
    bankrollAfter: number;
    playerContext?: string; // For "Player X Absent" feature
}

export interface BankrollStats {
    initialBank: number;
    currentBank: number;
    totalProfit: number;
    profitPercentage: number;
    totalBets: number;
    wins: number;
    losses: number;
    winRate: number;
    avgOdd: number;
    avgStake: number;
    maxDrawdownValue: number;
    maxDrawdownPercent: number;
    yield: number;
    expectancy: number;
    
    // Performance Indicators
    sharpeRatio: number;
    kellyEfficiency: number;
    profitFactor: number;
    hitRate: number;

    // Chart Data
    evolutionData: { date: string; value: number }[];
    marketProfitData: { market: string; profit: number }[];
}