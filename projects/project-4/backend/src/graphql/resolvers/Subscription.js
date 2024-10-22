import { withFilter } from "graphql-subscriptions";

const Subscription = {
  questionCreated: {
    subscribe: (_, __, { pubSub }) => pubSub.asyncIterator(["questionCreated"]),

    resolve: (payload) => ({
      ...payload.createdQuestion,
      id: payload.createdQuestion._id,
      options: payload.createdQuestion.options.map((option) => ({
        ...option,
        id: option._id,
      })),
    }),
  },

  voted: {
    subscribe: withFilter(
      (_, __, { pubSub }) => pubSub.asyncIterator(["voted"]),
      (payload, { question_id }) => {
        return payload.vote.question_id === question_id;
      }
    ),
    resolve: async (payload, _, { db }) => {
      try {
        const question = await db.Question.findById(payload.vote.question_id);
        const optionsWithVoteCount = await question.optionsWithVoteCount;

        const questionWithVotes = {
          ...question._doc,
          options: optionsWithVoteCount,
        };

        return questionWithVotes;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
  },
};

export default Subscription;
