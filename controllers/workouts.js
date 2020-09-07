const Workout = require('../models/workout')
const User = require('../models/user')
const mongoose = require('mongoose')

exports.workouts_get_all = (req, res, next) => {
	Workout.find()
		.select('_id name exercises createdAt')
		.exec()
		.then(docs => {
			const response = {
				count: docs.length,
				workouts: docs.map(doc => {
					return {
						_id: doc._id,
						name: doc.name,
						exercises: doc.exercises,
						createdAt: doc.createdAt,
					}
				}),
			}
			res.status(200).json(response)
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err,
			})
		})
}

exports.workouts_post_workout = (req, res) => {
	const workout = new Workout({
		_id: mongoose.Types.ObjectId(),
		name: req.body.name,
		exercises: [],
		createdAt: new Date().getTime(),
	})
	res.status(201).json({
		message: 'Created Workout Successfully',
	})
	return workout.save()
}

exports.workouts_get_one = (req, res) => {
	const name = req.params.workoutName
	Workout.find({ name: name })
		.select('_id name exercises createdAt')
		.exec()
		.then(workout => {
			if (workout.length < 1) {
				return res.status(404).json({ message: 'No valid entry found' })
			}
			res.status(200).json({ workout: workout })
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({ error: err })
		})
}

exports.workouts_delete_workout = (req, res) => {
	const name = req.body.name
	Workout.deleteOne({ name: name })
		.exec()
		.then(result => {
			res.status(200).json({ message: 'Workout deleted' })
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({ error: err })
		})
}

exports.workouts_update_workout = (req, res) => {
	const name = req.params.workoutName
	const updateOps = {}
	for (let ops of req.body) {
		updateOps[ops.propName] = ops.value
	}
	Workout.updateOne({ name: name }, { $set: updateOps })
		.exec()
		.then(result => {
			res.status(200).json({
				message: 'Workout updated',
			})
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err,
			})
		})
}
