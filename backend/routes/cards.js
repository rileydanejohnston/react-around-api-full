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
router.put('/likes/:cardId', editCardLikeValid, likeCard);
router.delete('/likes/:cardId', editCardLikeValid, dislikeCard);

module.exports = router;
