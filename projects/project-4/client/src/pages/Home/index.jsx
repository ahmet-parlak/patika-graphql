import { useEffect } from "react";
import { Flex, Card, Result, Spin, Empty } from "antd";

import { Link } from "react-router-dom";

import { useQuery } from "@apollo/client";
import { GET_QUESTIONS, SUBSCRIBE_QUESTIONS } from "../../Apollo/queries";

export default function Home() {
  const { loading, error, data, subscribeToMore } = useQuery(GET_QUESTIONS, {
    fetchPolicy: "network-only",
  });

  const questions = data?.questions;

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: SUBSCRIBE_QUESTIONS,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        const newQuestion = subscriptionData.data.questionCreated;

        return {
          ...prev,
          questions: [newQuestion, ...prev.questions],
        };
      },
    });

    return () => unsubscribe(); // Temizleme fonksiyonu
  }, [subscribeToMore]);

  return (
    <Flex gap={"small"} justify="center" wrap>
      {loading && (
        <div style={{ textAlign: "center" }}>
          <Spin size="large" tip="Loading...">
            <p></p>
          </Spin>
          <Card loading style={{ width: 300, textAlign: "center", marginTop: 20 }}>
            <h2>Question Title</h2>
          </Card>
        </div>
      )}
      {error && (
        <Result
          status="warning"
          title="Somethings wrong with the GraphQL server"
          extra={<p>{error.message}</p>}
        />
      )}
      {questions?.length === 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}

      {questions?.map((question) => (
        <Link key={question.id} to={`/questions/${question.id}`}>
          <Card hoverable style={{ width: 300, textAlign: "center" }}>
            <h2>{question.title}</h2>
          </Card>
        </Link>
      ))}
    </Flex>
  );
}
