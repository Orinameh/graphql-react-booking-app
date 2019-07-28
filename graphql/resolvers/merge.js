const Event = require('../../models/event');
const User = require('../../models/user');
const { dateToString } = require('../../helpers/date');




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

exports.transformBooking = transformBooking;
exports.transformEvent = transformEvent;