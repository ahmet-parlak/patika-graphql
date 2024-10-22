import mongoose from "mongoose";
import Vote from "./Vote.js";

const Schema = mongoose.Schema;

const OptionSchema = new Schema({
  id: {
    type: String,
    default: function () {
      return this._id.toString();
    },
  },
  option: {
    type: String,
    required: true,
  },
});

const QuestionSchema = new Schema({
  id: {
    type: String,
    default: function () {
      return this._id.toString();
    },
  },
  title: {
    type: String,
    required: true,
  },
  options: [OptionSchema],
  status: {
    type: String,
    enum: ["active", "passive", "draft"],
    default: "draft",
  },
  created: { type: Date, default: Date.now },
});

QuestionSchema.pre("remove", async function (next) {
  try {
    await Vote.deleteMany({ question_id: this._id });
    next();
  } catch (error) {
    next(error);
  }
});

QuestionSchema.virtual("optionsWithVoteCount").get(async function () {
  const votes = await Vote.aggregate([
    { $match: { question_id: this._id } },
    { $group: { _id: "$option_id", count: { $sum: 1 } } },
  ]);

  const voteCountMap = votes.reduce((acc, vote) => {
    acc[vote._id] = vote.count;
    return acc;
  }, {});

  return this.options.map((option) => ({
    ...option.toObject(),
    vote_count: voteCountMap[option._id] || 0,
  }));
});

const Qusetion = mongoose.model("Question", QuestionSchema);

export default Qusetion;
