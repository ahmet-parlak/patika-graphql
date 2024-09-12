import { gql } from "@apollo/client";

export const GET_LOCATIONS = gql`
  query GetLocations {
    locations {
      id
      name
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      username
    }
  }
`;

export const CREATE_EVENT = gql`
  mutation CreateEvent($data: CreateEventInput!) {
    createEvent(data: $data) {
      id
      title
    }
  }
`;
