import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Games from "./pages/Games";
import GameRoom from "./pages/GameRoom";
import Dashboard from "./pages/Dashboard";
import Wallet from "./pages/Wallet";
import Store from "./pages/Store";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import MyItems from "./pages/MyItems";
import CreateRoom from "./pages/CreateRoom";
import PublicRooms from "./pages/PublicRooms";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/games" element={<Games />} />
          <Route path="/games/checkers/room/:roomId" element={<GameRoom />} />
          <Route path="/games/ludo/room/:roomId" element={<GameRoom />} />
          <Route path="/games/checkgame/room/:roomId" element={<GameRoom />} />
          <Route path="/games/:gameType/create" element={<CreateRoom />} />
          <Route path="/games/:gameType/public" element={<PublicRooms />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/store" element={<Store />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-items" element={<MyItems />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
