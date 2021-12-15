const router = require('express').Router();
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const {
  deleteCardValid,
  createCardValid,
  editCardLikeValid,
} = require('../middlewares/cards-validate');

router.get('/', getCards);
router.post('/', createCardValid, createCard);
router.delete('/:id', deleteCardValid, deleteCard);
router.put('/:cardId/likes', editCardLikeValid, likeCard);
router.delete('/:cardId/likes', editCardLikeValid, dislikeCard);

module.exports = router;
