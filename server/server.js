// Budget API

const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

/* const budget = {
    myBudget: [
        {
            title: 'Eat out',
            budget: 25
        },
        {
            title: 'Rent',
            budget: 275
        },
        {
            title: 'Grocery',
            budget: 110
        },
    ]
}; */

//app.use('/', express.static('public'));

/* app.get('/hello', (req, res) => {
    res.send('Hello World!');
}); */

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/budget', (req, res) => {
    const budget = require('./budget-data.json');

    res.json(budget);
});

app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`);
});