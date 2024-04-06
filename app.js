import express from 'express'
import {databaseResultsbossman, databaseLuzon} from './database.js'

const app = express()
app.set("view engine", "ejs")

app.get("/", async (req, res) => { //homepage of the webapp
    res.render("webapp.ejs")
})

app.use(express.static("public"))

app.get("/bossman", async (req, res) => {// return of bossmantable

    const results = await databaseResultsbossman()
    res.render("webappbos.ejs", {results})
})

app.get("/Luzon", async (req, res) => {// return of bossmantable

    const results = await databaseLuzon()
    res.render("webappLuzon.ejs", {results})
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something is not working')
})

app.listen(20048,()=> {
    console.log('Server running')
})