const express = require('express');
const bodyParser = require('body-parser');
const md5 = require('md5');

//implementasi library
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//import model
const model = require('../models/index');
const meja = model.meja

//import sequelize op
const Sequelize = require("sequelize")
const Op = Sequelize.Op


//endpoint untuk menyimpan data admin, METHOD: POST, function: create
//endpoint menampilkan semua data admin, method: GET, function: findAll()
app.get("/", auth, (req, res) => {
    meja.findAll()
        .then(result => {
            res.json({
                meja: result
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

app.post("/", auth, (req, res) => {
    let data = {
        nomor_meja: req.body.nomor_meja
    }

    meja.create(data)
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

app.put("/:id", auth, (req, res) => {
    let param = {
        id_meja: req.params.id
    }
    let data = {
        nomor_meja: req.body.nomor_meja
    }
    meja.update(data, { where: param })
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

app.delete("/:id", auth, (req, res) => {
    let param = {
        id_meja: req.params.id
    }
    meja.destroy({ where: param })
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

app.post("/search", async(req, res) => {
    let keyword = req.body.keyword
    let result = await meja.findAll({
        where: {
            [Op.or]: [{
                    id_meja: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    nomor_meja: {
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