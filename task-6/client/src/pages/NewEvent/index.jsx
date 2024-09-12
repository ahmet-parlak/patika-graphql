import styles from "./styles.module.css";
import { useEffect } from "react";
import {
  Flex,
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Divider,
  TimePicker,
  notification,
} from "antd";
import { useQuery, useMutation } from "@apollo/client";
import { GET_LOCATIONS, GET_USERS, CREATE_EVENT } from "./queries";

const errorMessageOptions = { placement: "top", duration: 0 };
const successMessageOptions = { placement: "top", duration: 4 };

function NewEvent() {
  const [createEvent, { loading, error, data }] = useMutation(CREATE_EVENT);

  const {
    data: locations,
    loading: locationsLoading,
    error: locationsError,
  } = useQuery(GET_LOCATIONS);

  const locationOptions = locations?.locations.map((location) => ({
    label: location.name,
    value: location.id,
  }));

  const { data: users, loading: usersLoading, error: usersError } = useQuery(GET_USERS);

  const userOptions = users?.users.map((user) => ({
    label: user.username,
    value: user.id,
  }));

  useEffect(() => {
    if (locationsError) {
      notification.error({ ...errorMessageOptions, message: locationsError.message });
    }
  }, [locationsError]);

  useEffect(() => {
    if (usersError) {
      notification.error({ ...errorMessageOptions, message: usersError.message });
    }
  }, [usersError]);

  useEffect(() => {
    if (error) {
      notification.error({ ...errorMessageOptions, message: error.message });
    }
  }, [error]);

  const [form] = Form.useForm();
  useEffect(() => {
    if (data) {
      notification.success({ ...successMessageOptions, message: data?.message || "Event created" });
      form.resetFields();
    }
  }, [data, form]);

  const submit = (values) => {
    // Date Operation
    const dateTime = new Date(values.date);
    const startTime = new Date(values.time[0]);
    const endTime = new Date(values.time[1]);

    const date = dateTime.toLocaleDateString();

    const from = startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const to = endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newEventData = {
      title: values.title,
      desc: values.desc,
      date,
      from,
      to,
      location_id: values.location,
      user_id: values.user,
    };

    createEvent({ variables: { data: newEventData } });
  };

  return (
    <>
      <Divider style={{ fontSize: "1.5rem", marginTop: "2rem" }}>Add New Event</Divider>

      <Form
        form={form}
        onFinish={submit}
        variant="outlined"
        size="large"
        layout="vertical"
        className={styles.form}
        disabled={loading}
      >
        <Form.Item
          label="Event Title"
          name="title"
          rules={[{ required: true, message: "Please enter the event title!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Event Description"
          name="desc"
          rules={[{ required: true, message: "Please enter the event description!" }]}
        >
          <Input.TextArea />
        </Form.Item>

        <Flex style={{ gap: "1rem", alignItems: "end" }}>
          <Form.Item
            label="Event Date"
            name="date"
            rules={[{ required: true, message: "Please enter the event date!" }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            /* label="Event Time" */
            name="time"
            rules={[{ required: true, message: "" }]}
          >
            <TimePicker.RangePicker format={"HH:mm"} style={{ marginLeft: "1rem" }} />
          </Form.Item>
        </Flex>

        <Form.Item
          label="Event Location"
          name="location"
          rules={[{ required: true, message: "Please select the event location!" }]}
        >
          <Select
            options={locationOptions}
            disabled={locationsLoading || loading}
            loading={locationsLoading}
          />
        </Form.Item>

        <Form.Item
          label="User"
          name="user"
          rules={[{ required: true, message: "Please select a user!" }]}
        >
          <Select options={userOptions} disabled={usersLoading || loading} loading={usersLoading} />
        </Form.Item>

        <Form.Item style={{ textAlign: "center" }}>
          <Button
            type="primary"
            htmlType="submit"
            disabled={locationsLoading || usersLoading}
            loading={locationsLoading || usersLoading || loading}
          >
            Create Event
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default NewEvent;
