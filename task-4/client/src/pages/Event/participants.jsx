import PropTypes from "prop-types";
import { Collapse, Card, Empty, Spin } from "antd";
import { useLazyQuery } from "@apollo/client";
import { GET_PARTICIPANTS } from "./queries";
import styles from "./styles.module.css";

function Participants({ event_id }) {
  const [getParticipants, { loading, error, data }] = useLazyQuery(GET_PARTICIPANTS, {
    variables: { id: event_id },
  });

  const onChange = (key) => {
    if (key == "1") {
      getParticipants();
    }
  };

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
