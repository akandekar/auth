const router = require('express').Router();
const userController = require('../controllers/user');
const auth = require('../middleware/auth')

// Register a new User
router.post('/register',userController.register);

// Login
router.post('/login',userController.login);

router.get('/events',auth.verifyUserToken,auth.IsUser,userController.checkAuthorised);

module.exports = router;