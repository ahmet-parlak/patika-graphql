import mongoose from "mongoose";

const Schema = mongoose.Schema;

const VoteSchema = new Schema({
  id: {
    type: String,
    default: function () {
      return this._id.toString();
    },
  },
  option_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Option",
  },
  question_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
  },
  created: { type: Date, default: Date.now },
});

const Vote = mongoose.model("Vote", VoteSchema);

export default Vote;
