import Navigation from "@/components/Navigation";
import { MyItems } from "@/components/dashboard/MyItems";
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

const Dashboard = () => {
  // Mock data for stats
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
  
  // Mock data for game history
  const gameHistory = [
    {
      id: "game1",
      game: "Ludo",
      date: "2023-04-14",
      time: "15:30",
      result: "win",
      amount: 50,
      opponents: ["GamerPro", "Winner99", "BoardMaster"],
    },
    {
      id: "game2",
      game: "Checkers",
      date: "2023-04-14",
      time: "14:45",
      result: "loss",
      amount: -20,
      opponents: ["GamerPro"],
    },
    {
      id: "game3",
      game: "Tic-Tac-Toe",
      date: "2023-04-13",
      time: "19:20",
      result: "win",
      amount: 30,
      opponents: ["LudoKing"],
    },
    {
      id: "game4",
      game: "CheckGame",
      date: "2023-04-13",
      time: "16:10",
      result: "win",
      amount: 45,
      opponents: ["CardMaster", "TopPlayer", "GamerGirl"],
    },
    {
      id: "game5",
      game: "Ludo",
      date: "2023-04-12",
      time: "20:05",
      result: "loss",
      amount: -25,
      opponents: ["Winner99", "BoardMaster", "LudoKing"],
    },
  ];
  
  // Mock data for charts
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
  
  // Mock leaderboard data
  const leaderboard = [
    { rank: 1, name: "GamerPro", winRate: "78%", earnings: "$4,850" },
    { rank: 2, name: "LudoKing", winRate: "72%", earnings: "$3,642" },
    { rank: 3, name: "Winner99", winRate: "70%", earnings: "$3,120" },
    { rank: 4, name: "CardMaster", winRate: "68%", earnings: "$2,980" },
    { rank: 5, name: "Player123", winRate: "63%", earnings: "$1,245" },
    { rank: 6, name: "BoardMaster", winRate: "61%", earnings: "$1,105" },
    { rank: 7, name: "TopPlayer", winRate: "59%", earnings: "$980" },
    { rank: 8, name: "GamerGirl", winRate: "57%", earnings: "$875" },
    { rank: 9, name: "ChessKing", winRate: "55%", earnings: "$750" },
    { rank: 10, name: "LuckyStar", winRate: "53%", earnings: "$645" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8">
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
            <TabsTrigger value="items">Mes Items</TabsTrigger>
          </TabsList>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Recent Games</CardTitle>
              </CardHeader>
              <CardContent>
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
                    {leaderboard.map((player) => (
                      <TableRow key={player.rank} className={player.name === "Player123" ? "bg-primary/5" : ""}>
                        <TableCell className="font-medium">
                          {player.rank <= 3 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent text-accent-foreground text-xs font-bold">
                              {player.rank}
                            </span>
                          ) : (
                            player.rank
                          )}
                        </TableCell>
                        <TableCell className={player.name === "Player123" ? "font-bold" : ""}>
                          {player.name}
                          {player.name === "Player123" && " (You)"}
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
          
          <TabsContent value="items">
            <MyItems />
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="bg-card border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} GameVerse Casino. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
