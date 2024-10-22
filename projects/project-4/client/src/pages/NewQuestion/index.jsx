import { Flex, Button, Form, Input, Result } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

import { useMutation } from "@apollo/client";
import { CREATE_QUESTION } from "../../Apollo/queries";

import { Navigate } from "react-router-dom";

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 4,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 20,
    },
  },
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 20,
      offset: 4,
    },
  },
};

export default function Home() {
  const [createQuestion, { loading, error, data }] = useMutation(CREATE_QUESTION);

  const onFinish = (values) => {
    createQuestion({
      variables: {
        data: {
          title: values.title,
          options: values.options,
        },
      },
    });
  };

  if (data && data.createQuestion.id)
    return <Navigate to={`/questions/${data.createQuestion.id}`} replace={true} />;

  return (
    <Flex vertical gap={"small"} align="center">
      <h2>Create a new question</h2>
      <Form
        name="question"
        {...formItemLayoutWithOutLabel}
        onFinish={onFinish}
        style={{
          minWidth: 400,
          maxWidth: 600,
        }}
        disabled={loading}
      >
        <Form.Item
          {...formItemLayout}
          name="title"
          label="Title"
          rules={[
            {
              required: true,
              whitespace: true,
              message: "Please enter the question title!",
            },
          ]}
        >
          <Input
            style={{
              width: "90%",
            }}
            autoComplete="off"
          />
        </Form.Item>
        <Form.List
          name="options"
          rules={[
            {
              validator: async (_, options) => {
                if (!options || options.length < 2) {
                  return Promise.reject(new Error("At least 2 options"));
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => {
                // eslint-disable-next-line no-unused-vars
                const { key, ...restOfField } = field;

                return (
                  <Form.Item
                    {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                    label={index === 0 ? "Options" : ""}
                    required={false}
                    key={field.key}
                  >
                    <Form.Item
                      {...restOfField}
                      validateTrigger={["onChange", "onBlur"]}
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: "Please input option or delete this field.",
                        },
                      ]}
                      noStyle
                    >
                      <Input
                        placeholder="option"
                        style={{
                          width: "90%",
                        }}
                        autoComplete="off"
                      />
                    </Form.Item>
                    {fields.length > 1 ? (
                      <MinusCircleOutlined
                        className="dynamic-delete-button"
                        onClick={() => remove(field.name)}
                      />
                    ) : null}
                  </Form.Item>
                );
              })}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  style={{
                    width: "60%",
                  }}
                  icon={<PlusOutlined />}
                >
                  Add Option
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item {...formItemLayout} style={{ textAlign: "center" }}>
          <Button loading={loading} type="primary" htmlType="submit">
            Create Question
          </Button>
        </Form.Item>
      </Form>
      {error && <Result status="warning" title="Warning!" extra={<p>{error.message}</p>} />}
    </Flex>
  );
}
