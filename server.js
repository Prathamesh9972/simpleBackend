const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()


const app = express()
const port = process.env.PORT || 3001

app.use((req, res, next) => {
  console.log(`${req.method} request for ${req.url}`);
  next(); 
});




app.get('/error', (req, res, next) => {
    const err = new Error('Something went wrong!');
    err.status = 500;
    next(err);
})


app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(err.status || 500).send({
        message: err.message || 'Internal Server Error',
        status: err.status || 500
    });
}





)

app.use(express.json())
const mongoUri = process.env.MONGO_URI

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error(
    'Could not connect to MongoDB', err
  ));


app.get('/get-example', (req, res) => {
    res.send('This is a GET request')
})

app.post('/post-example', (req, res) => {
    res.send('This is a POST request') // You can access POST data via req.body
})

app.put('/put-request', (req, res) => {
    res.send('This is a PUT request') // You can access PUT data via req.body
})

app.delete('/delete-request', (req, res) => {
    res.send('This is Delete Request') // You can access DELETE data via req.body
})

app.all('/all-request', (req, res) => {
    res.send(`This handle all HTTP methods, ${req.method}`)
})

app.get('/user/:id', (req, res) => {
    const userId = req.params.id
    res.send(`User Id is : ${userId}`)
})

app.get('/search', (req, res) => {
    const searchTerm = req.query.q
    res.send(`Search term is : ${searchTerm}`)
})


app.post('/userData', (req, res) => {
    const { name, age} = req.body
    res.send(`User Name is : ${name}, Age is : ${age}`)
})


const today = new Date()
const formattedDate = today.toLocaleDateString('en-GB');
app.get('/status', (req,res) => res.json({status: 'ok', date: formattedDate}))

app.get('/', (req, res) => res.send('Hello From Serve 3001'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
