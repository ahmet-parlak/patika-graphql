import { useState } from "react";
import { useParams } from "react-router-dom";
import { Result, Spin, Empty, Divider } from "antd";

import { useQuery, useMutation, useSubscription } from "@apollo/client";
import { GET_QUESTION, VOTE_QUESTION, SUBSCRIBE_VOTES } from "../../Apollo/queries";

export default function Question() {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_QUESTION, { variables: { id } });
  const [vote, { loading: voteLoading, error: voteError }] = useMutation(VOTE_QUESTION);
  const { data: voteData } = useSubscription(SUBSCRIBE_VOTES, { variables: { question_id: id } });

  const [selected, setSelected] = useState();

  const question = data?.question;
  let options = question?.options;

  const handleVote = () => {
    vote({ variables: { vote_data: { question_id: id, option_id: selected } } });
  };

  if (voteData) {
    console.log(voteData);
    
    options = voteData.voted.options;
  }

  const total = calculateTotalVotes(options);

  return (
    <div>
      {loading && <Spin size="large" tip="Loading..." fullscreen />}
      {(error || voteError) && (
        <Result
          status="warning"
          title="Somethings wrong with the GraphQL server"
          extra={<p>{error.message}</p>}
        />
      )}
      {!loading && !error && !question && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}

      {question && (
        <div>
          <h2>{question.title}</h2>
          <Divider />
          {options?.map((option, index) => (
            <div key={index + "_o"}>
              <label htmlFor={index}>
                <input
                  name="selected"
                  id={index}
                  type="radio"
                  value={option.id}
                  disabled={loading}
                  onChange={({ target }) => setSelected(target.value)}
                />
                <span>{option.option}</span>
              </label>
              <div>
                <progress value={option.vote_count} max={total}></progress>{" "}
                <span>{option.vote_count}</span>
              </div>
            </div>
          ))}

          <button disabled={!selected || voteLoading} onClick={handleVote}>
            Vote!
          </button>
        </div>
      )}
    </div>
  );
}

function calculateTotalVotes(options) {
  if (!options) return 0;
  const totalVotes = options.reduce((sum, option) => sum + option.vote_count, 0);

  return totalVotes;
}
