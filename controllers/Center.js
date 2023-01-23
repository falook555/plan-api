const moment = require('moment')
const fs = require('fs')
const md5 = require('md5')

const mysql = require("mysql");
const config = require("../config");
const con = mysql.createConnection(config.dbOption);
const { makeDb } = require('mysql-async-simple');

const db = makeDb();
db.connect(con);
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
            let sql = `SELECT h.*,e.name as exc4,i.name as indicator,p.name project,p1.name as plan1, p2.name as plan2
            FROM add_plan_head h
            LEFT JOIN select_4exc e ON e.id = aph_ministry_strategy
            LEFT JOIN select_indicator i ON i.id = h.aph_kpi 
            LEFT JOIN select_project p ON p.id = aph_project
            LEFT JOIN select_plan  p1 ON p1.id = aph_strategy
            LEFT JOIN select_plan  p2 ON p2.id = aph_policy   `;
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
            let sql = `SELECT h.*,e.name as exc4,i.name as indicator,p.name project,p1.name as plan1, p2.name as plan2,e.type_name
            FROM add_plan_head h
            LEFT JOIN select_4exc e ON e.id = aph_ministry_strategy
            LEFT JOIN select_indicator i ON i.id = h.aph_kpi 
            LEFT JOIN select_project p ON p.id = aph_project
            LEFT JOIN select_plan  p1 ON p1.id = aph_strategy
            LEFT JOIN select_plan  p2 ON p2.id = aph_policy  WHERE h.id = '${req.params.id}'`
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

exports.deletePlanHead = async (req, res, next) => {
    let { body } = req
    // console.log(body)
    req.getConnection((error, connection) => {
        if (error) throw error;
        let sql = `DELETE FROM add_plan_head WHERE id ='${body.id}'`
        connection.query(sql, function (error, results, fields) {
            if (error) throw error;
            connection.destroy();
            res.send({ 'status': 'success', 'result': results, 'idHead': body.id_head })
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

exports.updateStatusPlan = async (req, res, next) => {
    let { body } = req
    const date = moment().format('Y-M-D H:mm:ss')
    const current_year = moment(moment().format("YYYY")).add(543, 'year').format('Y')
    const sub_current_year = current_year.substring(2, 4)
    const intYear = parseInt(sub_current_year)
    // console.log(body)
    req.getConnection((error, connection) => {
        if (error) throw error;
        let sql = `UPDATE add_plan_head SET 
                        aph_status = '${body.status}',
                        aph_upBy = '${body.username}', 
                        aph_upDt = '${date}' 
                        WHERE id = '${body.id}'`
        connection.query(sql, function (error, results, fields) {
            if (error) throw error;
            genNO()
            connection.destroy();
            res.send({ 'status': 'success', 'result': results })
        });

        //     //gen รหัสโครงการ
        async function genNO() {
            if (body.status == 1 && body.no == null) {
                let plan_code = 'H2' + body.type_name + intYear
                let tno = ''

                const resNo = await db.query(con, `SELECT  LPAD(max(aph_no ) +1,3,'0') AS tno FROM add_plan_head `);
                console.log(resNo[0].tno)
                if (resNo[0].tno == null) {
                    tno = '001'
                } else {
                    tno = resNo[0].tno
                }

                plan_code = plan_code + tno

                const resUpdateno = await db.query(con, `UPDATE add_plan_head set  aph_plan_id = '${plan_code}',aph_no ='${tno}'  WHERE id ='${body.id}'  `);
                console.log(plan_code)


            }
        }


        //     //end gen รหัสโครงการ



    });




}

exports.approveStatusPlan = async (req, res, next) => {
    let { body } = req
    const date = moment().format('Y-M-D H:mm:ss')
    // console.log(body)
    let data = {
        'id_head': body.id,
        'apv_note': body.note,
        'apv_upBy': body.username,
        'apv_upDt': date,
        'apv_status': body.status,
    }

    req.getConnection((error, connection) => {
        if (error) throw error;
        connection.query(`
        INSERT INTO approve_detail set ?`, data, function (error, results, fields) {
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

exports.insActivity = async (req, res, next) => {
    let { body } = req
    const date = moment().format('Y-M-D H:mm:ss')
    let data = {
        'id_head': body.id_head,
        'dt_activity': body.detail
    }
    // console.log(data)

    req.getConnection((error, connection) => {
        if (error) throw error;
        connection.query(`
        INSERT INTO add_activity set ?`, data, function (error, results, fields) {
            if (error) throw error;
            connection.destroy();
            res.send({ 'status': 'success', 'result': results, 'idHead': body.id_head })
        });
    });
}

exports.insPSI = async (req, res, next) => {
    let { body } = req
    const date = moment().format('Y-M-D H:mm:ss')
    let data = {
        'id_head': body.id_head,
        'dt_project_success_indicator': body.detail
    }
    // console.log(data)

    req.getConnection((error, connection) => {
        if (error) throw error;
        connection.query(`
        INSERT INTO add_project_success_indicator set ?`, data, function (error, results, fields) {
            if (error) throw error;
            connection.destroy();
            res.send({ 'status': 'success', 'result': results, 'idHead': body.id_head })
        });
    });
}

exports.insTarget = async (req, res, next) => {
    let { body } = req
    const date = moment().format('Y-M-D H:mm:ss')
    let data = {
        'id_head': body.id_head,
        'dt_target': body.detail
    }
    // console.log(data)

    req.getConnection((error, connection) => {
        if (error) throw error;
        connection.query(`
        INSERT INTO add_target set ?`, data, function (error, results, fields) {
            if (error) throw error;
            connection.destroy();
            res.send({ 'status': 'success', 'result': results, 'idHead': body.id_head })
        });
    });
}

exports.insBS = async (req, res, next) => {
    let { body } = req
    const date = moment().format('Y-M-D H:mm:ss')
    let data = {
        'id_head': body.id_head,
        'dt_budget_source': body.detail
    }
    // console.log(data)

    req.getConnection((error, connection) => {
        if (error) throw error;
        connection.query(`
        INSERT INTO add_budget_source set ?`, data, function (error, results, fields) {
            if (error) throw error;
            connection.destroy();
            res.send({ 'status': 'success', 'result': results, 'idHead': body.id_head })
        });
    });
}

exports.insBUD = async (req, res, next) => {
    let { body } = req
    const date = moment().format('Y-M-D H:mm:ss')
    let data = {
        'id_head': body.id_head,
        'dt_budget_usage_detail': body.detail,
        'dt_budget_usage_price': body.price
    }
    // console.log(data)

    req.getConnection((error, connection) => {
        if (error) throw error;
        connection.query(`
        INSERT INTO add_budget_usage_detail set ?`, data, function (error, results, fields) {
            if (error) throw error;
            connection.destroy();
            res.send({ 'status': 'success', 'result': results, 'idHead': body.id_head })
        });
    });
}

exports.deleteActivity = async (req, res, next) => {
    let { body } = req
    // console.log(body)
    req.getConnection((error, connection) => {
        if (error) throw error;
        let sql = `DELETE FROM add_activity WHERE id ='${body.id}'`
        connection.query(sql, function (error, results, fields) {
            if (error) throw error;
            connection.destroy();
            res.send({ 'status': 'success', 'result': results, 'idHead': body.id_head })
        });
    });
}

exports.deletePSI = async (req, res, next) => {
    let { body } = req
    // console.log(body)
    req.getConnection((error, connection) => {
        if (error) throw error;
        let sql = `DELETE FROM add_project_success_indicator WHERE id ='${body.id}'`
        connection.query(sql, function (error, results, fields) {
            if (error) throw error;
            connection.destroy();
            res.send({ 'status': 'success', 'result': results, 'idHead': body.id_head })
        });
    });
}

exports.deleteTarget = async (req, res, next) => {
    let { body } = req
    // console.log(body)
    req.getConnection((error, connection) => {
        if (error) throw error;
        let sql = `DELETE FROM add_target WHERE id ='${body.id}'`
        connection.query(sql, function (error, results, fields) {
            if (error) throw error;
            connection.destroy();
            res.send({ 'status': 'success', 'result': results, 'idHead': body.id_head })
        });
    });
}

exports.deleteBS = async (req, res, next) => {
    let { body } = req
    // console.log(body)
    req.getConnection((error, connection) => {
        if (error) throw error;
        let sql = `DELETE FROM add_budget_source WHERE id ='${body.id}'`
        connection.query(sql, function (error, results, fields) {
            if (error) throw error;
            connection.destroy();
            res.send({ 'status': 'success', 'result': results, 'idHead': body.id_head })
        });
    });
}

exports.deleteBUD = async (req, res, next) => {
    let { body } = req
    // console.log(body)
    req.getConnection((error, connection) => {
        if (error) throw error;
        let sql = `DELETE FROM add_budget_usage_detail WHERE id ='${body.id}'`
        connection.query(sql, function (error, results, fields) {
            if (error) throw error;
            connection.destroy();
            res.send({ 'status': 'success', 'result': results, 'idHead': body.id_head })
        });
    });
}


exports.getApprovePlanById = (req, res, next) => {

    req.getConnection((err, connection) => {
        if (err) return console.log(err)
        try {
            let sql = `SELECT * FROM approve_detail WHERE id_head = '${req.params.id}' ORDER BY apv_upDt`
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


//------------------------------------------------------------- เริ่ม select_4exc
exports.get4excAll = (req, res, next) => {

    req.getConnection((err, connection) => {
        if (err) return console.log(err)
        try {
            let sql = `SELECT * FROM select_4exc ORDER BY name`;
            connection.query(sql, (err, row) => {
                if (err) return console.log(err)
                res.send(row)
            })
        } catch (error) {
            console.log(error)
        }
    })
}
//------------------------------------------------------------- จบ select_4exc
//------------------------------------------------------------- เริ่ม select_plan
exports.getPlanByIdHead = (req, res, next) => {

    req.getConnection((err, connection) => {
        if (err) return console.log(err)
        try {
            let sql = `SELECT * FROM select_plan WHERE 4exc_id = '${req.params.id}' ORDER BY name`;
            connection.query(sql, (err, row) => {
                if (err) return console.log(err)
                res.send(row)
            })
        } catch (error) {
            console.log(error)
        }
    })
}
//------------------------------------------------------------- จบ select_plan
//------------------------------------------------------------- เริ่ม select_project
exports.getProjectByIdHead = (req, res, next) => {

    req.getConnection((err, connection) => {
        if (err) return console.log(err)
        try {
            let sql = `SELECT * FROM select_project WHERE 4exc_id = '${req.params.id}' ORDER BY name`;
            connection.query(sql, (err, row) => {
                if (err) return console.log(err)
                res.send(row)
            })
        } catch (error) {
            console.log(error)
        }
    })
}
//------------------------------------------------------------- จบ select_project
//------------------------------------------------------------- เริ่ม select_indicator
exports.getIndicatorByIdHead = (req, res, next) => {

    req.getConnection((err, connection) => {
        if (err) return console.log(err)
        try {
            let sql = `SELECT * FROM select_indicator WHERE 4exc_id = '${req.params.id}' ORDER BY id`;
            connection.query(sql, (err, row) => {
                if (err) return console.log(err)
                res.send(row)
            })
        } catch (error) {
            console.log(error)
        }
    })
}
//------------------------------------------------------------- จบ select_indicator
//------------------------------------------------------------- เริ่ม select_policy
exports.getPolicy = (req, res, next) => {

    req.getConnection((err, connection) => {
        if (err) return console.log(err)
        try {
            let sql = `SELECT * FROM select_policy   ORDER BY id`;
            connection.query(sql, (err, row) => {
                if (err) return console.log(err)
                res.send(row)
            })
        } catch (error) {
            console.log(error)
        }
    })
}
//------------------------------------------------------------- จบ select_policy