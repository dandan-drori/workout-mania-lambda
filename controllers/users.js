const mongoose = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.users_get_all = (req, res) => {
	User.find()
		.select('_id name password email preferences profileInfo')
		.exec()
		.then(docs => {
			const response = {
				count: docs.length,
				users: docs.map(doc => {
					return {
						_id: doc._id,
						name: doc.name,
						password: doc.password,
						email: doc.email,
						preferences: doc.preferences,
						profileInfo: doc.profileInfo,
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

exports.users_signup_user = (req, res) => {
	User.find({ email: req.body.email })
		.exec()
		.then(user => {
			if (user.length > 0) {
				return res
					.status(409)
					.json({ message: 'Email address already exists!' })
			} else {
				bcrypt.hash(req.body.password, 10, (err, hash) => {
					if (err) {
						return res.status(500).json({
							error: err,
						})
					} else {
						const user = new User({
							_id: new mongoose.Types.ObjectId(),
							email: req.body.email,
							name: req.body.name,
							password: hash,
							preferences: {},
							profileInfo: {},
						})
						user
							.save()
							.then(result => {
								console.log(result)
								res.status(201).json({
									message: 'Created user successfully',
									createdUser: {
										email: result.email,
										password: result.password,
										name: req.body.name,
										_id: result._id,
										preferences: result.preferences,
										profileInfo: result.profileInfo,
									},
								})
							})
							.catch(err => {
								console.log(err)
								res.status(500).json({
									error: err,
								})
							})
					}
				})
			}
		})
}

exports.users_get_one = (req, res) => {
	const email = req.params.email
	User.find({ email: email })
		.select('_id name email password preferences profileInfo')
		.exec()
		.then(user => {
			if (user.length < 1) {
				return res.status(404).json({ message: 'No valid entry found' })
			}
			res.status(200).json({ user: user })
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({ error: err })
		})
}

exports.users_delete_user = (req, res) => {
	const email = req.body.email
	User.deleteOne({ email: email })
		.exec()
		.then(result => {
			res.status(200).json({ message: 'User deleted' })
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({ error: err })
		})
}

exports.users_update_user = (req, res) => {
	const email = req.params.email
	const updateOps = {}
	for (let ops of req.body) {
		updateOps[ops.propName] = ops.value
	}
	User.updateOne({ email: email }, { $set: updateOps })
		.exec()
		.then(result => {
			res.status(200).json({
				message: 'User updated',
			})
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err,
			})
		})
}

exports.users_login_user = (req, res) => {
	User.find({ email: req.body.email })
		.exec()
		.then(user => {
			if (user.length < 1) {
				return res.status(401).json({
					message: 'Authentication process failed',
				})
			}
			bcrypt.compare(req.body.password, user[0].password, (err, result) => {
				if (err) {
					return res.status(401).json({
						message: 'Authentication process failed',
					})
				}
				if (result) {
					const token = jwt.sign(
						{
							email: user[0].email,
							userId: user[0]._id,
						},
						process.env.JWT_KEY,
						{
							expiresIn: '1h',
						}
					)
					return res.status(200).json({
						message: 'Authentication process successful',
						token: token,
					})
				}
				res.status(401).json({
					message: 'Authentication process failed',
				})
			})
		})
		.catch(err => {
			res.status(500).json({
				error: err,
			})
		})
}
