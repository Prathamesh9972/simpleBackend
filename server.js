const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello From Serve 3001 we will rock you! Heyy didd you know running on port 3001'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))