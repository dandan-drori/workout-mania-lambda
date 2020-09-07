const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: { type: String, required: true },
	password: { type: String, required: true },
	email: { type: String, required: true },
	preferences: { type: Object },
	profileInfo: { type: Object },
})

module.exports = mongoose.model('User', userSchema)
