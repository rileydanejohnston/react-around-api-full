const router = require('express').Router();
const {
  getCurrentUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');
const {
  updateProfileValid,
  updateAvatarValid,
} = require('../middlewares/users-validate');

router.get('/me', getCurrentUser);
router.patch('/me', updateProfileValid, updateProfile);
router.patch('/me/avatar', updateAvatarValid, updateAvatar);

module.exports = router;
