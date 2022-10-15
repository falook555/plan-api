

const passport = require('passport')
const passportService = require('./service/passport')
const requireSignin = passport.authenticate('local', { session: false })
const requireAuth = passport.authenticate('jwt', { session: false })
const users = require('./controllers/Users')
const center = require('./controllers/Center')

module.exports = function (app) {

    app.get('/', function (req, res) {
        res.send("<h1 style='text-align:center;margin-top:150px; '>^^ API PLAN CENTER ^^</h1>")
    })
    // เกี่ยวกับ Login
    app.post('/signin', requireSignin, users.signin)
    // pull

    //------------------------------------- backend Konthorn Thonsap ----------------------------------
    // เกี่ยวกับ USER
    app.post('/add-user', requireAuth, center.insUser)
    app.post('/update-user', requireAuth, center.updateUser)
    app.post('/update-status-user', requireAuth, center.updateStatusUser)
    app.post('/edit-password-by-person', requireAuth, center.editPasswordByPerson)
    app.post('/delete-user', requireAuth, center.deleteUser)

    app.get('/get-user-all', requireAuth, center.getUserAll)
    app.get('/get-user/:cid', requireAuth, center.getUserByCid)

    // เกี่ยวกับ Dept
    app.post('/add-dept', requireAuth, center.insDept)
    app.post('/update-dept', requireAuth, center.updateDept)
    app.post('/delete-dept', requireAuth, center.deleteDept)

    app.get('/get-dept-by-id/:id', requireAuth, center.getDeptById)
    app.get('/get-dept-all', requireAuth, center.getDeptAll)

    //------------------------------------- backend Konthorn Thonsap ----------------------------------


}