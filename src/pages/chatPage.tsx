
import ChatPanel from "../components/chatPanel"
import UserPanel from "../components/userPanel"
import { useChatContext } from "../context/chatContext"
import Loader from "../components/loader"
import Header from "../components/header"



export default function ChatPage() {
    const {loadingState} = useChatContext()
    return (
        <div className="relatives">
            {/* Display loader */}
            {loadingState && <Loader />}
            <div>
                {/* Page header */}
              <Header />
                <div className='bg-[#f4f5fb] flex flex-row'>
                    {/* Left side user panel */}
                    <UserPanel />
                    {/* Right side chat panel */}
                    <ChatPanel />
                </div>
            </div>
        </div>
    )
}