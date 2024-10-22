import { gql } from "@apollo/client";

export const GET_QUESTIONS = gql`
  query questions {
    questions {
      id
      title
    }
  }
`;

export const GET_QUESTION = gql`
  query question($id: ID!) {
    question(id: $id) {
      id
      title
      options {
        id
        option
        vote_count
      }
    }
  }
`;

export const CREATE_QUESTION = gql`
  mutation CreateQuestion($data: CreateQuestionInput!) {
    createQuestion(data: $data) {
      id
      title
      options {
        id
        option
      }
    }
  }
`;

export const SUBSCRIBE_QUESTIONS = gql`
  subscription SubscribeQuestions {
    questionCreated {
      id
      title
    }
  }
`;

export const VOTE_QUESTION = gql`
  mutation Vote($vote_data: VoteInput!) {
    vote(data: $vote_data) {
      question_id
      option_id
    }
  }
`;

export const SUBSCRIBE_VOTES = gql`
  subscription SubscribeVotes($question_id: ID!) {
    voted(question_id: $question_id) {
      id
      title
      options {
        id
        option
        vote_count
      }
    }
  }
`;
