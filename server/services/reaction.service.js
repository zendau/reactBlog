const { ObjectId } = require('mongodb');
const reactionModel = require("../models/reaction.model")
const ReactionDto = require("../dtos/reaction.dto");

class ReactionService {

  async add(postId, userId, isLiked) {

    await reactionModel.create({
      post: postId,
      user: userId,
      isLiked
    })
  }

  async setReaction(postId, userId, isLiked) {
    const res = await reactionModel.findOneAndUpdate({
      $and: [
        { post: postId },
        { user: userId }
      ]
    },
      { $set: { isLiked } }
    )

    if (res === null) {
      return false
    }
    return true
  }

  async getReactionsCount(postId, userId) {
    debugger
    const tokenData = await reactionModel.aggregate([
      {
        "$match": {
          post: ObjectId(postId)
        }
      },
      {
        "$group": {
          _id: null,
          like: {
            "$sum": {
              "$cond": [
                "$isLiked",
                1,
                0
              ]
            }
          },
          dislike: {
            "$sum": {
              "$cond": [
                "$isLiked",
                0,
                1
              ]
            }
          },
          user: {
            "$push": {
              "$cond": [
                {
                  "$eq": [
                    "$user",
                    ObjectId(userId)
                  ]
                },
                {
                  "isLiked": "$isLiked"
                },
                "$$REMOVE"
              ]
            }
          }
        }
      },
      {
        $project: {
          _id: 0
        }
      }
    ])
    return new ReactionDto(tokenData[0])
  }
}

module.exports = new ReactionService()