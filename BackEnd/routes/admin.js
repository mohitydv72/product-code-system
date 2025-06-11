const express = require("express")
const multer = require("multer")
const { v4: uuidv4 } = require("uuid")
const path = require("path")
const fs = require("fs")
const Product = require("../models/Product")
const ProductCode = require("../models/ProductCode")
const { adminAuth } = require("../middleware/auth")

const router = express.Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/"
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname))
  },
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new Error("Only image files are allowed"))
    }
  },
})

// Add product to master
router.post("/products", adminAuth, upload.single("image"), async (req, res) => {
  try {
    const { name, batchSize, mrp } = req.body

    if (!req.file) {
      return res.status(400).json({ error: "Product image is required" })
    }

    const product = new Product({
      name,
      batchSize: Number.parseInt(batchSize),
      mrp: Number.parseFloat(mrp),
      image: req.file.filename,
      createdBy: req.user._id,
    })

    await product.save()

    res.status(201).json({
      message: "Product added successfully",
      product: {
        id: product._id,
        name: product.name,
        batchSize: product.batchSize,
        mrp: product.mrp,
        image: `/uploads/${product.image}`,
        createdAt: product.createdAt,
      },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get all products
router.get("/products", adminAuth, async (req, res) => {
  try {
    const products = await Product.find({ createdBy: req.user._id }).sort({ createdAt: -1 })

    const productsWithImageUrl = products.map((product) => ({
      id: product._id,
      name: product.name,
      batchSize: product.batchSize,
      mrp: product.mrp,
      image: `/uploads/${product.image}`,
      createdAt: product.createdAt,
    }))

    res.json({ products: productsWithImageUrl })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Generate unique codes for a product
router.post("/generate-codes", adminAuth, async (req, res) => {
  try {
    const { productId, batchNumber } = req.body

    // Verify product exists and belongs to admin
    const product = await Product.findOne({
      _id: productId,
      createdBy: req.user._id,
    })

    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }

    // Check if codes already exist for this batch
    const existingCodes = await ProductCode.findOne({
      productId,
      batchNumber,
    })

    if (existingCodes) {
      return res.status(400).json({
        error: "Codes already generated for this batch",
      })
    }

    // Generate unique codes
    const codes = []
    for (let i = 0; i < product.batchSize; i++) {
      const uniqueCode = uuidv4()
      codes.push({
        productId,
        batchNumber,
        uniqueCode,
      })
    }

    // Save codes to database
    await ProductCode.insertMany(codes)

    res.json({
      message: "Unique codes generated successfully",
      batchNumber,
      codesGenerated: product.batchSize,
      codes: codes.map((code) => code.uniqueCode),
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
