import mysql from 'mysql2'

let pool = mysql.createPool({
    host: 'ccscloud.dlsu.edu.ph',
    user: 'mainManager',
    port: '20048',
    database: 'clustertest'

}).promise()

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
                pool = mysql.createPool({
                    host: 'ccscloud.dlsu.edu.ph',
                    user: 'userServer1',
                    port: '20049',
                    database: 'clustertest'
                }).promise();
                // Retry the query
                const [rows] = await pool.query("SELECT * FROM appointment");
                return rows;
            } catch (error) {
                console.error("Error occurred while retrying with userServer1 and port 20049:", error.message);
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
        const result = await pool.query(`
            UPDATE appointment 
            SET pxid = ?, clinicid = ?, doctorid = ?, status = ?, TimeQueued = ?, QueueDate = ?, StartTime = ?, EndTime = ?, type = ?, Virtual = ?
            WHERE apptid = ?`, [pxid, clinicid, doctorid, apptid, status, TimeQueued, QueueDate, StartTime, EndTime, type, Virtual])

        if (result.affectedRows === 0) {
            throw new Error(`Record with appid ${apptid} not found.`)
        }
        return result
    } catch (error) {
        console.error("Error in updateAppointment function:", error)
        throw error
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
/*
export async function reportGeneration {

}
*/