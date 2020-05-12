const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const labelSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const Label = mongoose.model('Label', labelSchema);

module.exports = Label;
