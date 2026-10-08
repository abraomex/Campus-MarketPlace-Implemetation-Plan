import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import type { Conversation, Message } from "../types";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import {
  MessageSquare,
  Send,
  ExternalLink,
  MapPin,
  Clock,
} from "lucide-react";

export const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const { refreshCounts } = useNotifications();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeConversationId = searchParams.get("id");

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);
  const [sending, setSending] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef<boolean>(true);
  const isInitialLoadRef = useRef<boolean>(true);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior,
      });
    }
  };

  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    // Consider user at bottom if within 120px of bottom edge
    isNearBottomRef.current = scrollHeight - scrollTop - clientHeight < 120;
  };

  // 1. Fetch conversations list
  const fetchConversations = async () => {
    try {
      const res = await api.get<{ success: boolean; data: Conversation[] }>(
        "/messages/conversations"
      );
      const list = res.data.data || [];
      setConversations(list);

      // If no active ID is selected in URL, default to the first one
      if (!activeConversationId && list.length > 0) {
        setSearchParams({ id: list[0].id });
      }
    } catch (err) {
      console.error("Failed to load conversations:", err);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // 2. Fetch active conversation messages
  useEffect(() => {
    if (!activeConversationId) return;

    let isMounted = true;
    isInitialLoadRef.current = true;
    setLoadingChat(true);

    const fetchChat = async (isBackground = false) => {
      try {
        const res = await api.get<{
          success: boolean;
          data: { conversation: Conversation; messages: Message[] };
        }>(`/messages/conversations/${activeConversationId}`);

        if (!isMounted) return;

        const newConv = res.data.data.conversation;
        const newMsgs = res.data.data.messages || [];

        setActiveConversation(newConv);

        setMessages((prevMsgs) => {
          const lastPrev = prevMsgs[prevMsgs.length - 1];
          const lastNew = newMsgs[newMsgs.length - 1];

          // If counts and last message IDs match, do not replace array to prevent re-renders
          if (
            prevMsgs.length === newMsgs.length &&
            lastPrev?.id === lastNew?.id
          ) {
            return prevMsgs;
          }

          // Initial conversation switch
          if (isInitialLoadRef.current) {
            isInitialLoadRef.current = false;
            setTimeout(() => scrollToBottom("auto"), 50);
            return newMsgs;
          }

          // In background polling, only auto-scroll if user was already at the bottom
          if (isNearBottomRef.current) {
            setTimeout(() => scrollToBottom("smooth"), 50);
          }
          return newMsgs;
        });

        // Refresh unread counts since viewing marks them as read
        refreshCounts();
      } catch (err) {
        console.error("Failed to load chat messages:", err);
      } finally {
        if (isMounted && !isBackground) {
          setLoadingChat(false);
          setTimeout(() => scrollToBottom("auto"), 80);
        }
      }
    };

    // First fetch
    fetchChat(false);

    // Poll silently every 5 seconds (isBackground = true) without loading skeleton or forced scroll
    const interval = setInterval(() => {
      fetchChat(true);
    }, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [activeConversationId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversationId || sending) return;

    const content = newMessage.trim();
    setNewMessage("");
    setSending(true);

    try {
      const res = await api.post<{ success: boolean; data: Message }>(
        `/messages/conversations/${activeConversationId}`,
        { content }
      );
      setMessages((prev) => [...prev, res.data.data]);
      setTimeout(() => scrollToBottom("smooth"), 50);
      fetchConversations(); // Update snippet in list
      refreshCounts();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const getOtherParticipant = (conv: Conversation) => {
    if (!user) return conv.seller;
    return conv.buyerId === user.id ? conv.seller : conv.buyer;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-[#0c101a] rounded-3xl border border-white/[0.08] shadow-2xl overflow-hidden h-[82vh] flex flex-col md:flex-row">
        {/* Left Side: Conversations List */}
        <div className="w-full md:w-80 lg:w-96 border-r border-white/[0.08] flex flex-col h-full bg-black/40">
          <div className="p-4 border-b border-white/[0.08] bg-transparent">
            <h2 className="text-xl font-black text-white flex items-center gap-2 tracking-wider">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
              CAMPUS MESSAGES
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Chat with student buyers and sellers
            </p>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-white/[0.04]">
            {loadingList ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <MessageSquare className="w-10 h-10 mx-auto text-slate-600" />
                <p className="text-sm font-semibold text-slate-300">No messages yet</p>
                <p className="text-xs text-slate-500">
                  Find an item on the marketplace and click "Contact Seller" to start chatting!
                </p>
                <Link
                  to="/products"
                  className="inline-block mt-3 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl text-xs font-bold transition-colors"
                >
                  Browse Items
                </Link>
              </div>
            ) : (
              conversations.map((conv) => {
                const other = getOtherParticipant(conv);
                const isActive = conv.id === activeConversationId;
                const lastMsg = conv.messages && conv.messages[0];

                return (
                  <button
                    key={conv.id}
                    onClick={() => setSearchParams({ id: conv.id })}
                    className={`w-full p-4 text-left flex items-start gap-3 transition ${
                      isActive
                        ? "bg-emerald-500/10 border-l-4 border-emerald-400 text-white"
                        : "hover:bg-white/[0.04] text-slate-300"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/5 overflow-hidden shrink-0 border border-white/10 relative">
                      {conv.product?.images && conv.product.images[0] ? (
                        <img
                          src={conv.product.images[0].url}
                          alt={conv.product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-600">
                          Item
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-bold text-white text-sm truncate">
                          {other?.name || "Student"}
                        </span>
                        <span className="text-[10px] text-slate-500 shrink-0">
                          {new Date(conv.updatedAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <p className="text-xs font-medium text-slate-400 truncate mb-1">
                        {conv.product?.title} <span className="text-emerald-400">${Number(conv.product?.price || 0).toFixed(2)}</span>
                      </p>

                      <p className="text-[11px] text-slate-500 truncate">
                        {lastMsg ? lastMsg.content : "Chat started"}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Chat Box */}
        <div className="flex-1 flex flex-col h-full bg-[#0b0f19]">
          {activeConversation ? (
            <>
              {/* Active Header with Product Info */}
              <div className="p-4 border-b border-white/[0.08] bg-black/30 flex items-center justify-between gap-4 text-white">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-white/5 overflow-hidden shrink-0 border border-white/10">
                    <img
                      src={
                        activeConversation.product?.images &&
                        activeConversation.product.images[0]
                          ? activeConversation.product.images[0].url
                          : "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=400&q=80"
                      }
                      alt={activeConversation.product?.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-sm truncate">
                        {activeConversation.product?.title}
                      </h3>
                      <span className="text-xs font-extrabold text-red-500">
                        ${Number(activeConversation.product?.price || 0).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                      <span>Chat with {getOtherParticipant(activeConversation)?.name}</span>
                      {activeConversation.product?.location && (
                        <span className="flex items-center gap-1 text-slate-500">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          {activeConversation.product.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <Link
                  to={`/products/${activeConversation.productId}`}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-lg border border-white/10 flex items-center gap-1 transition shrink-0"
                >
                  <span>View Item</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Messages Thread */}
              <div
                ref={chatContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-transparent"
              >
                {loadingChat ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-12 w-48 bg-white/5 rounded-2xl animate-pulse ${
                          i % 2 === 0 ? "ml-auto" : "mr-auto"
                        }`}
                      />
                    ))}
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 space-y-2">
                    <p className="text-sm font-semibold text-slate-400">Say hello!</p>
                    <p className="text-xs max-w-xs mx-auto">
                      Coordinate your campus meeting point (e.g., student center, library) and time.
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = user && msg.senderId === user.id;

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${
                          isMe ? "items-end" : "items-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] sm:max-w-md px-4 py-3 text-sm leading-relaxed ${
                            isMe
                              ? "bg-emerald-500 text-black font-medium rounded-2xl rounded-br-xs shadow-md"
                              : "bg-white/[0.08] border border-white/10 text-white rounded-2xl rounded-bl-xs shadow-xs"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1 px-1 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Message Input Form */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 sm:p-4 border-t border-white/[0.08] bg-black/40 flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Type a message to agree on meetup place and time..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-white/[0.06] text-sm text-white placeholder:text-slate-500 rounded-xl focus:bg-white/[0.1] focus:outline-none focus:border-emerald-500/50 border border-white/10 transition"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="p-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl shadow-md shadow-emerald-500/20 transition disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 text-center space-y-3">
              <MessageSquare className="w-12 h-12 text-slate-600" />
              <h3 className="font-bold text-slate-300 text-lg">Select a conversation</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Choose a chat from the left or browse listings to message a student seller.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
