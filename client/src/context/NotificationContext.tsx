import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";
import { api } from "../services/api";

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  link?: string;
  type?: "message" | "order" | "info";
}

interface NotificationContextType {
  unreadMessages: number;
  pendingOrders: number;
  totalNotifications: number;
  toasts: ToastItem[];
  dismissToast: (id: string) => void;
  refreshCounts: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [unreadMessages, setUnreadMessages] = useState<number>(0);
  const [pendingOrders, setPendingOrders] = useState<number>(0);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const prevTotalRef = useRef<number>(0);
  const isFirstCheckRef = useRef<boolean>(true);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToast = (title: string, message: string, link?: string, type: ToastItem["type"] = "message") => {
    const id = `${Date.now()}-${Math.random()}`;
    const newToast: ToastItem = { id, title, message, link, type };
    setToasts((prev) => [newToast, ...prev].slice(0, 4));

    // Auto dismiss after 6 seconds
    setTimeout(() => {
      dismissToast(id);
    }, 6000);
  };

  const refreshCounts = async () => {
    if (!isAuthenticated) {
      setUnreadMessages(0);
      setPendingOrders(0);
      return;
    }

    try {
      const res = await api.get<{
        success: boolean;
        data: {
          unreadMessages: number;
          pendingOrders: number;
          totalNotifications: number;
        };
      }>("/messages/unread-count");

      const data = res.data.data;
      if (!data) return;

      const newUnread = data.unreadMessages || 0;
      const newOrders = data.pendingOrders || 0;
      const newTotal = data.totalNotifications || 0;

      // If count increased and not first check, show toast notification
      if (!isFirstCheckRef.current && newTotal > prevTotalRef.current) {
        if (newUnread > unreadMessages) {
          addToast(
            "New Message Received",
            "A student sent you a message about a campus listing.",
            "/messages",
            "message"
          );
        } else if (newOrders > pendingOrders) {
          addToast(
            "New Order Received!",
            "A student just placed an order to buy one of your items.",
            "/profile",
            "order"
          );
        }
      }

      isFirstCheckRef.current = false;
      prevTotalRef.current = newTotal;
      setUnreadMessages(newUnread);
      setPendingOrders(newOrders);
    } catch {
      // Ignore background poll errors silently
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setUnreadMessages(0);
      setPendingOrders(0);
      isFirstCheckRef.current = true;
      prevTotalRef.current = 0;
      return;
    }

    refreshCounts();
    const interval = setInterval(refreshCounts, 7000); // Poll every 7 seconds
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  return (
    <NotificationContext.Provider
      value={{
        unreadMessages,
        pendingOrders,
        totalNotifications: unreadMessages + pendingOrders,
        toasts,
        dismissToast,
        refreshCounts,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};

