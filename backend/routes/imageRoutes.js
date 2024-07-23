const express = require('express');
const imageController = require('../controllers/imageController');
const router = express.Router();

// Define routes
router.post('/', imageController.postImage);

module.exports = router;