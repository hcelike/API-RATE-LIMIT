const mongoose = require("mongoose");

const APIKeySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
  },
  key: {
    type: String,
    required: true
  },
});

const APIKey = mongoose.model("APIKey", APIKeySchema);

exports.APIKey = APIKey;
