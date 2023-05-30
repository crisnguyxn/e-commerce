const express =  require('express');
const { createProduct, deleteProduct, updateProduct, getProduct, getAllProductsByUserId, getAllProducts } = require('../controllers/productController');
const { authMiddleware } = require('../middlewares/authMiddlewares');
const router = express.Router()


router.post("/create",authMiddleware,createProduct)
router.get("/all",getAllProducts)
router.get("/by-user/:userId",getAllProductsByUserId)
router.get("/:id",getProduct)
router.put("/:id",authMiddleware,updateProduct)
router.delete("/:id",authMiddleware,deleteProduct)
module.exports = router;