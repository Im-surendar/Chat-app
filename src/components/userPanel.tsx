import { Channels, Users } from "../constants/configData"
import { useChatContext } from "../context/chatContext"


export default function UserPanel() {
    const { selectedUser, setSelectedUser, selectedChannel, setSelectedChannel } = useChatContext()

    return (
        <div className="w-1/4 sm:w-1/4 md:w-1/3 lg:w-1/3 xl:w-1/3">
            <div className="users-container">
                <div className="mb-2 px-1">
                    <label>1. Choose your user</label>
                    <select
                        className="inputCss"
                        value={selectedUser ?? ""}
                        onChange={(e) => setSelectedUser(e.target.value)}
                    >
                        {Users?.map((ele) => (
                            <option
                                className="optionCss"
                                key={ele}
                            >{ele}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-1">
                    <label className="px-1">2. Choose your Channel</label>
                    <ul>
                        {Channels?.map(ele => (
                            <li
                                key={ele?.id}
                                className={`channel ${selectedChannel?.id === ele?.id ? "active-channel" : ""}`}
                                onClick={() => setSelectedChannel(ele)}
                            >{ele?.label}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}