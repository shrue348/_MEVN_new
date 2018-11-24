var mongoose = require('mongoose');
var TaskSchema = new mongoose.Schema({
  title: String,
  creator: String,
  maker: String,
  linkedUsers: Array,
  comments: Array,
  status: String,
  priority: Number,
  active: Boolean,
  description: String,
  updated_date: { type: Date, default: Date.now },
  created_date: { type: Date },
  deadline_date: { type: Date }
});

module.exports = mongoose.model('Task', TaskSchema);
