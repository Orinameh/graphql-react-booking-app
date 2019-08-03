const Event = require('../../models/event');
const User = require('../../models/user');
const { transformEvent } = require('./merge');




module.exports = {
	// events: () => {
	// 	// return Event.find().populate('creator')
	// 	return Event.find()
	// 		.then(events => {
	// 			return events.map(event => {
	// 				// return {...event._doc}
	// 				return {
	// 					...event._doc,
	// 					date: new Date(event._doc.date).toISOString(),
	// 					creator: user.bind(this, event._doc.creator)
	// 				}

	// 			})
	// 		}).catch(err => {
	// 			throw err;
	// 		});


	// async/await
	events: async () => {
		try {
			const events = await Event.find()
			return events.map(event => {
				return transformEvent(event)

			})
		} catch (error) {
			throw error;
		}

	},
	createEvent: async (args, req) => {
		// const event = {
		// 	_id: Math.random().toString(),
		// 	title: args.eventInput.title,
		// 	description: args.eventInput.description,
		// 	price: +args.eventInput.price,
		// 	date: args.eventInput.date
		// }

		if(!req.isAuth) {
			throw new Error('user unauthenticated!')
		}
		const event = new Event({
			title: args.eventInput.title,
			description: args.eventInput.description,
			price: +args.eventInput.price,
			date: new Date(args.eventInput.date),
			// hard-coded
			creator: "5d3bffca70e4a4638d17392c"
		})
		// events.push(event)
		let createdEvent;

		// return event.save()
		// 	.then(res => {
		// 		createdEvent = {
		// 			...res._doc,
		// 			creator: user.bind(this, res._doc.creator)
		// 		}
		// 		return User.findById('5d33c9392a8a962609cfe522')

		// 	})
		// 	.then(user => {
		// 		if (!user) {
		// 			throw new Error('User not found')
		// 		}
		// 		user.createdEvents.push(event);
		// 		return user.save();
		// 	})
		// 	.then(res => {
		// 		return createdEvent;
		// 	})
		// 	.catch(err => {
		// 		console.log(err)
		// 		throw err;
		// 	});


		// async/await
		try {
			const res = await event.save();
			createdEvent = transformEvent(res)
			const mUser = await User.findById('5d3bffca70e4a4638d17392c');
			if (!mUser) {
				throw new Error('User not found')
			}
			mUser.createdEvents.push(event);
			await mUser.save();

			return createdEvent;
		} catch (error) {
			throw error
		}

	},


}