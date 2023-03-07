const express = require('express');
const bodyParser = require('body-parser');
const md5 = require('md5');

//implementasi library
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//import model
const model = require('../models/index');
const detail_transaksi = model.detail_transaksi

//import sequelize op
const Sequelize = require("sequelize")
const Op = Sequelize.Op

//endpoint untuk menyimpan data admin, METHOD: POST, function: create
//endpoint menampilkan semua data admin, method: GET, function: findAll()
app.get("/", auth, (req, res) => {
    detail_transaksi.findAll()
        .then(result => {
            res.json({
                detail_transaksi: result
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
        id_transaksi: req.body.id_transaksi,
        id_menu: req.body.id_menu,
        harga: req.body.harga
    }

    detail_transaksi.create(data)
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
        id_detail_transaksi: req.params.id
    }
    let data = {
        id_transaksi: req.body.id_transaksi,
        id_menu: req.body.id_menu,
        harga: req.body.harga
    }
    transaksi.update(data, { where: param })
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
        id_detail_transaksi: req.params.id
    }
    detail_transaksi.destroy({ where: param })
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
    let result = await detail_transaksi.findAll({
        where: {
            [Op.or]: [{
                    id_detail_transaksi: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    id_transaksi: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    id_menu: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    harga: {
                        [Op.like]: `%${keyword}%`
                    }
                },
            ]
        },
    })
    res.json({
        user: result
    })
})

module.exports = app