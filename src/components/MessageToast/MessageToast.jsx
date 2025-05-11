// components/MessageToast.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeMessage } from "../../store/features/messages/messageSlice";
import styles from "./MessageToast.module.scss"; // Исправлен импорт стилей

let dispatchRef;

const MessageToast = () => {
  const dispatch = useDispatch();
  dispatchRef = dispatch;

  const messages = useSelector((state) => state.messages.messages);

  useEffect(() => {
    messages.forEach((msg) => {
      if (msg.duration !== 0) {
        const timer = setTimeout(() => {
          dispatch(removeMessage(msg.id));
          if (msg.onClose) msg.onClose();
        }, msg.duration || 3000);
        return () => clearTimeout(timer);
      }
    });
  }, [messages, dispatch]);

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "info":
        return "ℹ️";
      case "warning":
        return "⚠️";
      case "loading":
        return "🔄";
      default:
        return null;
    }
  };

  return (
    <div className={styles["message-container"]}>
      {messages.map((msg) => (
        <div key={msg.id} className={`${styles["message-toast"]} ${styles[`message-${msg.type}`]}`}>
          <span>{getIcon(msg.type)}</span>
          <span>{msg.content}</span>
        </div>
      ))}
    </div>
  );
};

export default MessageToast;
