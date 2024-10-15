import { useRef, useEffect } from "react";
import { Form, Input, Tooltip, Button } from "antd";
import { SendOutlined } from "@ant-design/icons";

import { useMutation } from "@apollo/client";
import { SEND_MESSAGE } from "../../Apollo/queries";

function MessageForm() {
  const [sendMessage, { data, loading, error }] = useMutation(SEND_MESSAGE);
  const [form] = Form.useForm();

  const messageInputRef = useRef(null);

  const submitionHandle = (values) => {
    sendMessage({ variables: { message: values.message } });
    form.resetFields();
  };

  useEffect(() => {
    messageInputRef.current.focus();
  });

  return (
    <Form form={form} name="sendMessage" layout="inline" onFinish={submitionHandle}>
      <Form.Item name="message" style={{ width: "90%", margin: 0 }}>
        <Input ref={messageInputRef} size="large" placeholder="Type a message" autoComplete="off" />
      </Form.Item>
      <Form.Item style={{ margin: 0, paddingLeft: 3 }}>
        <Tooltip title="send" placement="bottom">
          <Button
            type="primary"
            shape="default"
            icon={<SendOutlined />}
            size="large"
            htmlType="submit"
          />
        </Tooltip>
      </Form.Item>
    </Form>
  );
}

export default MessageForm;
