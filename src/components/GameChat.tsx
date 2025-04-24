
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import ChatMessageList from "./chat/ChatMessageList";
import ChatInputForm from "./chat/ChatInputForm";
import { Message } from "./chat/types";

const GameChat = () => {
  // Mock data - would come from a chat service in a real app
  const messages: Message[] = [
    {
      id: "msg1",
      user: { id: "user1", name: "Player123", avatar: "" },
      text: "Good luck everyone!",
      timestamp: "2 mins ago",
    },
    {
      id: "msg2",
      user: { id: "user2", name: "GamerPro", avatar: "" },
      text: "Thanks! You too!",
      timestamp: "1 min ago",
    },
    {
      id: "msg3",
      user: { id: "user1", name: "Player123", avatar: "" },
      text: "I'm going to win this round!",
      timestamp: "30 secs ago",
      isSpecial: true,
    },
  ];
  
  // Mock current user - would come from auth context
  const currentUser = { id: "user1", name: "Player123" };
  
  const sendMessage = (message: string) => {
    // Would normally send to a chat service
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
