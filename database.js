import mysql from 'mysql2'
let n_port = 20048;
let userServerIncrement = 0;
let pool = mysql.createPool({
    host: 'ccscloud.dlsu.edu.ph',
    user: 'mainManager',
    port: n_port,
    database: 'clustertest'
}).promise();

export async function databaseGetAppointments(){
    try {
        const [rows] = await pool.query("SELECT * FROM appointment");
        return rows;
    } catch (error) {
        console.error("Error occurred:", error.message);
        // Handle connection error and reconfigure pool
        if (error.code === 'PROTOCOL_CONNECTION_LOST' || error.code === 'ETIMEDOUT') {
            console.log("Reconfiguring pool...");
            try {
                // Attempt reconfiguration with userServer1 and port 20049
                userServerIncrement++;
                n_port++;
                pool = mysql.createPool({
                    host: 'ccscloud.dlsu.edu.ph',
                    user: `userServer${userServerIncrement}`,
                    port: n_port,
                    database: 'clustertest'
                }).promise();
                // Retry the query
                return await databaseGetAppointments();
            } catch (error) {
                console.error(`Error occurred while retrying with userServer${userServerIncrement} and port ${n_port}:`, error.message);
                throw error;
            }
        } 
    }
}

// CREATE FUNCTIONS
export async function createAppointment(pxid, clinicid, doctorid, apptid, status, TimeQueued, QueueDate, StartTime, EndTime, type, Virtual) {
    try {
        const result = await pool.query(`
            INSERT INTO appointment (pxid, clinicid, doctorid, apptid, status, TimeQueued, QueueDate, StartTime, EndTime, type,  \`Virtual\`)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [pxid, clinicid, doctorid, apptid, status, TimeQueued, QueueDate, StartTime, EndTime, type, Virtual])
    } catch (error) {
        console.error("Error in createAppointment function:", error)
        throw error
    }
}

export async function deleteAppointment(pxid, clinicid, doctorid, apptid, status, TimeQueued, QueueDate, StartTime, EndTime, type, Virtual) {
    try {
        const result = await pool.query(`
            DELETE FROM appointment WHERE apptid=?;`, [pxid, clinicid, doctorid, apptid, status, TimeQueued, QueueDate, StartTime, EndTime, type, Virtual])
    } catch (error) {
        console.error("Error in deleteAppointment function:", error)
        throw error
    }
}

// UPDATE FUNCTIONS

export async function updateAppointment(pxid, clinicid, doctorid, apptid, status, TimeQueued, QueueDate, StartTime, EndTime, type, Virtual) {
    try {
        console.log(apptid)
        const result = await pool.query(`
            UPDATE appointment 
            SET pxid = ?, clinicid = ?, doctorid = ?, status = ?, TimeQueued = ?, QueueDate = ?, StartTime = ?, EndTime = ?, type = ?, \`Virtual\` = ?
            WHERE apptid = ?`, [pxid, clinicid, doctorid, status, TimeQueued, QueueDate, StartTime, EndTime, type, Virtual, apptid]);

        if (result.affectedRows === 0) {
            throw new Error(`Record with apptid ${apptid} not found.`);
        }
        return result;
    } catch (error) {
        console.error("Error in updateAppointment function:", error);
        throw error;
    }
}


// search function
export async function searchAppointments(apptid) {
    try {
        // Construct and execute the SQL query with the search term
        const [rows] = await pool.query(`
            SELECT * FROM appointment 
            WHERE apptid LIKE ?`, [`%${apptid}%`]); // Use placeholders for query parameters

        // Return the search results
        return rows;
    } catch (error) {
        console.error("Error in searchAppointments function:", error);
        throw error;
    }
}

// TODO: Add proper implementation for report generation function

export async function reportGeneration() {
    let locationData, virtualData, ageDemographicsData

    try {
        // Number of appointments based on location
        locationData = await pool.query(`
            SELECT c.RegionName, c.City, COUNT(a.apptid) AS NumberOfAppointments
            FROM appointment a
            JOIN clinics c ON a.clinicid = c.clinicid
            GROUP BY c.RegionName, c.City;
        `)
        console.log(locationData)

        // Number of virtual true/false
        virtualData = await pool.query(`
            SELECT \`Virtual\`, COUNT(apptid) AS NumberOfAppointments
            FROM appointment
            GROUP BY \`Virtual\`;
        `)
        console.log(virtualData)

        // Age demographics
        ageDemographicsData = await pool.query(`
            SELECT 
              CASE
                WHEN p.age BETWEEN 0 AND 17 THEN '0-17'
                WHEN p.age BETWEEN 18 AND 35 THEN '18-35'
                WHEN p.age BETWEEN 36 AND 55 THEN '36-55'
                WHEN p.age > 55 THEN '56+'
                ELSE 'Unknown'
              END AS AgeGroup,
              COUNT(a.apptid) AS NumberOfAppointments
            FROM appointment a
            JOIN px p ON a.pxid = p.pxid
            GROUP BY AgeGroup;
        `)
        console.log(ageDemographicsData)

        // Storing the results in a tuple
        const results = {
            location: locationData,
            virtual: virtualData,
            age: ageDemographicsData
        };

        return results;

    } catch (error) {
        console.error("Error in reportGeneration function:", error);
        throw error;
    }
}

