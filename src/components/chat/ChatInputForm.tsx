
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatInputFormProps {
  onSendMessage: (message: string) => void;
}

const ChatInputForm = ({ onSendMessage }: ChatInputFormProps) => {
  const [newMessage, setNewMessage] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="w-full flex gap-2">
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
  );
};

export default ChatInputForm;
