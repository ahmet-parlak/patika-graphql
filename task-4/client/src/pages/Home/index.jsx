import { Card, List } from "antd";
import { useQuery } from "@apollo/client";
import { GET_EVENTS } from "./queries";
import styles from "./styles.module.css";
import { Link } from "react-router-dom";
import Loading from "components/Loading";
function Home() {
  const { loading, error, data } = useQuery(GET_EVENTS);
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
