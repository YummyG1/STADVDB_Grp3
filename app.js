import express from 'express'
import {databaseGetAppointments, createAppointment, 
        updateAppointment, searchAppointments, 
        deleteAppointment, getLocationData,
        getVirtualData, getAgeDemographicsData, fetchAppointment} from './database.js'

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
        const { pxid, clinicid, doctorid, apptid, status, TimeQueued, QueueDate, StartTime, EndTime, type, Virtual, version=0 } = req.body
        await createAppointment(pxid, clinicid, doctorid, apptid, status, TimeQueued, QueueDate, StartTime, EndTime, type, Virtual, version)
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

app.get("/appointmentsUpdate/:apptid", async (req, res) => {
    try {
        const { apptid } = req.params;
        const appointment = await fetchAppointment(apptid);

        // Replace with actual EJS file for updating appointments
        res.render("appointmentsUpdate.ejs", { appointment });
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send("Internal server error");
    }
})

// Route to handle the update of an existing appointment
app.post("/appointmentsUpdate", async (req, res) => {
    try {
        // Extract data from the form submission
        const { pxid, clinicid, doctorid, apptid,  status, TimeQueued, QueueDate, StartTime, EndTime, type, Virtual, version } = req.body
        const updatedApptId = req.body.apptid;
        const result = await updateAppointment(pxid, clinicid, doctorid, updatedApptId, status, TimeQueued, QueueDate, StartTime, EndTime, type, Virtual, updatedApptId, version);

        // Check the result and provide appropriate response
        res.redirect("/appointments")
        
    } catch (error) { 
        console.error("Error occurred:", error)
        res.status(500).send("Internal server error")
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
        const { apptid, version } = req.body
        await deleteAppointment(apptid, version)
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

app.get("/reportGeneration", async (req, res) => {
    try {
        const location = await getLocationData();
        const virtual = await getVirtualData();
        //console.log(virtual)
        const age = await getAgeDemographicsData();
        //console.log(age)

        const locationString = location.map(item => `${item.RegionName} in ${item.City} has ${item.NumberOfAppointments} appointments`).join('<br> ');
        const virtualString = virtual.map(item => `${item.Virtual ? item.Virtual : "No Preference"} appointments: ${item.NumberOfAppointments}`).join('<br>');
        const ageString = age.map(item => `${item.AgeGroup} - ${item.NumberOfPx} patients`).join('<br> ');

        res.render("reportGeneration", {
            location: locationString,
            virtual: virtualString,
            age: ageString
        });
    } catch (error) {
        console.error("Error occurred in /reportGeneration route:", error);
        res.status(500).send("Internal server error");
    }
});


app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something is not working')
})

app.listen(process.env.PORT || 3000, () => {
    console.log('Server running');
  })