const express = require('express');
const bodyParser = require('body-parser');
const md5 = require('md5');

// import multer, path, file system
const multer = require("multer")
const path = require("path")
const fs = require("fs") // file sistem (mengakses file tersebut), membaca file sistem (dimana file itu) 

//import auth
const auth = require("../auth")
const jwt = require("jsonwebtoken")
const SECRET_KEY = "kopisusu"

//import sequelize op
const Sequelize = require("sequelize")
const Op = Sequelize.Op

//implementasi library
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//import model
const model = require('../models/index');
const user = model.user


//endpoint untuk menyimpan data admin, METHOD: POST, function: create
//endpoint menampilkan semua data admin, method: GET, function: findAll()
app.get("/", auth, async(req, res) => {
    user.findAll()
        .then(result => {
            res.json({
                count: result.length,
                user: result
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

app.get("/:id", (req, res) => {
    user.findOne({ where: { id_user: req.params.id } })
        .then(result => {
            res.json({
                user: result
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

app.post("/", (req, res) => {
    let data = {
        nama_user: req.body.nama_user,
        role: req.body.role,
        username: req.body.username,
        password: md5(req.body.password)
    }

    user.create(data)
        .then(result => {
            res.json({
                message: "data has been inserted"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

app.post("/auth", async(req, res) => {
    let data = {
            username: req.body.username,
            password: md5(req.body.password)
        }
        // mencari data admin yang username dan passwordnya sama dengan inputan
    let result = await user.findOne({ where: data })
    if (result) {
        // jika ditemukan, set payload data
        let payload = JSON.stringify({
                id_user: result.id_user,
                nama_user: result.nama_user,
                username: result.username
            })
            // generate token based on payload and secret key
        let token = jwt.sign(payload, SECRET_KEY)
            // set output 
        res.json({
            logged: true,
            data: result,
            token: token
        })
    } else {
        // jike tidak ditemukan 
        res.json({
            logged: false,
            message: "invalid username or password"
        })
    }
})

app.put("/:id", (req, res) => {
    let param = {
        id_user: req.params.id
    }
    let data = {
        nama_user: req.body.nama_user,
        role: req.body.role,
        username: req.body.username,
        password: md5(req.body.password)
    }
    user.update(data, { where: param })
        .then(result => {
            res.json({
                message: "data has been updated"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

app.delete("/:id", (req, res) => {
    let param = {
        id_user: req.params.id
    }
    user.destroy({ where: param })
        .then(result => {
            res.json({
                message: "data has been deleted"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

app.post("/logout", async(req, res) => {
    // hapus token dari client-side
    // misalnya dengan menghapus token dari session atau local storage
    // hapus token dari server-side
    res.clearCookie("jwt");
    res.json({
        message: "logout berhasil",
    });
});

app.post("/search", async(req, res) => {
    let keyword = req.body.keyword
    let result = await user.findAll({
        where: {
            [Op.or]: [{
                    id_user: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    nama_user: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    role: {
                        [Op.like]: `%${keyword}%`
                    }
                }
            ]
        },
    })
    res.json({
        user: result
    })
})

module.exports = app