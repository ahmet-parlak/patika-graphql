const Mutation = {
  createMessage: (parent, { data }, { pubSub }) => {
    const message = {
      message: data.message,
      date: new Date(),
    };

    pubSub.publish("messageCreated", { createdMessage: message });

    return message;
  },
};

export default Mutation;
