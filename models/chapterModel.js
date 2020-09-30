const mongoose = require('mongoose')

const chapterSchema = new mongoose.Schema({
  index: Number,
  name: String,
  body: String,
})

const Chapter = mongoose.model('Chapter', chapterSchema)

module.exports = Chapter