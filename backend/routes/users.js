const router = require('express').Router();
const {
  getUsers,
  getUser,
  getCurrentUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');
const {
  getUserValid,
  updateProfileValid,
  updateAvatarValid,
} = require('../middlewares/users-validate');

router.get('/', getUsers);
router.get('/:userId', getUserValid, getUser);
router.get('/me', getCurrentUser);
router.patch('/me', updateProfileValid, updateProfile);
router.patch('/me/avatar', updateAvatarValid, updateAvatar);

module.exports = router;
