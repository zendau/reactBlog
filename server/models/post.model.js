const { Schema, model } = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - author
 *         - file
 *         - title
 *         - body
 *       properties:
 *         author:
 *           type: ObjectId
 *           description: ref Users collection
 *         file:
 *           type: ObjectId
 *           description: ref Files collection
 *         title:
 *           type: string
 *           description: Title of created blog
 *         body:
 *           type: string
 *           description: Text body of created blog
 *         createdDate:
 *           type: Date
 *           description: Data when blog was created
 *         timeRead:
 *           type: Number
 *           description: time of read post
 *         readCount:
 *           type: Number
 *           description: post's read counter
 *       example:
 *         author: 62c7234d9f3f1739381f93c4
 *         file: 62c811ea89c1ae26b06fd9c3
 *         title: test
 *         timeRead: 10
 *         readCount: 145
 *         body: blog content
 *         createdDate: Fri Jul 08 2022 11:15:54 GMT+0000 (Coordinated Universal Time)
 */

const PostSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "Users", required: true },
  file: { type: Schema.Types.ObjectId, ref: "Files", required: true },
  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: "Tags",
    },
  ],
  title: { type: String, required: true },
  body: { type: String, required: true },
  timeRead: { type: Number, required: true },
  readCount: { type: Number, default: 0 },
  createdDate: { type: Date, required: true, default: Date.now },
});

module.exports = model("Posts", PostSchema);
