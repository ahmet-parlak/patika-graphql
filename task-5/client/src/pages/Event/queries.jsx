import { gql } from "@apollo/client";

export const GET_EVENT = gql`
  query GetEvent($id: ID!) {
    event(id: $id) {
      id
      title
      desc
      date
      from
      to
      location {
        name
        desc
        lat
        lng
      }
    }
  }
`;

export const GET_PARTICIPANTS = gql`
  query GetParticipants($id: ID!) {
    event(id: $id) {
      participants {
        id
        user {
          id
          username
        }
      }
    }
  }
`;

export const PARTICIPANTS_SUBSCRIPTION = gql`
  subscription Participant($id: ID!) {
    participantAdded(event_id: $id) {
      id
      user {
        id
        username
      }
    }
  }
`;
