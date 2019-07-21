const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = Schema({
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true
	},
	// conection between user and event models
	createdEvents: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Event'
		}
	]
});

module.exports =  mongoose.model('User', userSchema);