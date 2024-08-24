const { createServer } = require("node:http");
const { createSchema, createYoga, createPubSub } = require("graphql-yoga");

const { users, events, locations, participants } = require("./data.js");
const { subscribe } = require("graphql");

const pubsub = createPubSub();

const typeDefs = `#graphql
    # User
    type User {
        id: ID!,
        username: String!,
        email: String!,
        events: [Event!]
    }

    input CreateUserInput {
        username: String!,
        email: String!
    }

    input UpdateUserInput{
        username: String,
        email: String
    }

    # Event
    type Event {
        id: ID!,
        title: String!,
        desc: String!,
        date: String!,
        from: String!,
        to: String!,
        location_id: ID!,
        user_id: ID!,
        location: Location!,
        user: User!,
        participants: [Participant!]
    }

    input CreateEventInput {
        title: String!,
        desc: String!,
        date: String!,
        from: String!,
        to: String!,
        location_id: ID!,
        user_id: ID!
    }

    input UpdateEventInput {
        title: String,
        desc: String,
        date: String,
        from: String,
        to: String,
        location_id: ID,
        user_id: ID
    }



    # Location
    type Location {
        id: ID!,
        name: String!,
        desc: String!,
        lat: Float!,
        lng: Float!
    }
    input CreateLocationInput {
        name: String!,
        desc: String!,
        lat: Float!,
        lng: Float!
    }
    input UpdateLocationInput {
        name: String,
        desc: String,
        lat: Float,
        lng: Float
    }

    # Participant
    type Participant {
        id:ID!,
        user_id:ID!,
        event_id:ID!,
        user: User!,
        event: Event!
    }
    input CreateParticipantInput {
        user_id: ID!,
        event_id: ID!
    }

    input UpdateParticipantInput {
        user_id: ID,
        event_id: ID
    }

    type DeleteAllOutput {
        count: Int!
    }

    # Query
    type Query {
        users: [User!]!,
        user(id: ID!): User,
        events: [Event!]!,
        event(id: ID!): Event,
        locations: [Location!]!,
        location(id: ID!): Location,
        participants: [Participant!]!,
        participant(id: ID!): Participant
    }

    # Mutation
    type Mutation {
      # User
      createUser(data: CreateUserInput!): User!,
      updateUser(id: ID!, data: UpdateUserInput!): User!,
      deleteUser(id: ID!): User!,
      deleteAllUsers: DeleteAllOutput!

      # Event
      createEvent(data: CreateEventInput!): Event!,
      updateEvent(id: ID!, data: UpdateEventInput!): Event!,
      deleteEvent(id: ID!): Event!
      deleteAllEvents: DeleteAllOutput!

      # Location
      createLocation(data: CreateLocationInput!): Location!,
      updateLocation(id: ID!, data: UpdateLocationInput!): Location!,
      deleteLocation(id: ID!): Location!,
      deleteAllLocations: DeleteAllOutput!

      # Participant
      createParticipant(data: CreateParticipantInput!): Participant!,
      updateParticipant(id: ID!, data: UpdateParticipantInput!): Participant!,
      deleteParticipant(id: ID!): Participant!,
      deleteAllParticipants: DeleteAllOutput!
    }

    #Subcription
    type Subscription {
        userCreated: User!
        eventCreated: Event!
        participantAdded: Participant!
    }

    
`;

const resolvers = {
  Subscription: {
    userCreated: {
      subscribe: () => pubsub.subscribe("userCreated"),
    },
    eventCreated: {
      subscribe: () => pubsub.subscribe("eventCreated"),
    },
    participantAdded: {
      subscribe: () => pubsub.subscribe("participantAdded"),
    },
  },

  Query: {
    users: () => users,
    user: (_, args) => users.find((user) => user.id == args.id),
    events: () => events,
    event: (_, args) => events.find((event) => event.id == args.id),
    locations: () => locations,
    location: (_, args) => locations.find((location) => location.id == args.id),
    participants: () => participants,
    participant: (_, args) =>
      participants.find((participant) => participant.id == args.id),
  },

  Mutation: {
    // User
    createUser: (_, { data }) => {
      const user = {
        id: users.length + 1,
        username: data.username,
        email: data.email,
      };

      users.push(user);

      pubsub.publish("userCreated", { userCreated: user });

      return user;
    },

    updateUser: (_, { id, data }) => {
      const user = users.find((user) => user.id == id);

      if (!user) throw new Error("User not found");

      user.username = data?.username || user.username;
      user.email = data?.email || user.email;
      return user;
    },

    deleteUser: (_, { id }) => {
      const user = users.find((user) => user.id == id);
      if (!user) throw new Error("User not found");

      const index = users.indexOf(user);
      users.splice(index, 1);
      return user;
    },
    deleteAllUsers: () => {
      const count = users.length;
      users.splice(0, users.length);
      return { count };
    },

    // Event
    createEvent: (_, { data }) => {
      const event = {
        id: events.length + 1,
        ...data,
      };

      events.push(event);

      pubsub.publish("eventCreated", { eventCreated: event });

      return event;
    },

    updateEvent: (_, { id, data }) => {
      const eventIndex = events.findIndex((event) => event.id == id);

      if (eventIndex === -1) throw new Error("Event not found");

      events[eventIndex] = {
        ...events[eventIndex],
        ...data,
      };
      return events[eventIndex];
    },

    deleteEvent: (_, { id }) => {
      const event = events.find((event) => event.id == id);
      if (!event) throw new Error("Event not found");

      const index = events.indexOf(event);
      events.splice(index, 1);
      return event;
    },
    deleteAllEvents: () => {
      const count = events.length;
      events.splice(0, events.length);
      return { count };
    },

    // Location
    createLocation: (_, { data }) => {
      const location = {
        id: locations.length + 1,
        ...data,
      };

      locations.push(location);
      return location;
    },

    updateLocation: (_, { id, data }) => {
      const locationIndex = locations.findIndex(
        (location) => location.id == id
      );

      if (locationIndex === -1) throw new Error("Location not found");

      locations[locationIndex] = {
        ...locations[locationIndex],
        ...data,
      };
      return locations[locationIndex];
    },

    deleteLocation: (_, { id }) => {
      const locationIndex = locations.findIndex(
        (location) => location.id == id
      );
      if (locationIndex === -1) throw new Error("Location not found");

      const location = locations[locationIndex];
      locations.splice(locationIndex, 1);
      return location;
    },

    deleteAllLocations: () => {
      const count = locations.length;
      locations.splice(0, locations.length);
      return { count };
    },

    // Participant
    createParticipant: (_, { data }) => {
      const participant = {
        id: participants.length + 1,
        ...data,
      };

      participants.push(participant);
      pubsub.publish("participantAdded", { participantAdded: participant });
      return participant;
    },

    updateParticipant: (_, { id, data }) => {
      const participantIndex = participants.findIndex(
        (participant) => participant.id == id
      );

      if (participantIndex === -1) throw new Error("Participant not found");

      participants[participantIndex] = {
        ...participants[participantIndex],
        ...data,
      };
      return participants[participantIndex];
    },

    deleteParticipant: (_, { id }) => {
      const participantIndex = participants.findIndex(
        (participant) => participant.id == id
      );

      if (participantIndex === -1) throw new Error("Participant not found");

      const participant = participants[participantIndex];
      participants.splice(participantIndex, 1);
      return participant;
    },

    deleteAllParticipants: () => {
      const count = participants.length;
      participants.splice(0, participants.length);
      return { count };
    },
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

const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
});

const server = createServer(yoga);

server.listen(3000, () => {
  console.info("Server is running on http://localhost:3000/graphql");
});
