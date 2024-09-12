import { gql } from "@apollo/client";

const eventFragment = gql`
  fragment EventFragment on Event {
    id
    title
    desc
    date
  }
`;

export const GET_EVENTS = gql`
  query GetEvents {
    events {
      ...EventFragment
    }
  }
  ${eventFragment}
`;

export const EVENTS_SUBSCRIPTION = gql`
  subscription Event {
    eventCreated {
      ...EventFragment
    }
  }
  ${eventFragment}
`;
