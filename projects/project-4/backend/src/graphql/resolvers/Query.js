const Query = {
  questions: async (_, __, { db }) => {
    const questions = await db.Question.find({}).sort({ created: -1 });
    return questions;
  },

  question: async (_, { id }, { db }) => {
    try {
      const question = await db.Question.findById(id);
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
};

export default Query;
