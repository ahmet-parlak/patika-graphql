import { useEffect } from "react";
import { Card, List } from "antd";
import { useQuery } from "@apollo/client";
import { GET_EVENTS, EVENTS_SUBSCRIPTION } from "./queries";
import styles from "./styles.module.css";
import { Link } from "react-router-dom";
import Loading from "components/Loading";

function Home() {
  const { subscribeToMore, loading, error, data } = useQuery(GET_EVENTS);

  useEffect(() => {
    subscribeToMore({
      document: EVENTS_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newEvent = subscriptionData.data.eventCreated;
        
        return Object.assign({}, prev, {
          events: [newEvent, ...prev.events],
        });
      },
    });
  }, [subscribeToMore]);

  if (loading) return <Loading />;
  if (error) return <p>Error :{error.message}</p>;

  return (
    <>
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 4,
          lg: 4,
          xl: 6,
          xxl: 3,
        }}
        dataSource={data.events}
        renderItem={(item) => (
          <List.Item>
            <Link to={`/events/${item.id}`}>
              <Card
                title={item.title}
                className={styles.card}
                extra={<div className={styles.dateContainer}>{item.date}</div>}
              >
                <div className={styles.descContainer}>
                  {item.desc.length > 300 ? item.desc.substring(0, 300) + "..." : item.desc}
                </div>
              </Card>
            </Link>
          </List.Item>
        )}
      />
    </>
  );
}

export default Home;
