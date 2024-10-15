import Messages from "./Messages.jsx";
import MessageForm from "./MessageForm.jsx";
import { Flex } from "antd";

function index() {
  return (
    <Flex vertical={true}>
      <Messages />
      <MessageForm />
    </Flex>
  );
}

export default index;
