const mongoose = require("mongoose");
// const { APIKey } = require("./apikey");

const APIAccessSchema = new mongoose.Schema(
  {
    key: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "APIKey",
    },
    served: {
      // if API was served, return true
      type: Boolean,
      default: false,
    },
    // there can be extra field like ip address
  },
  {
    timestamps: true,
  }
);

exports.APIAccess = mongoose.model("APIAccess", APIAccessSchema);
