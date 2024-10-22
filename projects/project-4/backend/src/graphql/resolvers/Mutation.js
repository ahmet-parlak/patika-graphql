import { GraphQLError } from "graphql";

const Mutation = {
  createQuestion: async (_, args, { db, pubSub }) => {
    const { title, options } = args.data;

    if (!title || title.length < 3) {
      throw new GraphQLError("Question title must be at least 3 characters long");
    }

    if (!options || options.length < 2) {
      throw new GraphQLError("Question must have at least two options");
    }

    try {
      const optionDocuments = options.map((option) => ({ option }));
      const question = await db.Question.create({ title, options: optionDocuments });

      pubSub.publish("questionCreated", { createdQuestion: question });
      return question;
    } catch (error) {
      console.log(error);
      throw new GraphQLError("Something went wrong while creating the question");
    }
  },

  vote: async (_, args, { db, pubSub }) => {
    const { question_id, option_id } = args.data;

    if (!question_id || !option_id) {
      throw new GraphQLError("Missing question_id or option_id");
    }

    try {
      const question = await db.Question.findOne({ _id: question_id, "options._id": option_id });

      if (question) {
        const vote = await db.Vote.create({ question_id, option_id });
        pubSub.publish("voted", { vote });
        return vote;
      }

      throw new GraphQLError("Question or option not found");
    } catch (error) {
      console.log(error);
      throw new GraphQLError("Something went wrong while voting");
    }
  },
};

export default Mutation;
