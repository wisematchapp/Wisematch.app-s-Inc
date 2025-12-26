import { 
    Competition, 
    TeamStanding, 
    PlayerStat, 
    LeagueStats, 
    GoalTiming, 
    RadarData, 
    TeamStatRank, 
    RegionFilter, 
    TeamDetail, 
    MatchDetail, 
    PlayerDetail, 
    BankrollStats, 
    BankrollBet 
} from './types';

// --- LEAGUE DATA ---

export const COMPETITIONS_DATA: Competition[] = [
  {
    id: 'premier-league',
    country: 'Inglaterra',
    league: 'Premier League',
    region: RegionFilter.EUROPE,
    logo: 'https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg',
    status: 'Em curso',
    year: '2023/24',
    progress: 85,
    homeWin: 46,
    draw: 24,
    awayWin: 30,
    avgGoals: 3.24,
    btts: 62,
    over15: 88,
    over25: 65,
    corners: 10.4,
    avgCards: 4.2,
    totalGames: 380
  },
  {
    id: 'la-liga',
    country: 'Espanha',
    league: 'La Liga',
    region: RegionFilter.EUROPE,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/LaLiga_EA_Sports_2023_Vertical_Logo.svg/1200px-LaLiga_EA_Sports_2023_Vertical_Logo.svg.png',
    status: 'Em curso',
    year: '2023/24',
    progress: 82,
    homeWin: 44,
    draw: 28,
    awayWin: 28,
    avgGoals: 2.64,
    btts: 52,
    over15: 75,
    over25: 48,
    corners: 9.2,
    avgCards: 4.8,
    totalGames: 380
  },
  {
      id: 'bundesliga',
      country: 'Alemanha',
      league: 'Bundesliga',
      region: RegionFilter.EUROPE,
      status: 'Em curso',
      year: '2023/24',
      progress: 80,
      homeWin: 48,
      draw: 22,
      awayWin: 30,
      avgGoals: 3.45,
      btts: 65,
      over15: 90,
      over25: 68,
      corners: 10.1,
      avgCards: 3.8,
      totalGames: 306
  },
   {
      id: 'serie-a',
      country: 'Itália',
      league: 'Serie A',
      region: RegionFilter.EUROPE,
      status: 'Em curso',
      year: '2023/24',
      progress: 84,
      homeWin: 42,
      draw: 29,
      awayWin: 29,
      avgGoals: 2.85,
      btts: 58,
      over15: 78,
      over25: 52,
      corners: 9.5,
      avgCards: 4.5,
      totalGames: 380
  },
  {
      id: 'brasileirao',
      country: 'Brasil',
      league: 'Série A',
      region: RegionFilter.SOUTH_AMERICA,
      status: 'Terminado',
      year: '2023',
      progress: 100,
      homeWin: 49,
      draw: 25,
      awayWin: 26,
      avgGoals: 2.45,
      btts: 50,
      over15: 72,
      over25: 45,
      corners: 10.8,
      avgCards: 5.2,
      totalGames: 380
  }
];

export const PREMIER_LEAGUE_STANDINGS: TeamStanding[] = [
    { team: 'Man City', logo: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg', meritRank: 1, actualRank: 2, deltaScore: 1, xgDelta: 0.8, aiStatus: 'STABLE', aiDescription: 'Performance consistente com métricas de elite.' },
    { team: 'Arsenal', logo: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg', meritRank: 2, actualRank: 1, deltaScore: -1, xgDelta: -0.2, aiStatus: 'RISK', aiDescription: 'Ligeira superperformance em pontos.' },
    { team: 'Liverpool', logo: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg', meritRank: 3, actualRank: 3, deltaScore: 0, xgDelta: 0.1, aiStatus: 'STABLE', aiDescription: 'Alinhado com o esperado.' },
    { team: 'Aston Villa', logo: 'https://upload.wikimedia.org/wikipedia/en/f/f9/Aston_Villa_FC_crest_%282016%29.svg', meritRank: 6, actualRank: 4, deltaScore: -2, xgDelta: -6.1, aiStatus: 'RISK', aiDescription: 'Risco de regressão severa.' },
    { team: 'Tottenham', logo: 'https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg', meritRank: 5, actualRank: 5, deltaScore: 0, xgDelta: 0.5, aiStatus: 'STABLE', aiDescription: 'Bom equilíbrio ofensivo.' },
    { team: 'Chelsea', logo: 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg', meritRank: 4, actualRank: 9, deltaScore: 5, xgDelta: 4.2, aiStatus: 'MAX VALUE', aiDescription: 'Resultados não refletem domínio em campo.' },
    { team: 'Man Utd', logo: 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg', meritRank: 11, actualRank: 6, deltaScore: -5, xgDelta: -3.5, aiStatus: 'CAUTION', aiDescription: 'Dependência de momentos individuais.' },
    { team: 'Newcastle', logo: 'https://upload.wikimedia.org/wikipedia/en/5/56/Newcastle_United_Logo.svg', meritRank: 7, actualRank: 8, deltaScore: 1, xgDelta: 0.9, aiStatus: 'STABLE', aiDescription: 'Sólido defensivamente.' },
];

export const PREMIER_LEAGUE_TOP_SCORERS: PlayerStat[] = [
    { rank: 1, name: 'Haaland', team: 'Man City', value: 18 },
    { rank: 2, name: 'Salah', team: 'Liverpool', value: 15 },
    { rank: 3, name: 'Solanke', team: 'Bournemouth', value: 14 },
    { rank: 4, name: 'Watkins', team: 'Aston Villa', value: 13 },
    { rank: 5, name: 'Son', team: 'Tottenham', value: 12 },
];

export const PREMIER_LEAGUE_ASSISTS: PlayerStat[] = [
    { rank: 1, name: 'Watkins', team: 'Aston Villa', value: 10 },
    { rank: 2, name: 'Trippier', team: 'Newcastle', value: 10 },
    { rank: 3, name: 'Salah', team: 'Liverpool', value: 9 },
    { rank: 4, name: 'Neto', team: 'Wolves', value: 8 },
    { rank: 5, name: 'Alvarez', team: 'Man City', value: 8 },
];

export const PREMIER_LEAGUE_STATS: LeagueStats = {
    goalsPerMatch: 3.24,
    cornersPerMatch: 10.4,
    yellowCardsPerMatch: 4.2,
    redCardsPerMatch: 0.12,
    homeAdvantage: 15,
    homeWinPercentage: 46,
    drawPercentage: 24,
    awayWinPercentage: 30,
    minutesPerGoal: 28,
    cleanSheetsPercentage: 22,
    bttsPercentage: 62
};

export const GOALS_PER_15_MIN: GoalTiming[] = [
    { interval: '0-15', value: 12 },
    { interval: '16-30', value: 14 },
    { interval: '31-45', value: 18 },
    { interval: '46-60', value: 15 },
    { interval: '61-75', value: 16 },
    { interval: '76-90', value: 25 },
];

export const LEAGUE_DNA_DATA: RadarData[] = [
    { subject: 'Intensidade', A: 95, B: 70, fullMark: 100 },
    { subject: 'Técnica', A: 88, B: 65, fullMark: 100 },
    { subject: 'Tática', A: 85, B: 80, fullMark: 100 },
    { subject: 'Físico', A: 90, B: 75, fullMark: 100 },
    { subject: 'Velocidade', A: 92, B: 60, fullMark: 100 },
    { subject: 'Agressividade', A: 75, B: 75, fullMark: 100 },
];

export const BEST_ATTACK: TeamStatRank[] = [
    { rank: 1, team: 'Man City', logo: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg', value: 62, perMatch: 2.58 },
    { rank: 2, team: 'Liverpool', logo: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg', value: 59, perMatch: 2.45 },
    { rank: 3, team: 'Arsenal', logo: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg', value: 58, perMatch: 2.41 },
];

export const WORST_ATTACK: TeamStatRank[] = [
    { rank: 20, team: 'Sheffield Utd', value: 22, perMatch: 0.91 },
    { rank: 19, team: 'Burnley', value: 25, perMatch: 1.04 },
    { rank: 18, team: 'Everton', value: 28, perMatch: 1.16 },
];

export const BEST_DEFENSE: TeamStatRank[] = [
    { rank: 1, team: 'Arsenal', logo: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg', value: 22, perMatch: 0.91 },
    { rank: 2, team: 'Liverpool', logo: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg', value: 24, perMatch: 1.00 },
    { rank: 3, team: 'Man City', logo: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg', value: 26, perMatch: 1.08 },
];

export const WORST_DEFENSE: TeamStatRank[] = [
    { rank: 20, team: 'Sheffield Utd', value: 65, perMatch: 2.70 },
    { rank: 19, team: 'Burnley', value: 55, perMatch: 2.29 },
    { rank: 18, team: 'Luton', value: 48, perMatch: 2.00 },
];


// --- TEAM DETAIL MOCK ---

export const TEAM_DETAIL_MOCK: TeamDetail = {
    id: 'sporting-cp',
    name: 'Sporting CP',
    league: 'Primeira Liga',
    logo: 'https://upload.wikimedia.org/wikipedia/en/3/3e/Sporting_Clube_de_Portugal_logo.svg',
    aiRank: 'Top Tier (Cluster #5)',
    delta: '+2.4 xG Diff',
    status: 'UNLUCKY',
    clusterName: 'Sustainable Attacker',
    clusterTags: 'High Possession • High Press • Vertical',
    tacticalRadar: [
      { subject: 'Offensive Pressure', A: 92, B: 65, C: 85, fullMark: 100 },
      { subject: 'Defensive Structure', A: 75, B: 60, C: 80, fullMark: 100 },
      { subject: 'Transition Speed', A: 88, B: 55, C: 75, fullMark: 100 },
      { subject: 'Ball Retention', A: 85, B: 50, C: 70, fullMark: 100 },
      { subject: 'Set Piece Efficiency', A: 45, B: 50, C: 60, fullMark: 100 },
      { subject: 'Aggression', A: 60, B: 70, C: 55, fullMark: 100 },
    ],
    aiAnalysis: "Wisematch.AI Simulation: Key vulnerability identified in Finishing Efficiency. Team generates high volume (Offensive Pressure: 92) but converts below cluster average (65), indicating waste. Defensive Structure also slightly below expected for this profile.",
    vulnerabilityText: "Historically, Cluster #5 has a 45% loss rate against teams using rapid transitions and long passes after the 60th minute. Look for teams that play direct counter-attack.",
    counterAttackVulnerability: 75,
    vulnerabilityMetrics: {
        timeWindow: "60-90 min",
        timeWindowRisk: "High Risk",
        periodXG: "0.85 xGA",
        periodXGDesc: "Above Avg",
        lossRate: "45%",
        lossRateDesc: "vs Direct Teams",
        suggestedBet: "Live: Over 0.5 Goals (Away) @ 65'"
    },
    specializationData: [
        { category: 'Attack', openPlay: 75, setPiece: 10, counter: 15 },
        { category: 'Defense', openPlay: 50, setPiece: 45, counter: 5 },
    ],
    specializationNote: "Critical vulnerability in set pieces. Chart indicates 55% of xG conceded is from corners/free kicks, significantly above average for possession teams.",
    xgTrend: [
        { match: 'M1', value: -0.5 },
        { match: 'M2', value: 0.2 },
        { match: 'M3', value: 0.8 },
        { match: 'M4', value: 1.2 },
        { match: 'M5', value: 0.5 },
        { match: 'M6', value: 1.5 },
        { match: 'M7', value: 2.0 },
        { match: 'M8', value: 1.8 },
        { match: 'M9', value: 2.4 },
        { match: 'M10', value: 2.1 },
    ],
    xgTrendInsight: "Steady upward trend in xG Delta over the last 5 matches indicates peaking form. The dip in M5 was an outlier due to a red card.",
    statsTabs: {
        performance: [
            { label: 'Wins', value: 75, leagueAvg: 45 },
            { label: 'Draws', value: 15, leagueAvg: 25 },
            { label: 'Losses', value: 10, leagueAvg: 30 },
            { label: 'Possession', value: 62, leagueAvg: 50 },
        ],
        goals: [
            { label: 'Scored', value: 2.4, leagueAvg: 1.3 },
            { label: 'Conceded', value: 0.8, leagueAvg: 1.3 },
            { label: 'xG For', value: 2.6, leagueAvg: 1.2 },
            { label: 'xG Against', value: 0.9, leagueAvg: 1.3 },
        ],
        shots: [
            { label: 'Total Shots', value: 16.5, leagueAvg: 11.0 },
            { label: 'On Target', value: 6.2, leagueAvg: 3.8 },
            { label: 'Accuracy', value: 38, leagueAvg: 34 },
        ],
        halves: [
            { label: '1H Goals', value: 18, leagueAvg: 12 },
            { label: '2H Goals', value: 32, leagueAvg: 16 },
            { label: '1H Win%', value: 55, leagueAvg: 30 },
            { label: '2H Win%', value: 62, leagueAvg: 30 },
            { label: '1H Possession', value: 65, leagueAvg: 50 },
            { label: '2H Possession', value: 59, leagueAvg: 50 },
        ],
        over: [
            { label: '+0.5', value: 95, leagueAvg: 90 },
            { label: '+1.5', value: 85, leagueAvg: 70 },
            { label: '+2.5', value: 65, leagueAvg: 45 },
            { label: '+3.5', value: 30, leagueAvg: 25 },
        ],
        under: [
            { label: '-3.5', value: 70, leagueAvg: 75 },
            { label: '-2.5', value: 35, leagueAvg: 55 },
            { label: '-1.5', value: 15, leagueAvg: 30 },
            { label: '-0.5', value: 5, leagueAvg: 10 },
        ],
        moments: [
            { label: '0-15', value: 0.3, leagueAvg: 0.2 },
            { label: '16-30', value: 0.4, leagueAvg: 0.25 },
            { label: '31-45', value: 0.6, leagueAvg: 0.35 },
            { label: '46-60', value: 0.5, leagueAvg: 0.3 },
            { label: '61-75', value: 0.5, leagueAvg: 0.4 },
            { label: '76-90', value: 0.8, leagueAvg: 0.5 },
        ],
        extras: [
            { label: 'Corners', value: 6.5, leagueAvg: 4.5 },
            { label: 'Yellows', value: 1.8, leagueAvg: 2.2 },
            { label: 'Red Cards', value: 0.1, leagueAvg: 0.15 },
            { label: 'Fouls', value: 9.5, leagueAvg: 11.0 },
            { label: 'Offsides', value: 2.1, leagueAvg: 1.5 },
        ]
    },
    absenceImpact: {
        lossXG: 0.45,
        description: "Pote (Absent) removes central creativity."
    },
    upcomingMatches: [
        { id: 'm1', opponent: 'Benfica', logo: 'https://upload.wikimedia.org/wikipedia/en/a/a2/SL_Benfica_logo.svg', date: '2023-11-12', venue: 'HOME', difficultyColor: 'red' },
        { id: 'm2', opponent: 'Porto', logo: 'https://upload.wikimedia.org/wikipedia/en/4/4b/FC_Porto_logo.svg', date: '2023-11-19', venue: 'AWAY', difficultyColor: 'red' },
        { id: 'm3', opponent: 'Braga', logo: 'https://upload.wikimedia.org/wikipedia/en/7/79/S.C._Braga_logo.svg', date: '2023-11-26', venue: 'HOME', difficultyColor: 'orange' },
    ]
};

// --- MATCH DETAIL MOCK ---

export const MATCH_DETAIL_MOCK: MatchDetail = {
    id: 'slb-scp-2023',
    homeTeam: { name: 'Benfica', logo: 'https://upload.wikimedia.org/wikipedia/en/a/a2/SL_Benfica_logo.svg', cluster: 'Possession Dominant' },
    awayTeam: { name: 'Sporting CP', logo: 'https://upload.wikimedia.org/wikipedia/en/3/3e/Sporting_Clube_de_Portugal_logo.svg', cluster: 'Sustainable Attacker' },
    date: '12 Nov 2023 • 20:30',
    competition: 'Primeira Liga • Jornada 11',
    mainPrediction: {
        label: 'Over 2.5 Goals',
        probability: 72,
        color: '#6366f1'
    },
    aiSummary: `O clássico apresenta um confronto de alta voltagem ofensiva. O Benfica (Casa) tem um xG/jogo de 2.1, enquanto o Sporting (Fora) apresenta 2.4. 
    
    A nossa simulação (10.000 iterações) aponta para um jogo aberto, com 72% de probabilidade de Over 2.5 Golos. O Sporting tem uma ligeira vantagem no momento de forma (xG Delta positivo), mas a vulnerabilidade em bolas paradas pode ser explorada por Otamendi e António Silva.`,
    clashTitle: 'Duelo de Titãs Ofensivos',
    clashAnalysis: "Ambas as equipas priorizam o ataque em Open Play, mas diferem na defesa. O Benfica é mais sólido em bolas paradas, enquanto o Sporting sofre muito nessa fase.",
    tacticalComparison: [
        { subject: 'Attack', home: 88, away: 92, fullMark: 100 },
        { subject: 'Defense', home: 82, away: 75, fullMark: 100 },
        { subject: 'Possession', home: 58, away: 52, fullMark: 100 }, // in head to head
        { subject: 'Intensity', home: 85, away: 90, fullMark: 100 },
    ],
    statsTabs: {
        performance: [
            { label: 'Win Rate', home: 80, away: 75 },
            { label: 'Form (5)', home: 12, away: 15 }, // Points
        ],
        goals: [
            { label: 'Scored', home: 2.1, away: 2.4 },
            { label: 'Conceded', home: 0.6, away: 0.9 },
        ],
        shots: [], halves: [], over: [], under: [], moments: [], extras: []
    },
    detailedStats: [
        {
            title: 'Geral',
            iconType: 'grid',
            items: [
                { label: 'Posse de Bola', home: '58%', away: '52%' },
                { label: 'xG Esperado', home: 1.85, away: 1.92 },
                { label: 'Golos Marcados', home: 2.1, away: 2.4 },
                { label: 'Golos Sofridos', home: 0.6, away: 0.9 },
                { label: 'Clean Sheets', home: '50%', away: '30%' },
            ]
        },
        {
            title: 'Ataque',
            iconType: 'target',
            items: [
                { label: 'Remates/J', home: 15.5, away: 16.2 },
                { label: 'Remates à Baliza', home: 5.8, away: 6.1 },
                { label: 'Grandes Oportunidades', home: 3.2, away: 3.5 },
                { label: 'Conversão (%)', home: '13%', away: '15%' },
                { label: 'Cantos a Favor', home: 7.2, away: 6.5 },
            ]
        },
        {
            title: 'Defesa & Disciplina',
            iconType: 'shield',
            items: [
                { label: 'Remates Sofridos/J', home: 8.5, away: 9.8 },
                { label: 'Cortes/J', home: 14.2, away: 12.5 },
                { label: 'Duelos Ganhos (%)', home: '52%', away: '48%' },
                { label: 'Cartões Amarelos', home: 2.1, away: 2.4 },
                { label: 'Faltas Cometidas', home: 12.5, away: 13.8 },
            ]
        },
        {
            title: 'Over/Under Detalhado',
            iconType: 'trending-up',
            items: [
                { label: 'Over 0.5 Marcados', home: '95%', away: '98%' },
                { label: 'Over 1.5 Marcados', home: '75%', away: '82%' },
                { label: 'Over 2.5 Marcados', home: '45%', away: '55%' },
                { label: 'Under 0.5 Sofridos', home: '50%', away: '30%' },
                { label: 'Under 1.5 Sofridos', home: '85%', away: '70%' },
            ]
        }
    ],
    comprehensiveAnalysis: "...",
    xgTrend: [],
    xgTrendInsight: "...",
    bttsLast5: 60,
    vulnerabilityComparison: {
        home: { text: "Susceptível a contra-ataques rápidos nas laterais.", counterRisk: 65 },
        away: { text: "Fraco em bolas paradas defensivas (cantos).", counterRisk: 80 }
    },
    vulnerabilityInsight: "O Sporting sofre muito em bolas paradas, e o Benfica tem bons cabeceadores. Por outro lado, o Benfica expõe-se quando sobe as linhas, ideal para a velocidade do ataque leonino.",
    detailedMetrics: {
        home: {
             vulnerabilityText: "Susceptível a contra-ataques rápidos nas laterais.",
             counterAttackVulnerability: 65,
             vulnerabilityMetrics: {
                timeWindow: "75-90 min",
                timeWindowRisk: "Medium",
                periodXG: "0.4 xGA",
                periodXGDesc: "Avg",
                lossRate: "20%",
                lossRateDesc: "vs Counter",
                suggestedBet: "Live: Over 0.5 Home"
             },
             specializationData: [],
             specializationNote: ""
        },
        away: {
             vulnerabilityText: "Fraco em bolas paradas defensivas (cantos).",
             counterAttackVulnerability: 80, // Using for set piece risk here contextually
             vulnerabilityMetrics: {
                timeWindow: "45-60 min",
                timeWindowRisk: "High",
                periodXG: "0.6 xGA",
                periodXGDesc: "High",
                lossRate: "35%",
                lossRateDesc: "Set Piece",
                suggestedBet: "Score Anytime: Otamendi"
             },
             specializationData: [],
             specializationNote: ""
        }
    },
    specializationComparison: {
        home: [
            { category: 'Attack', openPlay: 70, setPiece: 20, counter: 10 },
            { category: 'Defense', openPlay: 60, setPiece: 30, counter: 10 }
        ],
        away: [
            { category: 'Attack', openPlay: 75, setPiece: 10, counter: 15 },
            { category: 'Defense', openPlay: 50, setPiece: 45, counter: 5 }
        ]
    },
    timingChart: [],
    timingInsight: "",
    squadContext: {
        homeAbsences: [
            { player: 'Bah', position: 'DF', team: 'home', reason: 'Lesão', importance: 'Alto', tacticalImpact: 'Menos profundidade na direita' }
        ],
        awayAbsences: [
            { player: 'Pote', position: 'MF', team: 'away', reason: 'Suspensão', importance: 'Crítico', tacticalImpact: 'Perda de criatividade central' }
        ],
        netXGImpactHome: -0.1,
        netXGImpactAway: -0.45,
        insight: "A ausência de Pote é mais impactante para o fluxo ofensivo do Sporting do que Bah para o Benfica."
    },
    discipline: {
        referee: 'Artur Soares Dias',
        style: 'Rigoroso',
        stats: {
            avgFouls: 28,
            avgYellows: 5.5,
            avgReds: 0.3,
            penaltiesAwarded: 35
        },
        conflictIndex: 8,
        insight: "Árbitro que não hesita em mostrar cartões em jogos grandes. Over Cartões tem valor."
    },
    weather: {
        condition: 'Chuva Fraca',
        temperature: '14°C',
        humidity: '82%',
        wind: '15 km/h',
        precipitation: '60%',
        impact: 'Relvado rápido, favorece remates de longe e erros defensivos.',
        iconType: 'rain'
    },
    validationMetrics: []
};

// --- PLAYER DETAIL MOCK ---

export const PLAYER_DETAIL_MOCK: PlayerDetail = {
    id: 'gyokeres',
    name: 'Viktor Gyökeres',
    position: 'Avançado (Centro)',
    team: 'Sporting CP',
    photo: 'https://bancada.pt/uploads/imagens/1689255655653_Gyokeres.jpg', // Placeholder
    teamLogo: 'https://upload.wikimedia.org/wikipedia/en/3/3e/Sporting_Clube_de_Portugal_logo.svg',
    impactScore: 9.2,
    impactLabel: 'CRITICAL',
    aiAnalysis: "Gyökeres é o motor ofensivo da equipa. A sua capacidade de atacar a profundidade e ganhar duelos físicos é insubstituível. A sua ausência ou substituição reduz o xG da equipa em 40%.",
    stats: {
        goalsPer90: 0.85,
        minutesPlayedPercent: 95,
        teamGoalContribution: 35,
        cardRisk: 'Medium',
        matchesPlayed: 11,
        minutesPlayed: 980,
        totalGoals: 10
    },
    predictive: {
        xgLoss: -0.55,
        winRateWith: 75,
        winRateWithout: 45,
        tacticalVulnerability: "Sem ele, a equipa perde referência para bola longa e torna-se previsível.",
        marketImpact: "Over 2.5 Goals",
        substituteComparison: {
            subName: "Paulinho",
            metrics: [
                { label: 'Finishing', player: 90, sub: 75 },
                { label: 'Physicality', player: 95, sub: 60 },
                { label: 'Pace', player: 88, sub: 50 },
                { label: 'Link-up', player: 75, sub: 80 },
                { label: 'Aerial', player: 80, sub: 70 },
            ]
        },
        substitutes: [
            {
                id: 'paulinho',
                name: 'Paulinho',
                metrics: [
                    { label: 'Finishing', player: 90, sub: 75 },
                    { label: 'Physicality', player: 95, sub: 60 },
                    { label: 'Pace', player: 88, sub: 50 },
                    { label: 'Link-up', player: 75, sub: 80 },
                    { label: 'Aerial', player: 80, sub: 70 },
                ],
                tacticalAnalysis: "Paulinho oferece mais jogo de apoio e tabelas curtas, mas não consegue esticar a defesa adversária como Gyökeres.",
                impactAnalysis: "Menos golos esperados em transição. Mais posse de bola no terço final, mas menos penetração."
            },
            {
                id: 'edwards',
                name: 'M. Edwards (Falso 9)',
                metrics: [
                    { label: 'Finishing', player: 90, sub: 70 },
                    { label: 'Physicality', player: 95, sub: 30 },
                    { label: 'Pace', player: 88, sub: 85 },
                    { label: 'Link-up', player: 75, sub: 90 },
                    { label: 'Dribbling', player: 80, sub: 95 },
                ],
                tacticalAnalysis: "Mudar para Falso 9 com Edwards altera totalmente a dinâmica. A equipa deixa de cruzar e passa a tentar entrar com bola controlada pelo meio.",
                impactAnalysis: "Drástica redução de golos de cabeça. Aumento de dribles e faltas sofridas à entrada da área."
            }
        ]
    }
};

// --- BANKROLL DATA ---

export const MOCK_BANKROLL_BETS: BankrollBet[] = [
    { id: '1', date: '2023-11-10', event: 'Arsenal vs Burnley', market: 'Handicap', selection: 'Arsenal -1.5', odd: 1.85, stake: 50, result: 'WIN', profit: 42.5, bankrollAfter: 2542.50, playerContext: 'Pote (Absent)' },
    { id: '2', date: '2023-11-11', event: 'Real Madrid vs Valencia', market: 'Over/Under', selection: 'Over 2.5', odd: 1.65, stake: 60, result: 'WIN', profit: 39.0, bankrollAfter: 2581.50 },
    { id: '3', date: '2023-11-11', event: 'Man Utd vs Luton', market: '1X2', selection: 'Man Utd', odd: 1.35, stake: 100, result: 'WIN', profit: 35.0, bankrollAfter: 2616.50 },
    { id: '4', date: '2023-11-12', event: 'Chelsea vs Man City', market: 'BTTS', selection: 'Sim', odd: 1.70, stake: 50, result: 'WIN', profit: 35.0, bankrollAfter: 2651.50 },
    { id: '5', date: '2023-11-12', event: 'Lazio vs Roma', market: 'Dupla Hipótese', selection: 'Empate ou Roma', odd: 1.55, stake: 40, result: 'LOSS', profit: -40.0, bankrollAfter: 2611.50 },
    { id: '6', date: '2023-11-13', event: 'Benfica vs Sporting', market: 'Over/Under', selection: 'Under 3.5', odd: 1.40, stake: 80, result: 'PUSH', profit: 0, bankrollAfter: 2611.50 },
    { id: '7', date: '2023-11-14', event: 'Brazil vs Argentina', market: '1X2', selection: 'Brazil', odd: 2.10, stake: 30, result: 'LOSS', profit: -30.0, bankrollAfter: 2581.50, playerContext: 'Neymar (Absent)' },
    { id: '8', date: '2023-11-15', event: 'France vs Germany', market: 'BTTS', selection: 'Sim', odd: 1.80, stake: 50, result: 'WIN', profit: 40.0, bankrollAfter: 2621.50 },
];

export const MOCK_BANKROLL_STATS: BankrollStats = {
    initialBank: 2000,
    currentBank: 2621.50,
    totalProfit: 621.50,
    profitPercentage: 31.07,
    totalBets: 145,
    wins: 82,
    losses: 55,
    winRate: 56.5,
    avgOdd: 1.92,
    avgStake: 45.0,
    maxDrawdownValue: 250.00,
    maxDrawdownPercent: 12.5,
    yield: 8.4,
    expectancy: 4.28,
    
    sharpeRatio: 1.85,
    kellyEfficiency: 82,
    profitFactor: 1.25,
    hitRate: 56.5,

    evolutionData: [
        { date: 'Set', value: 2000 },
        { date: 'Out W1', value: 2150 },
        { date: 'Out W2', value: 2100 },
        { date: 'Out W3', value: 2280 },
        { date: 'Out W4', value: 2350 },
        { date: 'Nov W1', value: 2450 },
        { date: 'Nov W2', value: 2621.5 },
    ],
    marketProfitData: [
        { market: '1X2', profit: 120 },
        { market: 'Over/Under', profit: 250 },
        { market: 'BTTS', profit: 180 },
        { market: 'Handicap', profit: -45 },
        { market: 'Dupla Hip', profit: 116 },
    ]
};
