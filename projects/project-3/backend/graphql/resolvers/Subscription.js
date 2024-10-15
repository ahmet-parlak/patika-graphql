const Subscription = {
  messageCreated: {
    subscribe: (_, __, { pubSub }) => pubSub.asyncIterator("messageCreated"),
    resolve: (payload) => payload.createdMessage,
  },
};

export default Subscription;
