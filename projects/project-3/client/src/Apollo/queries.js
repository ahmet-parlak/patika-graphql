import { gql } from "@apollo/client";

export const SEND_MESSAGE = gql`
  mutation sendMessage($message: String!) {
    createMessage(data: { message: $message }) {
      message
      date
    }
  }
`;

export const GET_MESSAGES = gql`
  query getMessages {
    messages {
      message
      date
    }
  }
`;

export const SUBSCRIBE_MESSAGES = gql`
  subscription {
    messageCreated {
      message
      date
    }
  }
`;
