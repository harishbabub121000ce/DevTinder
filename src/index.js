import express from 'express';

const app = express();

//create routes

app.use('/user', (req, res) => {
    console.log('Inside user route request handler');
    res.status(200).send({
        firstName: 'Harish Babu',
        middleName: null,
        lastName: 'Nimmagadda'
    });
});

app.use("/", (req, res) => {
    console.log('Inside the default route handler');
    res.status(201).send('Welcome to the home page');
});

// start the server
app.listen('7777',() => {
    console.log('server successfully running on port 7777');
});