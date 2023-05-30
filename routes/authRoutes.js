const express = require('express');
const { registerUser, loginUser, getAllUsers, updateUser, deleteUser, getUser, handleRefreshToken, logoutUser, resetPasswordToken, resetPassword } = require('../controllers/userController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddlewares');
const router = express.Router()

router.post('/register',registerUser)
router.post('/login',loginUser)
router.get('/logout',logoutUser)
router.post('/reset-password-token',resetPasswordToken)
router.post('/reset-password/:token',resetPassword)
router.get('/refresh',handleRefreshToken)
router.put('/:id',updateUser)
router.delete('/:id',deleteUser)
router.get('/all',authMiddleware,isAdmin,getAllUsers)
router.get('/:id',authMiddleware,getUser)
module.exports = router;