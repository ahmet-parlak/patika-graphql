import PropTypes from "prop-types";
import { Collapse, Card, Empty, Spin } from "antd";
import { useLazyQuery } from "@apollo/client";
import { GET_PARTICIPANTS, PARTICIPANTS_SUBSCRIPTION } from "./queries";
import styles from "./styles.module.css";
import { useEffect } from "react";

function Participants({ event_id }) {
  const [getParticipants, { subscribeToMore, loading, error, data }] = useLazyQuery(
    GET_PARTICIPANTS,
    {
      variables: { id: event_id },
    }
  );

  const onChange = (key) => {
    if (key == "1") {
      getParticipants();
    }
  };

  useEffect(() => {
    subscribeToMore({
      document: PARTICIPANTS_SUBSCRIPTION,
      variables: { id: event_id },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newParticipant = subscriptionData.data.participantAdded;

        return Object.assign({}, prev, {
          event: {
            ...prev.event,
            participants: [newParticipant, ...prev.event.participants],
          },
        });
      },
    });
  }, [subscribeToMore, event_id]);

  const items = [
    {
      key: "1",
      label: "Participants",
      children: (
        <div className={styles.participants}>
          {loading ? (
            <Spin size="large" />
          ) : error ? (
            "Error"
          ) : data?.event.participants.length === 0 ? (
            <div className={styles.emptyContainer}>
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>
          ) : (
            data?.event.participants.map((participant) => (
              <Card key={participant.id + "_prt"} className={styles.participantItem}>
                {participant.user.username}
              </Card>
            ))
          )}
        </div>
      ),
    },
  ];

  return <Collapse items={items} onChange={onChange} />;
}

Participants.propTypes = {
  event_id: PropTypes.string.isRequired,
};
export default Participants;
