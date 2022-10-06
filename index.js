const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const myConnection = require('express-myconnection')
const http = require('http')
const socketIO = require('socket.io')
const moment = require('moment')
const errorHandler = require('./middleware/errorHandler')

const config = require('./config')
const routes = require('./routes')
const e = require('express')


const PORT = 4059
const strQrcode = '';


// our server instance
const server = http.createServer(app)

// This creates our socket using the instance of the server
const io = require('socket.io')(server)

app.use(bodyParser.json({ limit: '10mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ type: '*/*' }))

app.use(myConnection(mysql, config.dbOption, 'pool'))
routes(app)

const con = mysql.createConnection(
    config.dbOption
)

con.connect(function (err) {
    if (err) throw err
    const connectt = con.query
    if (!connectt.length)
        throw new Errors.InternalServerError('country not found');


})


// socket io
// io.on('connection', function (client) {
//     console.log('Connected...', client.id);

//     //listens for new messages coming in
//     client.on('message', function name(data) {
//         console.log(data.user_id);
//         if (data.type != 'admin') {
//             io.emit('message_admin', data.user_id);
//             console.log('client');

//         } else {
//             io.emit(data.user_id, data.user_id);
//             console.log('admin');

//         }
//         console.log('emit');

//     })

//     //------------------------------------------------------------------------------ Backend socket Konthorn
//     client.on('complain', function name(data) {
//         io.emit('notifyNumberComplain');
//     })

//     client.on('adminsent', function name(data) {
//         io.emit('notifyNumberAdminSent');
//     })

//     client.on('dept', function name(data) {
//         io.emit('notifyNumberDept');
//     })

//     client.on('board', function name(data) {
//         io.emit('notifyNumberBoard');
//     })
//     //------------------------------------------------------------------------------ Backend socket Konthorn



//     // bid 
//     //   client.on('bid', async function name(data) {
//     //     // console.log('bid');

//     //     result = await db.query(`UPDATE post_bid SET price_current=${data.price},user_bid_last='${data.user_bid}' WHERE id = ${data.id} `)
//     //     result = await db.query(`INSERT INTO history_bid  (post_id,user_bid,price_bid,d_update) VALUES ('${data.id}','${data.user_bid}',${data.price},CURRENT_TIMESTAMP)`)
//     //     io.emit(data.id, data);
//     //     io.emit('bid');
//     //   })



//     //listens when a user is disconnected from the server
//     client.on('disconnect', function () {
//         console.log('Disconnected...', client.id);
//     })

//     //listens when there's an error detected and logs the error on the console
//     client.on('error', function (err) {
//         console.log('Error detected', client.id);
//         console.log(err);
//     })
// })
// end socket io





app.use(express.static('image'));
app.use(errorHandler)


server.listen(PORT, () => {
    console.log(`start port : ${PORT}`)
})