
import { ScrollArea } from "@/components/ui/scroll-area";
import { type Message, type ChatUser } from "./types";
import ChatMessage from "./ChatMessage";

interface ChatMessageListProps {
  messages: Message[];
  currentUser: ChatUser;
}

const ChatMessageList = ({ messages, currentUser }: ChatMessageListProps) => {
  return (
    <ScrollArea className="h-[300px] pr-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <ChatMessage 
            key={message.id} 
            message={message} 
            isCurrentUser={message.user.id === currentUser.id}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default ChatMessageList;
