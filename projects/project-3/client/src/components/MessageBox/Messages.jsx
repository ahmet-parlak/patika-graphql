import { useRef, useEffect } from "react";

import { Card } from "antd";

import { useSubscription } from "@apollo/client";

import { SUBSCRIBE_MESSAGES } from "../../Apollo/queries";

const messages = [];

function Messages() {
  const { data } = useSubscription(SUBSCRIBE_MESSAGES);

  const messagesContainerRef = useRef();

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [data]);

  if (data) messages.push(data.messageCreated);

  return (
    <div ref={messagesContainerRef} className="messagesContainer">
      {messages.map((message, index) => (
        <Card key={index} bordered={true} style={{ width: 400, marginBottom: 10 }}>
          <p className="message-content">{message.message}</p>
          <p className="message-date">{new Date(message.date).toLocaleString()}</p>
        </Card>
      ))}
    </div>
  );
}

export default Messages;
