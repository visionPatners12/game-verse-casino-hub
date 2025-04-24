
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import ChatMessageList from "./chat/ChatMessageList";
import ChatInputForm from "./chat/ChatInputForm";
import { Message } from "./chat/types";
import { useMatches } from "@/hooks/useMatches";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const GameChat = () => {
  const { matches } = useMatches();
  
  const formattedMatches = matches?.map(match => ({
    teams: `${match.participants[0].name} vs ${match.participants[1].name}`,
    time: format(new Date(match.starting_at), "HH:mm", { locale: fr }),
    league: match.stage.name
  })) || [];
  
  const matchesString = formattedMatches.length > 0 
    ? formattedMatches.map(m => `${m.time} - ${m.teams} (${m.league})`).join("\n")
    : "Aucun match disponible pour aujourd'hui";
  
  const messages: Message[] = [
    {
      id: "msg1",
      user: { id: "user1", name: "Player123", avatar: "" },
      text: "Good luck everyone!",
      timestamp: "2 mins ago",
    },
    {
      id: "msg2",
      user: { id: "system", name: "System", avatar: "" },
      text: `🎾 Tennis Live
    ┌───────┐
    │       │
    │   O   │
    │       │
    └───┬───┘   
        │     ${matchesString}
        │     
    ════╪════  
        │     
        │     `,
      timestamp: "1 min ago",
      isSpecial: true,
    },
  ];
  
  const currentUser = { id: "user1", name: "Player123" };
  
  const sendMessage = (message: string) => {
    console.log("Sending message:", message);
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Game Chat
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 px-3">
        <ChatMessageList messages={messages} currentUser={currentUser} />
      </CardContent>
      <CardFooter className="pt-3">
        <ChatInputForm onSendMessage={sendMessage} />
      </CardFooter>
    </Card>
  );
};

export default GameChat;
