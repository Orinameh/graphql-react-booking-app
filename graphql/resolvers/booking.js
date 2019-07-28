const Booking = require('../../models/booking');
const Event = require('../../models/event');
const {
	transformBooking,
	transformEvent
} = require('./merge');




module.exports = {

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
			await Booking.deleteOne({
				_id: args.bookingId
			});
			return event
		} catch (error) {

		}
	}

}