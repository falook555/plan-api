const moment = require('moment')
const fs = require('fs')
const md5 = require('md5')

//------------------------------------------------------------------------------------------------------------------------------------ เริ่ม เกี่ยวกับ USER

exports.getUserAll = (req, res, next) => {

    req.getConnection((err, connection) => {
        if (err) return console.log(err)
        try {
            let sql = `SELECT u.* , d.name AS nameDept 
            FROM user AS u
            INNER JOIN dept AS d 
            ON u.usr_dept = d.id
            ORDER BY usr_status DESC`;
            connection.query(sql, (err, row) => {
                if (err) return console.log(err)
                res.send(row)
            })
        } catch (error) {
            console.log(error)
        }
    })
}

exports.getUserByCid = (req, res, next) => {

    req.getConnection((err, connection) => {
        if (err) return console.log(err)
        try {
            let sql = `SELECT * FROM user WHERE usr_cid = '${req.params.cid}'`
            connection.query(sql, (err, row) => {
                if (err) return console.log(err)
                res.send(row)
            })
        } catch (error) {
            console.log(error)
        }
    })
}

exports.insUser = async (req, res, next) => {
    let { body } = req
    const date = moment().format('Y-M-D H:mm:ss')
    let passwordhint = md5(body.password)
    let private = 0

    if (body.status == 99) {
        private = 1
    }

    let data = {
        'usr_username': body.username,
        'usr_password': body.password,
        'usr_passwordhint': passwordhint,
        'usr_cid': body.cid,
        'usr_fullname': body.fullname,
        'usr_dept': body.dept,
        'usr_upBy': body.by,
        'usr_upDt': date,
        'usr_status': body.status,
        'usr_private': private
    }

    req.getConnection((error, connection) => {
        if (error) throw error;
        connection.query(`
        INSERT INTO user set ?`, data, function (error, results, fields) {
            if (error) throw error;
            connection.destroy();
            res.send({ 'status': 'success', 'result': results })
        });
    });
}

exports.updateUser = async (req, res, next) => {
    let { body } = req
    const date = moment().format('Y-M-D H:mm:ss')
    let passwordhint = md5(body.password)
    let private = 0

    if (body.status == 99) {
        private = 1
    }
    req.getConnection((error, connection) => {
        if (error) throw error;
        let sql = `UPDATE user SET 
        usr_username = '${body.username}',
                        usr_password = '${body.password}', 
                        usr_passwordhint = '${passwordhint}',   
                        usr_fullname = '${body.fullname}',   
                        usr_dept = '${body.dept}',
                        usr_status = '${body.status}',   
                        usr_private = '${private}', 
                        usr_upBy = '${body.by}', 
                        usr_upDt = '${date}' 
                        WHERE usr_cid = '${body.cid}'`
        connection.query(sql, function (error, results, fields) {
            if (error) throw error;
            connection.destroy();
            res.send({ 'status': 'success', 'result': results })
        });
    });
}

exports.editPasswordByPerson = async (req, res, next) => {
    let { body } = req
    let passwordhint = md5(body.newPassword)

    const date = moment().format('Y-M-D H:mm:ss')
    // console.log(body)
    req.getConnection((error, connection) => {
        if (error) throw error;
        let sql = `UPDATE user SET usr_password = '${body.newPassword}' , usr_passwordhint = '${passwordhint}' , usr_upBy = '${body.username}' , usr_upDt = '${date}' WHERE usr_cid = '${body.cid}'`
        connection.query(sql, function (error, results, fields) {
            if (error) throw error;
            connection.destroy();
            res.send({ 'status': 'success', 'result': results })
        });
    });
}

exports.updateStatusUser = async (req, res, next) => {
    let { body } = req
    let result = []
    const date = moment().format('Y-M-D H:mm:ss')
    // console.log(body)
    req.getConnection((error, connection) => {
        if (error) throw error;
        let sql = `UPDATE user SET usr_upBy = '${body.by}' , usr_upDt = '${date}' , usr_status = '${body.status}' WHERE usr_cid = '${body.cid}'`
        connection.query(sql, function (error, results, fields) {
            if (error) throw error;
            connection.destroy();
            res.send({ 'status': 'success', 'result': results })
        });
    });
}

exports.deleteUser = async (req, res, next) => {
    let { body } = req

    req.getConnection((error, connection) => {
        if (error) throw error;
        let sql = `DELETE FROM user WHERE usr_cid ='${body.cid}'`
        connection.query(sql, function (error, results, fields) {
            if (error) throw error;
            connection.destroy();
            res.send({ 'status': 'success', 'result': results })
        });
    });
}
//------------------------------------------------------------------------------------------------------------------------------------ จบ เกี่ยวกับ USER

//------------------------------------------------------------------------------------------------------------------------------------ เริ่ม เกี่ยวกับ Dept

exports.getDeptById = (req, res, next) => {

    req.getConnection((err, connection) => {
        if (err) return console.log(err)
        try {
            let sql = `SELECT * FROM dept WHERE id = '${req.params.id}'`
            connection.query(sql, (err, row) => {
                if (err) return console.log(err)
                res.send(row)
            })
        } catch (error) {
            console.log(error)
        }
    })
}

exports.getDeptAll = (req, res, next) => {

    req.getConnection((err, connection) => {
        if (err) return console.log(err)
        try {
            let sql = `SELECT * FROM dept ORDER BY name ASC`;
            connection.query(sql, (err, row) => {
                if (err) return console.log(err)
                res.send(row)
            })
        } catch (error) {
            console.log(error)
        }
    })
}

exports.insDept = async (req, res, next) => {
    let { body } = req

    let data = {
        'name': body.nameDept,
        'tel': body.telDept != '' ? body.telDept : null,
        'token': body.tokenGroupDept != '' ? body.tokenGroupDept : null
    }

    if (body.nameDept != '') {
        req.getConnection((error, connection) => {
            if (error) throw error;
            connection.query(`
                INSERT INTO dept set ?`, data, function (error, results, fields) {
                if (error) throw error;
                connection.destroy();
                res.send({ 'status': 'success', 'result': results })
            });
        });
    } else {
        res.send({ 'status': 'notFoundNameDept' })
    }
}

exports.updateDept = async (req, res, next) => {
    let { body } = req
    const date = moment().format('Y-M-D H:mm:ss')
    if (body.nameEdit != '') {
        req.getConnection((error, connection) => {
            if (error) throw error;
            let sql = `UPDATE dept SET name = '${body.nameEdit}' , tel = '${body.telEdit}' , token = '${body.tokenEdit}' WHERE id = '${body.id}'`
            connection.query(sql, function (error, results, fields) {
                if (error) throw error;
                connection.destroy();
                res.send({ 'status': 'success', 'result': results })
            });
        });
    } else {
        res.send({ 'status': 'notFoundNameDept' })
    }
}


exports.deleteDept = async (req, res, next) => {
    let { body } = req
    // console.log(body.id)
    req.getConnection((error, connection) => {
        if (error) throw error;
        let sql = `DELETE FROM dept WHERE id ='${body.id}'`
        connection.query(sql, function (error, results, fields) {
            if (error) throw error;
            connection.destroy();
            res.send({ 'status': 'success', 'result': results })
        });
    });
}
//------------------------------------------------------------------------------------------------------------------------------------ จบ เกี่ยวกับ Dept

//------------------------------------------------------------------------------------------------------------------------------------ เริ่ม เกี่ยวกับ Complain
exports.getComplainAll = (req, res, next) => {

    req.getConnection((err, connection) => {
        if (err) return console.log(err)
        try {
            let sql = `SELECT * FROM complain_head ORDER BY d_update DESC`
            connection.query(sql, (err, row) => {
                if (err) return console.log(err)
                res.send(row)
            })
        } catch (error) {
            console.log(error)
        }
    })
}

exports.getAdminComplainById = (req, res, next) => {

    req.getConnection((err, connection) => {
        if (err) return console.log(err)
        try {
            let sql = `SELECT * FROM complain_head WHERE id = '${req.params.id}'`
            connection.query(sql, (err, row) => {
                if (err) return console.log(err)
                res.send(row)
            })
        } catch (error) {
            console.log(error)
        }
    })
}



// dept_recieve complain_type ลบทิ้งแล้ว
exports.updateComplainReply = async (req, res, next) => {
    let { body } = req
    let result = []
    const date = moment().format('Y-M-D H:mm:ss')
    // console.log(IdDept)
    //change like
    // console.log(body)
    req.getConnection((error, connection) => {
        if (error) throw error;
        let sql = `UPDATE complain_head SET sub_like_text = '${body.like}', sub_change_text = '${body.change}', urgency_class = '${body.urgencyClass}', staff_upBy = '${body.username}', staff_upDt = '${date}' WHERE id = '${body.id}'`
        connection.query(sql, function (error, results, fields) {
            if (error) throw error;
            connection.destroy();
            res.send({ 'status': 'success', 'result': results })
        });
    });
}


exports.getComplainByIdDept = (req, res, next) => {
    //ต้องเขียนใหม่โดยการเอาตาราง head join detail แล้วนำมาแสดงผล
    req.getConnection((err, connection) => {
        if (err) return console.log(err)
        try {
            let sql = `SELECT
                            ch.sub_like_text as msg_like,
                            ch.sub_change_text as msg_change,
                            ch.urgency_class,
                            ch.staff_upDt,
                            cd.*,
                            ct.name as name_type,
                            ct.status as status_type
                        FROM complain_head ch
                        LEFT JOIN complain_detail cd ON ch.id = cd.complain_head_id
                        LEFT JOIN complain_type ct ON ct.id = cd.type_complain_id
                        WHERE cd.dept_id = '${req.params.id}'
                        AND ch.staff_upBy IS NOT NULL
                        AND ch.staff_upDt IS NOT NULL
                        ORDER BY ch.urgency_class`
            connection.query(sql, (err, row) => {
                if (err) return console.log(err)
                res.send(row)
            })
        } catch (error) {
            console.log(error)
        }
    })
}

// testa asdsadasdsad sad
exports.getComplainBoardsAll = (req, res, next) => {
    req.getConnection((err, connection) => {
        if (err) return console.log(err)
        try {
            let sql = `SELECT 
            ch.user_id,
            ch.sub_like_text as msg_like,
            ch.sub_change_text as msg_change,
            ch.urgency_class,
            cd.*,
            ct.name as name_type,
            ct.status as status_type,
            d.name as nameDept
            FROM complain_head ch
            LEFT JOIN complain_detail cd ON ch.id = cd.complain_head_id
            LEFT JOIN complain_type ct ON ct.id = cd.type_complain_id
            LEFT JOIN dept d ON d.id = cd.dept_id
            WHERE 
            ch.staff_upBy IS NOT NULL
            AND ch.staff_upDt IS NOT NULL
            AND cd.dept_comment IS NOT NULL
            AND cd.dept_upBy IS NOT NULL
            AND cd.dept_upDt IS NOT NULL
            ORDER BY ch.urgency_class ASC`;
            connection.query(sql, (err, row) => {
                if (err) return console.log(err)
                res.send(row)
            })
        } catch (error) {
            console.log(error)
        }
    })
}

//------------------------------------------------------------------------------------------------------------------------------------ START NOTIFY ALERT BACKEND
//------------------------------------------------------------------------------------------------------------------------------------ เริ่ม เกี่ยวกับ ComplainNumberNoti
exports.complainNumberNoti = (req, res, next) => {

    req.getConnection((err, connection) => {
        if (err) return console.log(err)
        try {
            let sql = `SELECT COUNT(id) as numberComplain
            FROM complain_head
            WHERE staff_upBy IS NULL
            AND staff_upDt IS NULL
            `
            connection.query(sql, (err, row) => {
                if (err) return console.log(err)
                res.send(row)
            })
        } catch (error) {
            console.log(error)
        }
    })
}
//------------------------------------------------------------------------------------------------------------------------------------ จบ เกี่ยวกับ ComplainNumberNoti
//------------------------------------------------------------------------------------------------------------------------------------ END NOTIFY ALERT BACKEND
//------------------------------------------------------------------------------------------------------------------------------------ จบ เกี่ยวกับ Complain





//------------------------------------------------------------------------------------------------------------------------------------ เริ่ม เกี่ยวกับ Complain_Detail

exports.updateBackwardBoardReply = async (req, res, next) => {
    let { body } = req
    const date = moment().format('Y-M-D H:mm:ss')
    // console.log(body)
    req.getConnection((error, connection) => {
        if (error) throw error;
        let sql = `UPDATE complain_detail SET board_comment = NULL, board_upBy = NULL, board_upDt = NULL WHERE id = '${body.id}'`
        connection.query(sql, function (error, results, fields) {
            if (error) throw error;
            connection.destroy();
            res.send({ 'status': 'success', 'result': results })
        });
    });
}


exports.updateBackwardDeptReply = async (req, res, next) => {
    let { body } = req
    const date = moment().format('Y-M-D H:mm:ss')
    // console.log(body)
    req.getConnection((error, connection) => {
        if (error) throw error;
        let sql = `UPDATE complain_detail SET dept_comment = NULL, dept_upBy = NULL, dept_upDt = NULL WHERE id = '${body.id}'`
        connection.query(sql, function (error, results, fields) {
            if (error) throw error;
            connection.destroy();
            res.send({ 'status': 'success', 'result': results })
        });
    });
}

exports.updateComplainReportDeptReply = async (req, res, next) => {
    let { body } = req
    const date = moment().format('Y-M-D H:mm:ss')
    // console.log(body)
    req.getConnection((error, connection) => {
        if (error) throw error;
        let sql = `UPDATE complain_detail SET dept_comment='${body.report}', dept_upBy = '${body.username}', dept_upDt = '${date}' WHERE id = '${body.id}'`
        connection.query(sql, function (error, results, fields) {
            if (error) throw error;
            connection.destroy();
            res.send({ 'status': 'success', 'result': results })
        });
    });
}

exports.getCommentDeptById = (req, res, next) => {

    req.getConnection((err, connection) => {
        if (err) return console.log(err)
        try {
            let sql = `SELECT cd.*, 
                ch.sub_like_text, 
                ch.sub_change_text, 
                ch.urgency_class,
                ch.attack_file,
                ct.name as nameType
            FROM complain_detail cd 
            LEFT JOIN complain_head ch ON cd.complain_head_id = ch.id
            LEFT JOIN complain_type ct ON cd.type_complain_id =  ct.id 
            WHERE cd.id ='${req.params.id}'`
            connection.query(sql, (err, row) => {
                if (err) return console.log(err)
                res.send(row)
            })
        } catch (error) {
            console.log(error)
        }
    })
}

exports.getComplainDetailById = (req, res, next) => {

    req.getConnection((err, connection) => {
        if (err) return console.log(err)
        try {
            let sql = `SELECT cd.id as id, d.name as nameDept, ct.name as nameType 
            FROM complain_detail cd
            LEFT JOIN dept d ON d.id = cd.dept_id
            LEFT JOIN complain_type ct ON ct.id = cd.type_complain_id
            WHERE complain_head_id = '${req.params.id}'
            ORDER BY id DESC`
            connection.query(sql, (err, row) => {
                if (err) return console.log(err)
                res.send(row)
            })
        } catch (error) {
            console.log(error)
        }
    })
}

exports.updateComplainDetail = async (req, res, next) => {

    let { body } = req

    let data = {
        'complain_head_id': body.id,
        'dept_id': body.todept,
        'type_complain_id': body.type
    }
    // console.log(data)
    req.getConnection((error, connection) => {
        if (error) throw error;
        connection.query(`
                INSERT INTO complain_detail set ?`, data, function (error, results, fields) {
            if (error) throw error;
            connection.destroy();
            res.send({ 'status': 'success', 'result': results })
        });
    });
}

exports.updateComplainBoardReply = async (req, res, next) => {
    let { body } = req
    const date = moment().format('Y-M-D H:mm:ss')
    // console.log(body)
    req.getConnection((error, connection) => {
        if (error) throw error;
        let sql = `UPDATE complain_detail SET board_upBy = '${body.username}', board_comment ='${body.boradComment}', board_upDt = '${date}' WHERE id = '${body.id}'`
        connection.query(sql, function (error, results, fields) {
            if (error) throw error;
            connection.destroy();
            res.send({ 'status': 'success', 'result': results })
        });
    });
}

exports.deleteDetail = async (req, res, next) => {
    let { body } = req

    req.getConnection((error, connection) => {
        if (error) throw error;
        let sql = `DELETE FROM complain_detail WHERE id ='${body.id}'`
        connection.query(sql, function (error, results, fields) {
            if (error) throw error;
            connection.destroy();
            res.send({ 'status': 'success', 'result': results })
        });
    });
}



//------------------------------------------------------------------------------------------------------------------------------------ START NOTIFY ALERT BACKEND
//------------------------------------------------------------------------------------------------------------------------------------ เริ่ม เกี่ยวกับ DetailDeptNumberNoti
exports.DetailDeptNumberNoti = (req, res, next) => {
    req.getConnection((err, connection) => {
        if (err) return console.log(err)
        try {
            let sql = `SELECT COUNT(cd.id) as numberDept
            FROM complain_head ch
            LEFT JOIN complain_detail cd ON cd.complain_head_id = ch.id
            WHERE cd.dept_id = '${req.params.id}'
            AND cd.dept_comment IS NULL
            AND cd.dept_upBy IS NULL
            AND cd.dept_upDt IS NULL`
            connection.query(sql, (err, row) => {
                if (err) return console.log(err)
                res.send(row)
            })
        } catch (error) {
            console.log(error)
        }
    })
}
//------------------------------------------------------------------------------------------------------------------------------------ จบ เกี่ยวกับ DetailDeptNumberNoti

//------------------------------------------------------------------------------------------------------------------------------------ เริ่ม เกี่ยวกับ DetailBoardNumberNoti
exports.DetailBoardNumberNoti = (req, res, next) => {

    req.getConnection((err, connection) => {
        if (err) return console.log(err)
        try {
            let sql = `SELECT COUNT(cd.id) as numberBoard
            FROM complain_head ch
            LEFT JOIN complain_detail cd ON cd.complain_head_id = ch.id
            WHERE cd.dept_comment IS NOT NULL
            AND cd.board_upBy IS NULL
            AND cd.board_upDt IS NULL`
            connection.query(sql, (err, row) => {
                if (err) return console.log(err)
                res.send(row)
            })
        } catch (error) {
            console.log(error)
        }
    })
}
//------------------------------------------------------------------------------------------------------------------------------------ จบ เกี่ยวกับ DetailBoardNumberNoti
//------------------------------------------------------------------------------------------------------------------------------------ END NOTIFY ALERT BACKEND
//------------------------------------------------------------------------------------------------------------------------------------ จบ เกี่ยวกับ Complain_Detail


//------------------------------------------------------------------------------------------------------------------------------------ เริ่ม เกี่ยวกับ Questions
exports.getQuestionsAll = (req, res, next) => {

    req.getConnection((err, connection) => {
        if (err) return console.log(err)
        try {
            let sql = `SELECT * FROM questions`
            connection.query(sql, (err, row) => {
                if (err) return console.log(err)
                res.send(row)
            })
        } catch (error) {
            console.log(error)
        }
    })
}

exports.insQuestion = async (req, res, next) => {
    let { body } = req
    const date = moment().format('Y-M-D H:mm:ss')

    // console.log(body)
    let data = {
        'qa_question': body.q,
        'qa_answer': body.a,
        'qa_insBy': body.username,
        'qa_insDt': date
    }

    req.getConnection((error, connection) => {
        if (error) throw error;
        connection.query(`INSERT INTO questions set ?`, data, function (error, results, fields) {
            if (error) throw error;
            connection.destroy();
            res.send({ 'status': 'success', 'result': results })
        });
    });
}

exports.deleteQuestion = async (req, res, next) => {
    let { body } = req
    // console.log(body)
    req.getConnection((error, connection) => {
        if (error) throw error;
        let sql = `DELETE FROM questions WHERE qa_id ='${body.id}'`
        connection.query(sql, function (error, results, fields) {
            if (error) throw error;
            connection.destroy();
            res.send({ 'status': 'success', 'result': results })
        });
    });
}
//------------------------------------------------------------------------------------------------------------------------------------ จบ เกี่ยวกับ Questions

//------------------------------------------------------------------------------------------------------------------------------------ เริ่ม เกี่ยวกับ Complain Type
exports.getComplainTypeAll = (req, res, next) => {

    req.getConnection((err, connection) => {
        if (err) return console.log(err)
        try {
            let sql = `SELECT * FROM complain_type`
            connection.query(sql, (err, row) => {
                if (err) return console.log(err)
                res.send(row)
            })
        } catch (error) {
            console.log(error)
        }
    })
}
//------------------------------------------------------------------------------------------------------------------------------------ จบ เกี่ยวกับ Complain Type