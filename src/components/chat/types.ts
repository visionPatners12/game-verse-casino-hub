
export interface Message {
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

export interface ChatUser {
  id: string;
  name: string;
}
