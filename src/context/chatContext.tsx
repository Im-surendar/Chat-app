import { createContext, useContext, useMemo, useState } from "react";

export type Channel = {
  id: string;
  label: string;
};

type ChatContextType = {
    selectedUser: string | null;
    setSelectedUser: (user: string) => void;
    selectedChannel: Channel | null;
    setSelectedChannel: (channel: Channel) => void;
    loadingState : boolean | null
    setLoadingState : (state : boolean) => void
};

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedUser, setSelectedUser] = useState<string | null>("Joyse");
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>({id:"1",label:"General Channel"});
    const [loadingState,setLoadingState] = useState<boolean | null>(false)


    const contextValue = useMemo(
    () => ({
      selectedUser,
      setSelectedUser,
      selectedChannel,
      setSelectedChannel,
      loadingState,
      setLoadingState,
    }),
    [selectedUser, selectedChannel, loadingState]
  );

    return (
        <ChatContext.Provider value={contextValue}>
            {children}
        </ChatContext.Provider>
    );
}

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (!context) throw new Error("useChatContext must be used within ChatProvider");
    return context;
};


