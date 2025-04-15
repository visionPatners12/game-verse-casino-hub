
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  text: string;
  timestamp: string;
  isSpecial?: boolean;
}

const GameChat = () => {
  const [newMessage, setNewMessage] = useState("");
  
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
  
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      // Would normally send to a chat service
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
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
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="flex">
                <div
                  className={`chat-message ${
                    message.user.id === currentUser.id
                      ? "chat-message-self"
                      : "chat-message-other"
                  } ${message.isSpecial ? "border-2 border-accent" : ""}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={message.user.avatar} />
                      <AvatarFallback className="text-xs">
                        {message.user.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium">{message.user.name}</span>
                  </div>
                  <p>{message.text}</p>
                  <div className="text-xs opacity-70 text-right mt-1">
                    {message.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="pt-3">
        <form onSubmit={sendMessage} className="w-full flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default GameChat;
