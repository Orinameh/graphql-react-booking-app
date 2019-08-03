const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');




module.exports = {
	createUser: async (args) => {
		console.log(User)
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
			const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

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
			console.log("err", error)
			throw error
		}

	},

	login: async ({
		email,
		password
	}) => {

		const user = await User.findOne({
			email: email
		});

		console.log(user)

		if (!user) {
			//it is better not to give hint in error msgs, use incorrect email or password
			throw new Error('User does not exist');
		}

		const isEqual = await bcrypt.compare(password, user.password);

		if (!isEqual) {
			throw new Error('Password is incorrect');
		}

		const token = await jwt.sign({
			userId: user.id,
			email: user.email
		}, 'somesupersecretkey', {
			expiresIn: '1h'
		});

		return {
			userId: user.id,
			token: token,
			tokenExpiration: 1
		}

	}


}