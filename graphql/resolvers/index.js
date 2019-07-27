const bcrypt = require('bcrypt');

const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');

const { dateToString } = require('../../helpers/date');

const transformEvent = event => {
	return {
		...event._doc,
		date: dateToString(event._doc.date),
		creator: user.bind(this, event.creator)
	}
}

const transformBooking = booking => {
	return {
		...booking._doc,
		_id: booking.id,
		user: user.bind(this, booking._doc.user),
		event: singleEvent.bind(this, booking._doc.event),
		createdAt: dateToString(booking._doc.createdAt),
		updatedAt: dateToString(booking._doc.updatedAt)

	}
}


// Manually fetching events (promise)
// const events = eventIds => {
// 	return Event.find({
// 			_id: {
// 				$in: eventIds
// 			}
// 		})
// 		.then(events => {
// 			return events.map(event => {
// 				return {
// 					...event._doc,
// 					date: new Date(event._doc.date).toISOString(),
// 					creator: user.bind(this, event.creator)
// 				}
// 			})
// 		})
// 		.catch(err => {
// 			throw err
// 		})
// }

// Manually fetching events (async/await)
const events = async eventIds => {
	try {
		const events = await Event.find({
			_id: {
				$in: eventIds
			}
		})
		return events.map(event => {
			return transformEvent(event)
		})
	} catch (error) {
		throw error
	}

}

const singleEvent = async eventId => {
	try {
		const mEvent = await Event.findById(eventId);
		return transformEvent(mEvent)
	} catch (error) {
		throw error
	}
}

// Alternative to using populate(promise)
// const user = userId => {
// 	return User.findById(userId)
// 		.then(user => {
// 			return {
// 				...user._doc,
// 				createdEvents: events.bind(this, user._doc.createdEvents)
// 			}
// 		})
// 		.catch(err => {
// 			throw err
// 		})
// }

// Alternative to using populate(async/await)
const user = async userId => {
	try {
		const user = await User.findById(userId)
		return {
			...user._doc,
			createdEvents: events.bind(this, user._doc.createdEvents)
		}
	} catch (error) {
		throw error
	}

}

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
	createEvent: async args => {
		// const event = {
		// 	_id: Math.random().toString(),
		// 	title: args.eventInput.title,
		// 	description: args.eventInput.description,
		// 	price: +args.eventInput.price,
		// 	date: args.eventInput.date
		// }
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

	bookings: async () => {
		try {
			const bookings = await Booking.find();
			return bookings.map(booking => {
				return transformBooking(booking)
			})
		} catch (error) {
			throw error
		}
	},

	createUser: async args => {
		// return User.findOne({
		// 		email: args.userInput.email
		// 	})
		// 	.then(user => {
		// 		console.log(user)
		// 		if (user) {
		// 			throw new Error('User already exists')
		// 		}
		// 		return bcrypt.hash(args.userInput.password, 12)
		// 	})
		// 	.then(hashedPassword => {
		// 		const user = new User({
		// 			email: args.userInput.email,
		// 			password: hashedPassword
		// 		});
		// 		return user.save();
		// 	})
		// 	.then(res => {
		// 		return {
		// 			...res._doc,
		// 			password: null
		// 		}
		// 	})
		// 	.catch(err => {
		// 		console.log(err)
		// 		throw err
		// 	})

		try {
			const existingUser = await User.findOne({
				email: args.userInput.email
			})

			if (existingUser) {
				throw new Error('User already exists')
			}
			const hashedPassword = await bcrypt.hash(args.userInput.password, 12)

			const user = new User({
				email: args.userInput.email,
				password: hashedPassword
			});
			const res = await user.save();

			return {
				...res._doc,
				password: null
			}
		} catch (error) {
			throw error
		}

	},

	bookEvent: async args => {
		const fetchedEvent = await Event.findOne({
			_id: args.eventId
		})
		const booking = new Booking({
			user: "5d3bffca70e4a4638d17392c",
			event: fetchedEvent
		});

		const result = await booking.save();
		return transformBooking(result)
	},

	cancelBooking: async args => {
		try {
			const booking = await Booking.findById(args.bookingId).populate('event');
			const event = transformEvent(booking.event)
			await Booking.deleteOne({_id: args.bookingId});
			return event
		} catch (error) {
			
		}
	}


}