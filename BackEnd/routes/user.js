const express = require("express")
const ProductCode = require("../models/ProductCode")
const Product = require("../models/Product")
const { auth } = require("../middleware/auth")

const router = express.Router()

// Search product using unique code
router.get("/search/:uniqueCode", auth, async (req, res) => {
  try {
    const { uniqueCode } = req.params

    // Find the product code
    const productCode = await ProductCode.findOne({ uniqueCode }).populate("productId")

    if (!productCode) {
      return res.status(404).json({ error: "Invalid unique code" })
    }

    const product = productCode.productId

    res.json({
      message: "Product found",
      product: {
        id: product._id,
        name: product.name,
        mrp: product.mrp,
        image: `/uploads/${product.image}`,
        batchNumber: productCode.batchNumber,
        uniqueCode: productCode.uniqueCode,
        isUsed: productCode.isUsed,
      },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})


module.exports = router
