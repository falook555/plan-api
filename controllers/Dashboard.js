const moment = require('moment')
const fs = require('fs')
const md5 = require('md5')

const mysql = require("mysql");
const config = require("../config");
const con = mysql.createConnection(config.dbOption);
const { makeDb } = require('mysql-async-simple');

const db = makeDb();
db.connect(con);


exports.MoneyTotal = async (req, res, next) => {
    req.getConnection((err, connection) => {
        if (err) return console.log(err)
        try {
            let sql = `SELECT SUM(aph_total_budget) as tsum FROM add_plan_head `;
            connection.query(sql, (err, row) => {
                if (err) return console.log(err)
                res.send(row)
            })
        } catch (error) {
            console.log(error)
        }
    })
}
exports.MoneyBetween = async (req, res, next) => {
    req.getConnection((err, connection) => {
        if (err) return console.log(err)
        try {
            let sql = `SELECT SUM(aph_total_budget) as tsum  FROM add_plan_head  WHERE aph_status <> 4 `;
            connection.query(sql, (err, row) => {
                if (err) return console.log(err)
                res.send(row)
            })
        } catch (error) {
            console.log(error)
        }
    })
}
exports.MoneySuccess = async (req, res, next) => {
    req.getConnection((err, connection) => {
        if (err) return console.log(err)
        try {
            let sql = `SELECT SUM(aph_total_budget) as tsum   FROM add_plan_head  WHERE aph_status = 4`;
            connection.query(sql, (err, row) => {
                if (err) return console.log(err)
                res.send(row)
            })
        } catch (error) {
            console.log(error)
        }
    })
}


exports.ProjectTotal = async (req, res, next) => {
    req.getConnection((err, connection) => {
        if (err) return console.log(err)
        try {
            let sql = `SELECT count(id) AS tcount  FROM add_plan_head`;
            connection.query(sql, (err, row) => {
                if (err) return console.log(err)
                res.send(row)
            })
        } catch (error) {
            console.log(error)
        }
    })
}
exports.ProjectBetween = async (req, res, next) => {
    req.getConnection((err, connection) => {
        if (err) return console.log(err)
        try {
            let sql = `SELECT count(id) AS tcount  FROM add_plan_head WHERE aph_status IN(1,2,3)`;
            connection.query(sql, (err, row) => {
                if (err) return console.log(err)
                res.send(row)
            })
        } catch (error) {
            console.log(error)
        }
    })
}
exports.ProjectNot = async (req, res, next) => {
    req.getConnection((err, connection) => {
        if (err) return console.log(err)
        try {
            let sql = `SELECT count(id) AS tcount  FROM add_plan_head WHERE aph_status IS NULL `;
            connection.query(sql, (err, row) => {
                if (err) return console.log(err)
                res.send(row)
            })
        } catch (error) {
            console.log(error)
        }
    })
}
exports.ProjectSuccess = async (req, res, next) => {
    req.getConnection((err, connection) => {
        if (err) return console.log(err)
        try {
            let sql = `SELECT count(id) AS tcount  FROM add_plan_head WHERE aph_status = 4 `;
            connection.query(sql, (err, row) => {
                if (err) return console.log(err)
                res.send(row)
            })
        } catch (error) {
            console.log(error)
        }
    })
}