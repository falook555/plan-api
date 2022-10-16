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

//------------------------------------------------------------------------------------------------------------------------------------ เริ่ม เกี่ยวกับ plan
exports.getPlanAll = (req, res, next) => {

    req.getConnection((err, connection) => {
        if (err) return console.log(err)
        try {
            let sql = `SELECT * FROM add_plan_head`;
            connection.query(sql, (err, row) => {
                if (err) return console.log(err)
                res.send(row)
            })
        } catch (error) {
            console.log(error)
        }
    })
}

exports.getPlanById = (req, res, next) => {

    req.getConnection((err, connection) => {
        if (err) return console.log(err)
        try {
            let sql = `SELECT * FROM add_plan_head WHERE id = '${req.params.id}'`
            connection.query(sql, (err, row) => {
                if (err) return console.log(err)
                res.send(row)
            })
        } catch (error) {
            console.log(error)
        }
    })
}


exports.insPlan = async (req, res, next) => {
    let { body } = req
    const date = moment().format('Y-M-D H:mm:ss')
    // console.log(body)
    let data = {
        'aph_ministry_strategy': body.ministry_strategy,
        'aph_policy': body.policy,
        'aph_kpi': body.kpi,
        'aph_strategy': body.strategy,
        'aph_result': body.result,
        'aph_project': body.project,
        'aph_total_budget': body.total_budget,
        'aph_period': body.period,
        'aph_responsible_agency': body.responsible_agency,
        'aph_insBy': body.insBy,
        'aph_insDt': date,
        'aph_status': 0,
    }

    req.getConnection((error, connection) => {
        if (error) throw error;
        connection.query(`
        INSERT INTO add_plan_head set ?`, data, function (error, results, fields) {
            if (error) throw error;
            connection.destroy();
            res.send({ 'status': 'success', 'result': results })
        });
    });
}


exports.updatePlan = async (req, res, next) => {
    let { body } = req
    const date = moment().format('Y-M-D H:mm:ss')
    // console.log(body)
    req.getConnection((error, connection) => {
        if (error) throw error;
        let sql = `UPDATE add_plan_head SET 
                        aph_ministry_strategy = '${body.ministry_strategy}',
                        aph_policy = '${body.policy}', 
                        aph_kpi = '${body.kpi}',   
                        aph_strategy = '${body.strategy}',   
                        aph_result = '${body.result}',
                        aph_project = '${body.project}',
                        aph_total_budget = '${body.total_budget}',
                        aph_period = '${body.period}',
                        aph_responsible_agency = '${body.responsible_agency}',
                        aph_upBy = '${body.upBy}', 
                        aph_upDt = '${date}' 
                        WHERE id = '${body.id}'`
        connection.query(sql, function (error, results, fields) {
            if (error) throw error;
            connection.destroy();
            res.send({ 'status': 'success', 'result': results })
        });
    });
}


exports.getActivityById = (req, res, next) => {

    req.getConnection((err, connection) => {
        if (err) return console.log(err)
        try {
            let sql = `SELECT * FROM add_activity WHERE id_head = '${req.params.id}'`
            connection.query(sql, (err, row) => {
                if (err) return console.log(err)
                res.send(row)
            })
        } catch (error) {
            console.log(error)
        }
    })
}

exports.getProjectSuccessIndicatorById = (req, res, next) => {

    req.getConnection((err, connection) => {
        if (err) return console.log(err)
        try {
            let sql = `SELECT * FROM add_project_success_indicator WHERE id_head = '${req.params.id}'`
            connection.query(sql, (err, row) => {
                if (err) return console.log(err)
                res.send(row)
            })
        } catch (error) {
            console.log(error)
        }
    })
}

exports.getTargetById = (req, res, next) => {

    req.getConnection((err, connection) => {
        if (err) return console.log(err)
        try {
            let sql = `SELECT * FROM add_target WHERE id_head = '${req.params.id}'`
            connection.query(sql, (err, row) => {
                if (err) return console.log(err)
                res.send(row)
            })
        } catch (error) {
            console.log(error)
        }
    })
}

exports.getBudgetSourceById = (req, res, next) => {

    req.getConnection((err, connection) => {
        if (err) return console.log(err)
        try {
            let sql = `SELECT * FROM add_budget_source WHERE id_head = '${req.params.id}'`
            connection.query(sql, (err, row) => {
                if (err) return console.log(err)
                res.send(row)
            })
        } catch (error) {
            console.log(error)
        }
    })
}

exports.getBudgetUsageDetailById = (req, res, next) => {

    req.getConnection((err, connection) => {
        if (err) return console.log(err)
        try {
            let sql = `SELECT * FROM add_budget_usage_detail WHERE id_head = '${req.params.id}'`
            connection.query(sql, (err, row) => {
                if (err) return console.log(err)
                res.send(row)
            })
        } catch (error) {
            console.log(error)
        }
    })
}
//------------------------------------------------------------------------------------------------------------------------------------ จบ เกี่ยวกับ plan