const express = require('express');
const config = require('config')
const mongoose = require('mongoose')

const app = express();

app.use(express.json({ extended: true }))

const PORT = config.get('port') || 5000
const URI = config.get('URI')

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/students', require('./routes/students.routes'))
app.use('/api/tests', require('./routes/tests.routes'))
// app.use('/tests', require('./routes/tests.routes'))
app.use('/api/addtest', require('./routes/addtest.routes'))
app.use('/api/results', require('./routes/results.routes'))
app.use('/api/users', require('./routes/users.routes'))

async function start() {
    try {
        await mongoose.connect(URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
    }
    catch (e) {
        console.log('Error', e.message)
        process.exit(1)
    }
}

start()
