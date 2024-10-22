import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";
import Notification from "./notifComponent";

//basically chatgpt'd "react global notification"

type messageType = 'success' | 'error' | 'info' | 'undo'

const throwNotification = (type: messageType, message: string, duration?: number) => {
  const container = document.createElement("div");
  document.body.appendChild(container);

  const root = createRoot(container);

  const NotificationWrapper = () => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, duration ? duration : 1500);

      const removeTimeout = setTimeout(() => {
        root.unmount();
        document.body.removeChild(container);
      }, duration ? duration + 500 : 1800); 

      return () => {
        clearTimeout(timeout);
        clearTimeout(removeTimeout);
      };
    }, []);

    return <Notification type={type} message={message} isVisible={isVisible} />;
  };

  root.render(<NotificationWrapper />);
};

export default throwNotification;
