import { useLazyQuery, useQuery } from "@apollo/client";
import { faArrowDown, faArrowUp, faCheckCircle, faExclamationCircle, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fetch_MORE_MESSAGES, GET_LATESTMSG } from "../graphql/quries";
import { useEffect, useMemo, useRef, useState } from "react";
import moment from "moment";
import { postMessage } from "../graphql/mutation";
import { useChatContext } from "../context/chatContext";
import { ProfileImgUrl } from "../constants/configData";
import type { Message } from "../types/message";




export default function ChatPanel() {
    const { selectedUser, selectedChannel, loadingState, setLoadingState } = useChatContext()
    const [enteredText, setEnteredText] = useState<string>('')
    const [sendError, setSendError] = useState<string>('')
    const [noMoreMessages, setNoMoreMessages] = useState<boolean>(false)
    const [noNewMessages, setNoNewMessages] = useState<boolean>(false)
    const [scrollDirection, setScrollDirection] = useState<string | null>(null)
    const chatConatinerRef = useRef<HTMLDivElement | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const { data: messageData, loading } = useQuery(GET_LATESTMSG, {
        variables: { channelId: selectedChannel?.id },
        skip: !selectedChannel?.id,
    })

    const [fetchMoreMessages] = useLazyQuery(Fetch_MORE_MESSAGES)

    useEffect(() => {
        setScrollDirection("down")
        setMessages(messageData?.fetchLatestMessages ?? [])
    }, [messageData])

    useEffect(() => setLoadingState(loading), [loading])

    useEffect(() => {
        setScrollDirection("down")
        if (selectedChannel?.id) {
            setEnteredText(localStorage.getItem(selectedChannel.id) ?? "");
        }
    }, [selectedChannel?.id])

    useEffect(() => {
        doScroll()
    }, [scrollDirection])

    const handleSend = async () => {
        if (!enteredText?.trim()) {
            setSendError("Message cannot be empty")
            setTimeout(() => {
                setSendError("")
            }, 2000);
            return
        }
        if (!selectedChannel?.id || !selectedUser) return
        const tempMessageId = Date.now().toString();
        const newMessage = {
            messageId: tempMessageId,
            userId: selectedUser,
            text: enteredText,
            datetime: new Date().toISOString(),
            status: "failed", // or "failed"
        };
        setLoadingState(true)
        try {
            const result = await postMessage(selectedChannel?.id, enteredText, selectedUser);
            console.log(result)
            setMessages(prev => [...prev, result]);
            setEnteredText("");
            setSendError("")

            // await refetchMessageData()
            setLoadingState(false)
        } catch (err: unknown) {
            if (err)
                console.log(err)
            setEnteredText("");
            setMessages(prev => [...prev, newMessage]);
            setLoadingState(false);
        } finally {
            setScrollDirection("down")
            localStorage.setItem(selectedChannel?.id, "")
        }
    };

    const sortedMessages = useMemo(() => {
        return [...messages].sort(
            (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
        )
    }, [messages]);

    const handleFetchOlderMessages = async () => {
        setLoadingState(true)
        const el = chatConatinerRef.current
        if (!el) return
        try {
            const res = await fetchMoreMessages({
                variables: {
                    channelId: selectedChannel?.id,
                    messageId: sortedMessages?.[0]?.messageId,
                    old: true
                },
            })
            const olderMessages = res.data?.fetchMoreMessages ?? [];
            setScrollDirection("up")
            if (olderMessages.length > 0) {
                setMessages((prev) => [...olderMessages, ...prev]);

            } else if (el.scrollTop === 0) {
                setNoMoreMessages(true);
                setTimeout(() => setNoMoreMessages(false), 2000);
            }
            setLoadingState(false)
        }
        catch {
            setLoadingState(false)
        }
    }

    const doScroll = () => {
        if (!chatConatinerRef.current || !scrollDirection) return;

        if (scrollDirection === 'down') {
            chatConatinerRef.current.scrollTo({
                top: chatConatinerRef.current.scrollHeight,
                behavior: 'smooth',
            });
        } else if (scrollDirection === 'up') {
            chatConatinerRef.current.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }

        setScrollDirection(null); // reset
    }


    const handleFetchLatestMessages = () => {
        const el = chatConatinerRef.current
        if (!el) return
        if (Math.abs(el.clientHeight + el.scrollTop - el.scrollHeight) < 1) {
            setNoNewMessages(true)
            setTimeout(() => {
                setNoNewMessages(false)
            }, 2000);
        }
        // scrollToBottom()
        setScrollDirection('down')

    }

    return (
        <div className="w-3/4 sm:w-3/4 md:w-2/3 lg:w-2/3 xl:w-2/3">
            {/* Display Channel name */}
            <div className="selected-channel">
                {selectedChannel?.label}
            </div>
            <div className="p-3">
                {/* Read more up arrow button */}
                <div className="flex flex-row">
                    <button
                        className="btn mb-2"
                        onClick={handleFetchOlderMessages}
                    >Read more <FontAwesomeIcon icon={faArrowUp} className="fs-[16px] mx-[2px]" /></button>
                    {noMoreMessages && (
                        <div className="older-text text-center text-sm text-red-500 mt-2 ml-2 transition-opacity duration-1000">
                            No more messages available.
                        </div>
                    )}
                </div>
                {/* Chat window */}
                <div
                    className="flex-1 overflow-y-auto h-50"
                    ref={chatConatinerRef}
                >
                    {!loadingState && !sortedMessages?.length ?
                        <div className="flex justify-center items-center h-full">
                            <div className="text-gray-500 text-center">
                                No messages yet in this channel.
                            </div>
                        </div>
                        : sortedMessages?.map((msg) => {
                            const isLoggedInUser = msg.userId === selectedUser;
                            if (msg.status === "failed" && !isLoggedInUser) return
                            return (
                                <div
                                    key={msg.messageId}
                                    className={`flex ${isLoggedInUser ? "flex-row-reverse" : "flex-row"} mb-8`}
                                >
                                    <div className={`${isLoggedInUser ? "ml-[20px]" : "mr-[20px]"}`}>
                                        <img alt="profile" className="imgCss" src={ProfileImgUrl[msg?.userId]} />
                                        <div className="user-name">{msg.userId}</div>
                                    </div>
                                    <div className={`${isLoggedInUser ? "my-text text-right" : " other-text text-left"}`}>{msg.text}</div>
                                    <div className="msg-time">{moment(msg.datetime).format("hh:mm ")}
                                        {isLoggedInUser && (msg?.status === "failed" ? <>
                                            <span><FontAwesomeIcon icon={faExclamationCircle} className="text-[#b71e3c] fs-[16px] mx-[2px]" /></span>
                                            <span className="msg-status">Error</span>
                                        </> : <>
                                            <span><FontAwesomeIcon icon={faCheckCircle} className="text-[#9ec94a] fs-[16px] mx-[2px]" /></span>
                                            <span className="msg-status">Sent</span>
                                        </>)}
                                    </div>
                                </div>
                            );
                        })}
                </div>
                {/* Read more down arrow button */}
                <div className="flex flex-row">
                    <button
                        className="btn mb-2"
                        onClick={handleFetchLatestMessages}
                    >Read more <FontAwesomeIcon icon={faArrowDown} className="fs-[16px] mx-[2px]" /></button>
                    {noNewMessages && (
                        <div className="latest-text text-center text-sm text-red-500 mt-2 ml-2 transition-opacity duration-1000">
                            No more messages available.
                        </div>
                    )}
                </div>
                {/* Text area */}
                <div>
                    <textarea
                        className="inputCss !h-auto mb-3"
                        rows={2}
                        value={enteredText}
                        onChange={(e) => {
                            if (selectedChannel?.id) {
                                localStorage.setItem(selectedChannel.id, e.target.value);
                            }
                            setEnteredText(e.target.value)
                        }}
                        placeholder="Type your message here..." />

                </div>
                {/* Send button */}
                <div className="flex flex-row">
                    <button
                        className="btn"
                        onClick={handleSend}
                    >Send Message <FontAwesomeIcon icon={faPaperPlane} className="fs-[16px] mx-[2px]" /></button>
                    {sendError && (
                        <div className="older-text text-center text-sm text-red-500 mt-2 ml-2 transition-opacity duration-1000">
                            {sendError}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}