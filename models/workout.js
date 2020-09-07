const mongoose = require('mongoose')

const workoutSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: { type: String, required: true },
	exercises: { type: Array },
	createdAt: { type: Number },
})

module.exports = mongoose.model('Workout', workoutSchema)
