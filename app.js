import express from 'express'
import {databaseGetAppointments, createAppointment, 
        updateAppointment, searchAppointments, 
        deleteAppointment} from './database.js'

const app = express()
app.set("view engine", "ejs")

app.get("/", async (req, res) => { //homepage of the webapp
    res.render("webapp.ejs")
})

app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get("/appointments/:id", (req, res) => {
    res.redirect("/appointments");
});

app.get("/appointments", async (req, res) => {
    try {
        let results;

        // Check if a search term is present in the query parameters
        const searchTerm = req.query.searchTerm;
        if (searchTerm) {
            // If search term is present, perform search
            results = await searchAppointments(searchTerm);
        } else {
            // If no search term, retrieve all appointments
            results = await databaseGetAppointments();
        }

        // Render the appointment.ejs template with the results
        res.render("appointment.ejs", { results });
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send("Internal server error");
    }
});

// Route to display the form for adding a new appointment
app.get("/appointmentsAdd", (req, res) => {
    res.render("appointmentsAdd.ejs") // Replace with actual EJS file for adding appointments
})

// Route to handle the submission of the form for adding new appointments
app.post("/appointmentsAdd", async (req, res) => {
    try {
        // Extract data from the form submission
        const { pxid, clinicid, doctorid, status, TimeQueued, QueueDate, StartTime, EndTime, type, Virtual } = req.body
        await createAppointment(pxid, clinicid, doctorid, status, TimeQueued, QueueDate, StartTime, EndTime, type, Virtual)
        res.redirect("/appointments") 
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            console.error("Duplicate entry error:", error)
            res.status(400).send("Error: Duplicate entry. This ID already exists.")    
        } else {
            console.error("Error occurred:", error)
            res.status(500).send("Internal server error")
        }
    }
})

app.get("/appointmentsUpdate", (req, res) => {
    res.render("appointmentsUpdate.ejs") // Replace with actual EJS file for updating appointments
})

// Route to handle the update of an existing appointment
app.post("/appointmentsUpdate", async (req, res) => {
    try {
        // Extract data from the form submission
        const { appid, pxid, clinicid, doctorid, status, TimeQueued, QueueDate, StartTime, EndTime, type, Virtual } = req.body
        const result = await updateAppointment(appid, pxid, clinicid, doctorid, status, TimeQueued, QueueDate, StartTime, EndTime, type, Virtual)
        
        // Check the result and provide appropriate response
        if (result.affectedRows > 0) {
            res.redirect("/appointments")
        } else {
            res.status(404).send("Appointment not found.")
        }
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            console.error("Duplicate entry error:", error)
            res.status(400).send("Error: Duplicate entry.")    
        } else {
            console.error("Error occurred:", error)
            res.status(500).send("Internal server error")
        }
    }
})

// Route to display the form for adding a new appointment
app.get("/appointmentsDelete", (req, res) => {
    res.render("appointmentsDelete.ejs") // Replace with actual EJS file for adding appointments
})

// Route to handle the submission of the form for adding new appointments
app.post("/appointmentsDelete", async (req, res) => {
    try {
        // Extract data from the form submission
        const { apptid } = req.body
        await deleteAppointment(apptid)
        res.redirect("/appointments") 
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            console.error("Duplicate entry error:", error)
            res.status(400).send("Error: Duplicate entry. This ID already exists.")    
        } else {
            console.error("Error occurred:", error)
            res.status(500).send("Internal server error")
        }
    }
})

app.get("/reportGeneration", (req, res) => {
    res.render("reportGeneration.ejs")
})

app.get("/reportGeneration", async (req, res) => {
    /* TODO: FIX THE STUFF BELOW FOR PROPER IMPLEMENTATION OF REPORT GENERATION HOME PAGE
    try {
        let results;

        // Check if a search term is present in the query parameters
        const searchTerm = req.query.searchTerm;
        if (searchTerm) {
            // If search term is present, perform search
            results = await searchAppointments(searchTerm);
        } else {
            // If no search term, retrieve all appointments
            results = await databaseGetAppointments();
        }

        // Render the appointment.ejs template with the results
        res.render("appointment.ejs", { results });
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send("Internal server error");
    }
    */
});

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something is not working')
})

app.listen(3000,()=> {
    console.log('Server running')
})