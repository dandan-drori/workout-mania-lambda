const express = require('express')
const router = express.Router()
const workoutsController = require('../controllers/workouts')

router.get('/', workoutsController.workouts_get_all)

router.post('/', workoutsController.workouts_post_workout)

router.get('/:workoutName', workoutsController.workouts_get_one)

router.delete('/', workoutsController.workouts_delete_workout)

router.patch('/:workoutName', workoutsController.workouts_update_workout)

module.exports = router
