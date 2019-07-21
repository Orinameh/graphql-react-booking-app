const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql'); //middleware that helps map to qraphql query
const {
	buildSchema
} = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Event = require('./models/event');
const User = require('./models/user');

const port = 3000;
const app = express();

app.use(bodyParser.json());

// const events = []

//Single endpoint
app.use('/graphql', graphqlHttp({
	schema: buildSchema(`
			type Event {
				_id: ID!
				title: String!
				description: String!
				price: Float!
				date: String!
			}

			
			input EventInput {
				title: String!
				description: String!
				price: Float!
				date: String!
			}

			type User {
				_id: ID!
				email: String!
				password: String
			}

			input UserInput {
				email: String!
				password: String!
			}

			type RootQuery {
				events: [Event!]!
			}

			type RootMutation {
				createEvent(eventInput: EventInput): Event
				createUser(userInput: UserInput): User
			}

			schema {
				query: RootQuery
				mutation: RootMutation
			}

		`),
	// resolvers where logic is done
	rootValue: {
		events: () => {
			return Event.find()
			.then(res => {
				return res.map(event => {
					return {...event._doc}
				})
			}).catch(err => {
				throw err;
			});
		},
		createEvent: (args) => {
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
				creator: "5d33c9392a8a962609cfe522"
			})
			// events.push(event)
			return event.save()
			.then(res => {
				console.log(res)
				return {...res._doc}
			})
			.catch(err => {
				console.log(err)
				throw err;
			});
			// return event
		},

		createUser: args => {
			return User.findOne({ email: args.userInput.email})
			.then(user => {
				console.log(user)
				if(user) {
					throw new Error('User already exists')
				}
				return bcrypt.hash(args.userInput.password, 12)
			})
			.then(hashedPassword => {
				const user = new User({
					email: args.userInput.email,
					password: hashedPassword
				});
				return user.save();
			})
			.then(res => {
				return {...res._doc, password: null}
			})
			.catch(err => {
				console.log(err)
				throw err
			})
			
		}
	},
	graphiql: true
}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-qgbov.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
	.then(() => {
		app.listen(port, () => {
			console.log(`Server started on port ${port}`);
		});
	})
	.catch(err => {
		console.log("err", err)
	})
