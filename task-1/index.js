import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { events, locations, users, participants } from "./data.js";

const typeDefs = `#graphql
  type User {
    id: ID!
    username: String!
    email: String!
    events: [Event!]!
  }

  type Event{
    id: ID!
    title: String!
    desc: String!
    date: String!
    from: String!
    to: String!
    location_id: ID!
    user_id: ID!
    user: User!
    location: Location!
    participants: [Participant!]!
  }

  type Location{
    id: ID
    name: String! 
    desc: String!
    lat: Float!
    lng: Float!
  }

  type Participant{
    id: ID!
    user_id: ID! 
    event_id: ID!
    user: User!
    event: Event!
  }

  type Query {
    users: [User!]!,
    user(id: ID!):User!,
    
    events:[Event!]!,
    event(id: ID!): Event!,
    
    locations:[Location!]!,
    location(id: ID!): Location!
    
    participants:[Participant!]!,
    participant(id: ID!): Participant!
  }
`;

const resolvers = {
  Query: {
    users: () => users,
    user: (parent, args) => users.find((user) => user.id == args.id),

    events: () => events,
    event: (parent, args) => events.find((event) => event.id == args.id),

    locations: () => locations,
    location: (parent, args) =>
      locations.find((location) => location.id == args.id),

    participants: () => participants,
    participant: (parent, args) =>
      participants.find((participant) => participant.id == args.id),
  },
  User: {
    events: (parent) => events.filter((event) => event.user_id == parent.id),
  },
  Event: {
    user: (parent) => users.find((user) => user.id == parent.user_id),
    location: (parent) =>
      locations.find((location) => location.id == parent.location_id),
    participants: (parent) =>
      participants.filter((participant) => participant.event_id == parent.id),
  },
  Participant: {
    user: (parent) => users.find((user) => user.id == parent.user_id),
    event: (parent) => events.find((event) => event.id == parent.event_id),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
