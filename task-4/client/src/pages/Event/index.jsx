import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_EVENT } from "./queries.jsx";
import { Card, Descriptions } from "antd";
import Participants from "./participants.jsx";
import styles from "./styles.module.css";
import Loading from "components/Loading";
function Event() {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_EVENT, {
    variables: { id },
  });

  if (loading) return <Loading />;
  if (error) return <p>Error :{error.message}</p>;

  const event = data.event;
  const eventDetails = [
    {
      key: "1",
      label: "Date",
      children: event.date,
    },
    {
      key: "2",
      label: "From",
      children: event.from,
    },
    {
      key: "3",
      label: "To",
      children: event.to,
    },
    {
      key: "4",
      label: "Location",
      children: event.location.name,
    },
    {
      key: "5",
      label: "Latitude",
      children: event.location.lat,
    },
    {
      key: "6",
      label: "Longitude",
      children: event.location.lng,
    },
    {
      key: "7",
      label: "Description",
      children: <div className={styles.locationDescContainer}>{event.location.desc}</div>,
    },
  ];

  return (
    <Card title={<div className={styles.titleContainer}>{event.title}</div>}>
      <div className={styles.descContainer}>{event.desc}</div>
      <Descriptions bordered items={eventDetails} className={styles.details} />
      <Participants event_id={id} />
    </Card>
  );
}

export default Event;
