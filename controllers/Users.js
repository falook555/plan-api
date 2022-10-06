const jwt = require('jwt-simple')
const config = require('../config')
//var time = require('time');

function tokenForUser(user) {
    // console.log(user)
    const timestamp = new Date().getTime()
    return jwt.encode({
        username: user.usr_username,
        fullname: user.usr_fullname,
        cid: user.usr_cid,
        dept: user.usr_dept,
        image: user.usr_img,
        status: user.usr_status,
        private: user.usr_private

    },
        config.secret
    )
}

exports.signin = (req, res, next) => {
    res.send({ token: tokenForUser(req.user) })
}
