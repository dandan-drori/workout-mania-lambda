const express = require('express')
const router = express.Router()
const usersController = require('../controllers/users')

router.get('/', usersController.users_get_all)

router.post('/signup', usersController.users_signup_user)

router.get('/:email', usersController.users_get_one)

router.delete('/', usersController.users_delete_user)

router.patch('/:email', usersController.users_update_user)

router.post('/login', usersController.users_login_user)

module.exports = router
