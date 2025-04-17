
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type Message } from "./types";

interface ChatMessageProps {
  message: Message;
  isCurrentUser: boolean;
}

const ChatMessage = ({ message, isCurrentUser }: ChatMessageProps) => {
  return (
    <div className="flex">
      <div
        className={`chat-message ${
          isCurrentUser
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
  );
};

export default ChatMessage;
