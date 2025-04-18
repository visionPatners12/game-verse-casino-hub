import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Trophy,
  DollarSign,
  Users,
  GamepadIcon,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  // State to store current user ID
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  // Fetch current user ID on component mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setCurrentUserId(data.user.id);
      }
    };
    
    fetchCurrentUser();
  }, []);

  // Fetch game sessions for the current user
  const { data: gameSessions, isLoading: loadingGames } = useQuery({
    queryKey: ['user-game-sessions'],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) throw new Error('Not authenticated');

      const { data: sessions, error } = await supabase
        .from('game_sessions')
        .select(`
          id, 
          game_type, 
          start_time, 
          pot, 
          status, 
          game_players(user_id, display_name, current_score)
        `)
        .order('start_time', { ascending: false })
        .limit(10);

      if (error) throw error;
      return sessions || [];
    },
  });

  // Calculate and format game history from the sessions data
  const gameHistory = gameSessions?.map(session => {
    // Using the state variable for current user ID comparison
    const isUserPlayer = session.game_players?.some(player => 
      player.user_id === currentUserId
    );
    
    // Fixed comparison to use 'Finished' instead of 'Completed'
    const result = isUserPlayer ? 
      (session.status === 'Finished' ? 'win' : 'loss') : 'loss';
    
    const opponents = session.game_players
      ?.filter(player => player.user_id !== currentUserId)
      .map(player => player.display_name);

    return {
      id: session.id,
      game: session.game_type,
      date: new Date(session.start_time).toISOString().split('T')[0],
      time: new Date(session.start_time).toTimeString().substr(0, 5),
      result: result,
      amount: result === 'win' ? session.pot / session.game_players?.length : -20,
      opponents: opponents || [],
    };
  }) || [];

  // Mock data for stats and charts (would be replaced with real data in a full implementation)
  const stats = [
    {
      title: "Win Rate",
      value: "63%",
      change: 5,
      icon: <Trophy className="h-5 w-5 text-accent" />,
    },
    {
      title: "Total Winnings",
      value: "$1,245",
      change: 12,
      icon: <DollarSign className="h-5 w-5 text-green-500" />,
    },
    {
      title: "Games Played",
      value: "168",
      change: -3,
      icon: <GamepadIcon className="h-5 w-5 text-blue-500" />,
    },
    {
      title: "Referrals",
      value: "7",
      change: 0,
      icon: <Users className="h-5 w-5 text-purple-500" />,
    },
  ];
  
  // Mock data for charts (would be replaced with real backend data)
  const weeklyWinnings = [
    { name: "Mon", winnings: 75 },
    { name: "Tue", winnings: 40 },
    { name: "Wed", winnings: -30 },
    { name: "Thu", winnings: 120 },
    { name: "Fri", winnings: -45 },
    { name: "Sat", winnings: 90 },
    { name: "Sun", winnings: 65 },
  ];
  
  const gameDistribution = [
    { name: "Ludo", value: 42 },
    { name: "Checkers", value: 35 },
    { name: "Tic-Tac-Toe", value: 23 },
    { name: "CheckGame", value: 68 },
  ];
  
  const COLORS = ["#6A1AD9", "#4A148C", "#FFC107", "#F44336"];
  
  // Fetch leaderboard data
  const { data: leaderboardData } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          username,
          wallets(real_balance)
        `)
        .order('wallets.real_balance', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      // Format the data for the leaderboard
      return data.map((user, index) => ({
        rank: index + 1,
        name: user.username,
        winRate: Math.floor(40 + Math.random() * 40) + "%", // Mock win rate
        earnings: "$" + (user.wallets?.[0]?.real_balance || 0).toLocaleString(),
      }));
    },
    initialData: [], // Default empty array
  });

  // Get current user data for highlighting in leaderboard
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        // Fetch the current user's username
        const { data: userData, error } = await supabase
          .from('users')
          .select('username')
          .eq('id', data.user.id)
          .single();
          
        if (!error && userData) {
          setCurrentUsername(userData.username);
        }
      }
    };
    
    getCurrentUser();
  }, []);

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8">Player Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-full">
                    {stat.icon}
                  </div>
                </div>
                
                <div className="mt-4 flex items-center">
                  {stat.change > 0 ? (
                    <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : stat.change < 0 ? (
                    <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                  ) : (
                    <Minus className="h-4 w-4 text-muted-foreground mr-1" />
                  )}
                  
                  <span
                    className={`text-sm ${
                      stat.change > 0
                        ? "text-green-500"
                        : stat.change < 0
                        ? "text-red-500"
                        : "text-muted-foreground"
                    }`}
                  >
                    {Math.abs(stat.change)}% from last month
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      
      <div className="grid gap-8 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Winnings</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyWinnings}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="winnings"
                    fill="url(#colorGradient)"
                    radius={[4, 4, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6A1AD9" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#4A148C" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Games Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gameDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {gameDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      
      <Tabs defaultValue="history" className="mb-8">
          <TabsList>
            <TabsTrigger value="history">Game History</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Recent Games</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingGames ? (
                  <div className="text-center py-4">Loading game history...</div>
                ) : !gameHistory?.length ? (
                  <div className="text-center py-4 text-muted-foreground">No recent game history available</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Game</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Result</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="hidden md:table-cell">Opponents</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {gameHistory.map((game) => (
                        <TableRow key={game.id}>
                          <TableCell className="font-medium">{game.game}</TableCell>
                          <TableCell>
                            {game.date} at {game.time}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                game.result === "win"
                                  ? "bg-green-500/10 text-green-500"
                                  : "bg-red-500/10 text-red-500"
                              }`}
                            >
                              {game.result.toUpperCase()}
                            </span>
                          </TableCell>
                          <TableCell
                            className={
                              game.amount > 0 ? "text-green-500" : "text-red-500"
                            }
                          >
                            {game.amount > 0 ? "+" : ""}${Math.abs(game.amount)}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {game.opponents.join(", ")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="leaderboard">
            <Card>
              <CardHeader>
                <CardTitle>Global Leaderboard</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Player</TableHead>
                      <TableHead>Win Rate</TableHead>
                      <TableHead>Total Earnings</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaderboardData.map((player) => (
                      <TableRow key={player.rank} className={player.name === currentUsername ? "bg-primary/5" : ""}>
                        <TableCell className="font-medium">
                          {player.rank <= 3 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent text-accent-foreground text-xs font-bold">
                              {player.rank}
                            </span>
                          ) : (
                            player.rank
                          )}
                        </TableCell>
                        <TableCell className={player.name === currentUsername ? "font-bold" : ""}>
                          {player.name}
                          {player.name === currentUsername && " (You)"}
                        </TableCell>
                        <TableCell>{player.winRate}</TableCell>
                        <TableCell>{player.earnings}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    </Layout>
  );
};

export default Dashboard;
