import express from 'express'
import {databaseGetAppointments, createAppointment, updateAppointment, databaseResultsbossman, databaseLuzon, createDatabossman, createDataLuzon, updateDataLuzon} from './database.js'

const app = express()
app.set("view engine", "ejs")

app.get("/", async (req, res) => { //homepage of the webapp
    
    const results = await databaseGetAppointments()
    console.log(results)
    res.render("appointment.ejs", {results})
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
    } catch (error) {
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

app.get('/search', async (req, res) => {
    const searchTerm = req.query.term;
  
    if (!searchTerm) {
      return res.json({ message: 'Please enter a search term' });
    }
  
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT * FROM Luzon WHERE Cities LIKE ?', `%${searchTerm}%`);
        connection.release();
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching search results' });
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
    } catch (error) {
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

app.get("/updateDataLuzon", (req, res) => {
    res.render("webappLuzonUpdate.ejs"); // Assuming you have an EJS file named updateDataLuzon.ejs
});

app.post("/updateDataLuzon", async (req, res) => {
    try {
        const id = req.body.id;
        const city = req.body.city;
        const province = req.body.province;

        // Call updateDataLuzon function to update data in the database
        const result = await updateDataLuzon(id, city, province);

        // Send a success response
        res.status(200).send("Data updated successfully");
        res.redirect("/Luzon");
    } catch (error) {
        // Sending error response if something went wrong
        console.error("Error occurred:", error);
        res.status(500).send("Internal server error");
    }
});

// Routes for the appointments dataset

// Route to render the list of appointments
app.get("/appointments", async (req, res) => {

    const results = await databaseGetAppointments()
    res.render("appointmentsList.ejs", { results }); // Replace with actual EJS file
});

// Route to display the form for adding a new appointment
app.get("/appointmentsAdd", (req, res) => {
    res.render("appointmentsAdd.ejs"); // Replace with actual EJS file for adding appointments
});

// Route to handle the submission of the form for adding new appointments
app.post("/appointmentsAdd", async (req, res) => {
    try {
        // Extract data from the form submission
        const { pxid, clinicid, doctorid, status, TimeQueued, QueueDate, StartTime, EndTime, type, Virtual } = req.body;
        await createAppointment(pxid, clinicid, doctorid, status, TimeQueued, QueueDate, StartTime, EndTime, type, Virtual);
        res.redirect("/appointments"); 
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            console.error("Duplicate entry error:", error);
            res.status(400).send("Error: Duplicate entry. This ID already exists.");    
        } else {
            console.error("Error occurred:", error);
            res.status(500).send("Internal server error");
        }
    }
});

app.get("/appointmentsUpdate", (req, res) => {
    res.render("appointmentsUpdate.ejs"); // Replace with actual EJS file for updating appointments
});

// Route to handle the update of an existing appointment
app.post("/appointmentsUpdate", async (req, res) => {
    try {
        // Extract data from the form submission
        const { appid, pxid, clinicid, doctorid, status, TimeQueued, QueueDate, StartTime, EndTime, type, Virtual } = req.body;
        const result = await updateAppointment(appid, pxid, clinicid, doctorid, status, TimeQueued, QueueDate, StartTime, EndTime, type, Virtual);
        
        // Check the result and provide appropriate response
        if (result.affectedRows > 0) {
            res.redirect("/appointments");
        } else {
            res.status(404).send("Appointment not found.");
        }
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            console.error("Duplicate entry error:", error);
            res.status(400).send("Error: Duplicate entry.");    
        } else {
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