const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql'); //middleware that helps map to qraphql query

const mongoose = require('mongoose');

const graphQLSchema = require('./graphql/schema');
const graphQLResolvers = require('./graphql/resolvers');

const isAuth = require('./middleware/auth');


const port = 3000;
const app = express();

app.use(bodyParser.json());

app.use(isAuth);

// const events = []

//Single endpoint
app.use('/graphql', graphqlHttp({
	schema: graphQLSchema,
	// resolvers where logic is done
	rootValue: graphQLResolvers,
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