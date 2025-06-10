const mongoose = require("mongoose")

const productCodeSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    batchNumber: {
      type: String,
      required: true,
    },
    uniqueCode: {
      type: String,
      required: true,
      unique: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)


module.exports = mongoose.model("ProductCode", productCodeSchema)
