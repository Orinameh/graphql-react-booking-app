const bcrypt = require('bcrypt');
const User = require('../../models/user');




module.exports = {

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


}