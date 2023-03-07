//import
const express = require('express');
const cors = require('cors');

//implementasi
const app = express();
app.use(cors());

//endpoint nanti ditambahkan di sini
const user = require('./routes/user');
app.use("/user", user)
const menu = require('./routes/menu');
app.use("/menu", menu)
const meja = require('./routes/meja');
app.use("/meja", meja)
const transaksi = require('./routes/transaksi');
app.use("/transaksi", transaksi)
const detail_transaksi = require('./routes/detail_transaksi');
app.use("/detail_transaksi", detail_transaksi)

//run server
app.listen(8080, () => {
    console.log('server run on port 8080')
})
