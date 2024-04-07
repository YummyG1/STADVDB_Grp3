import express from 'express'
import {databaseResultsbossman, databaseLuzon, createDatabossman, createDataLuzon} from './database.js'

const app = express()
app.set("view engine", "ejs")

app.get("/", async (req, res) => { //homepage of the webapp
    res.render("webapp.ejs")
})

app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/bossman", async (req, res) => {// return of bossman table

    const results = await databaseResultsbossman()
    res.render("webappbos.ejs", {results})
})

app.get("/Luzon", async (req, res) => {// return of luzon table

    const results = await databaseLuzon()
    res.render("webappLuzon.ejs", {results})
})

app.get("/bossmanAddData", (req, res) => {
    res.render("webappbosAdd.ejs");
});

app.post("/bossmanAddData", async (req, res) => {
    try {
        const id = req.body.id;
        const age = req.body.age;

        // Validate and sanitize input data if necessary

        // Call createData function to insert data into the database
        await createDatabossman(id, age);

        // Redirect to a page showing the data (change "/bossman" to the appropriate route)
        res.redirect("/bossman"); 
    }catch (error) {
            // Handle specific database errors
            if (error.code === 'ER_DUP_ENTRY') {
                // Handle duplicate entry error
                console.error("Duplicate entry error:", error);
                res.status(400).send("Error: Duplicate entry. This ID already exists.");    
            } else {
                // Handle other errors
                console.error("Error occurred:", error);
                res.status(500).send("Internal server error");
            }
        }
});

app.get("/LuzonAddData", (req, res) => {
    res.render("webappLuzonAdd.ejs");
});

app.post("/LuzonAddData", async (req, res) => {
    try {
        const id = req.body.id;
        const city = req.body.city;
        const province = req.body.province;

        // Validate and sanitize input data if necessary

        // Call createData function to insert data into the database
        await createDataLuzon(id, city, province);

        // Redirect to a page showing the data (change "/bossman" to the appropriate route)
        res.redirect("/Luzon"); 
    }catch (error) {
            // Handle specific database errors
            if (error.code === 'ER_DUP_ENTRY') {
                // Handle duplicate entry error
                console.error("Duplicate entry error:", error);
                res.status(400).send("Error: Duplicate entry. This ID already exists.");    
            } else {
                // Handle other errors
                console.error("Error occurred:", error);
                res.status(500).send("Internal server error");
            }
        }
});

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something is not working')
})

app.listen(20048,()=> {
    console.log('Server running')
})