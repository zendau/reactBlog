const { ObjectId } = require("mongodb");
const reactionModel = require("../models/reaction.model");
const ReactionDTO = require("../dtos/reaction.dto");

class ReactionService {
  async add(postId, userId, isLiked) {
    await reactionModel.create({
      post: postId,
      user: userId,
      isLiked,
    });
  }

  async setReaction(postId, userId, isLiked) {
    if (isLiked === "null") return await this.deleteReaction(postId, userId);

    const res = await reactionModel.findOneAndUpdate(
      {
        $and: [{ post: postId }, { user: userId }],
      },
      { $set: { isLiked } }
    );

    if (res === null) {
      return false;
    }
    return true;
  }

  async deleteReaction(postId, userId) {
    const res = await reactionModel.findOneAndDelete({
      $and: [{ post: postId }, { user: userId }],
    });

    if (res === null) {
      return false;
    }
    return true;
  }

  async getReactionsCount(postId, userId) {
    const reactions = await reactionModel.aggregate([
      {
        $match: {
          post: ObjectId(postId),
        },
      },
      {
        $group: {
          _id: null,
          counterLikes: {
            $sum: {
              $cond: ["$isLiked", 1, 0],
            },
          },
          counterDislikes: {
            $sum: {
              $cond: ["$isLiked", 0, 1],
            },
          },
          user: {
            $push: {
              $cond: [
                {
                  $eq: ["$user", ObjectId(userId)],
                },
                {
                  isLiked: "$isLiked",
                },
                "$$REMOVE",
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);
    if (reactions.length === 0) {
      return new ReactionDTO({
        counterLikes: 0,
        counterDislikes: 0,
        user: [{ isLiked: null }],
      });
    }

    return new ReactionDTO(reactions[0]);
  }

  async getUserRating(postsId) {
    const reactions = await reactionModel.aggregate([
      {
        $match: {
          post: { $in: postsId },
        },
      },
      {
        $group: {
          _id: null,
          counterDislikes: {
            $sum: {
              $cond: ["$isLiked", 1, 0],
            },
          },
          counterDislikes: {
            $sum: {
              $cond: ["$isLiked", 0, 1],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);

    const likes = reactions[0]?.like ? reactions[0].like : 0;
    const dislikes = reactions[0]?.dislike ? reactions[0].dislike : 0;
    const sum = likes + dislikes;

    if (sum === 0) {
      return [0, 0];
    }

    const x1 = parseFloat((likes / sum) * 10).toFixed(2);
    const x2 = parseFloat(10 - x1).toFixed(2);

    return [x1, x2];
  }

  async getPersonalLikes(user) {
    const reactions = await reactionModel.aggregate([
      {
        $match: {
          user: ObjectId(user),
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "post",
          foreignField: "_id",
          as: "post",
        },
      },
      {
        $project: {
          _id: 0,
          id: "$_id",
          postTitle: "$post.title",
          postId: "$post._id",
          isLiked: 1,
        },
      },
    ]);
    return reactions;
  }

  async deletePostReactions(postId) {
    await reactionModel.deleteMany({ post: postId });
  }
}

module.exports = new ReactionService();
