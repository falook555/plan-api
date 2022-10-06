const passport = require('passport');
const LocalStrategy = require('passport-local')
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt
const md5 = require('md5');
const config = require('../config')

const localOptions = { passReqToCallback: true }

const localLogin = new LocalStrategy(localOptions, function (req, username, password, done) {
    let { body } = req
    // console.log(body)

    req.getConnection((err, connection) => {
        if (err) return console.log(err)
        connection.query(`SELECT * FROM user WHERE usr_username = '${body.username}'`, (err, row) => {
            // console.log(row)
            // console.log(row[0])
            if (err) return console.log(err)
            if (!row.length) return done(new Error('userError'))
            if (row[0].usr_passwordhint !== md5(password)) return done(new Error('passError'))
            if (row[0].usr_status == '0') return done(new Error('statusError'))
            return done(null, row[0])
        })
    })
})

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('token'),
    secretOrKey: config.secret,
    passReqToCallback: true
};

const jwtRoute = new JwtStrategy(jwtOptions, function (req, payload, done) {
    req.getConnection((err, connection) => {
        // console.log(payload)
        if (err) return console.log(err)
        connection.query(`SELECT * FROM user WHERE usr_username = '${payload.username}'`, (err, row) => {
            if (err) return console.log(err)
            if (!row.length) return done(null, false);
            return done(null, row[0])
        })
    })
})
passport.use(localLogin)
passport.use(jwtRoute)