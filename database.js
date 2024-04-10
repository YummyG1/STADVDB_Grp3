import mysql from 'mysql2'
let n_port = 20048;
let userServerIncrement = 0;
let poolConfig = {
    host: 'ccscloud.dlsu.edu.ph',
    user: 'mainManager',
    port: n_port,
    database: 'clustertest'
};
let pool = mysql.createPool(poolConfig).promise();

export async function databaseGetAppointments(){
    try {
        console.log("Pool Configuration:");
        console.log("Host:", poolConfig.host);
        console.log("User:", poolConfig.user);
        console.log("Port:", poolConfig.port);
        console.log("Database:", poolConfig.database);

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
                if(n_port == 20051){
                    n_port = 20048
                    userServerIncrement = 0
                    poolConfig = {
                        host: 'ccscloud.dlsu.edu.ph',
                        user: `mainManager`,
                        port: n_port,
                        database: 'clustertest'
                    }
                    pool = mysql.createPool(poolConfig).promise();
                }
                else{
                    poolConfig = {
                        host: 'ccscloud.dlsu.edu.ph',
                        user: `userServer${userServerIncrement}`,
                        port: n_port,
                        database: 'clustertest'
                    }
                    pool = mysql.createPool(poolConfig).promise();
                }
                console.log("Pool Configuration:");
                console.log("Host:", poolConfig.host);
                console.log("User:", poolConfig.user);
                console.log("Port:", poolConfig.port);
                console.log("Database:", poolConfig.database);
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
export async function createAppointment(pxid, clinicid, doctorid, apptid, status, TimeQueued, QueueDate, StartTime, EndTime, type, Virtual, version) {
    try {
        const result = await pool.query(`
            SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
            START TRANSACTION;
            INSERT INTO appointment (pxid, clinicid, doctorid, apptid, status, TimeQueued, QueueDate, StartTime, EndTime, type,  \`Virtual\`, version)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            COMMIT;`, [pxid, clinicid, doctorid, apptid, status, TimeQueued, QueueDate, StartTime, EndTime, type, Virtual, version])
    } catch (error) {
        console.error("Error occurred:", error.message);
        // Handle connection error and reconfigure pool
        if (error.code === 'PROTOCOL_CONNECTION_LOST' || error.code === 'ETIMEDOUT') {
            console.log("Reconfiguring pool...");
            try {
                // Attempt reconfiguration with userServer1 and port 20049
                userServerIncrement++;
                n_port++;
                if(n_port == 20051){
                    n_port = 20048
                    userServerIncrement = 0
                    poolConfig = {
                        host: 'ccscloud.dlsu.edu.ph',
                        user: `mainManager`,
                        port: n_port,
                        database: 'clustertest'
                    }
                    pool = mysql.createPool(poolConfig).promise();
                }
                else{
                    poolConfig = {
                        host: 'ccscloud.dlsu.edu.ph',
                        user: `userServer${userServerIncrement}`,
                        port: n_port,
                        database: 'clustertest'
                    }
                    pool = mysql.createPool(poolConfig).promise();
                }
                console.log("Pool Configuration:");
                console.log("Host:", poolConfig.host);
                console.log("User:", poolConfig.user);
                console.log("Port:", poolConfig.port);
                console.log("Database:", poolConfig.database);
                // Retry the query
                return await createAppointment(pxid, clinicid, doctorid, apptid, status, TimeQueued, QueueDate, StartTime, EndTime, type, Virtual, version);
            } catch (error) {
                console.error(`Error occurred while retrying with userServer${userServerIncrement} and port ${n_port}:`, error.message);
                throw error;
            }
        }
    }   
}

export async function deleteAppointment(pxid, clinicid, doctorid, apptid, status, TimeQueued, QueueDate, StartTime, EndTime, type, Virtual, version) {
    try {
        const result = await pool.query(`
            SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
            START TRANSACTION;
            DELETE FROM appointment WHERE apptid=? AND version=?;
            COMMIT;`, [pxid, clinicid, doctorid, apptid, status, TimeQueued, QueueDate, StartTime, EndTime, type, Virtual, version])
    } catch (error) {
        console.error("Error in deleteAppointment function:", error)
        throw error
    }
}


// UPDATE FUNCTIONS

export async function updateAppointment(pxid, clinicid, doctorid, apptid, status, TimeQueued, QueueDate, StartTime, EndTime, type, Virtual, version) {
    try {
        console.log(apptid)
        const result = await pool.query(`
            SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
            START TRANSACTION;
            UPDATE appointment 
            SET pxid = ?, clinicid = ?, doctorid = ?, status = ?, TimeQueued = ?, QueueDate = ?, StartTime = ?, EndTime = ?, type = ?, \`Virtual\` = ?, version = version+1
            WHERE apptid = ? AND version = ?
            COMMIT;`, [pxid, clinicid, doctorid, status, TimeQueued, QueueDate, StartTime, EndTime, type, Virtual, apptid, version]);

        if (result.affectedRows === 0) {
            throw new Error(`Record with apptid ${apptid} not found or version mismatch.`);
        }
        return result;
    } catch (error) {
        console.error("Error occurred:", error.message);
        // Handle connection error and reconfigure pool
        if (error.code === 'PROTOCOL_CONNECTION_LOST' || error.code === 'ETIMEDOUT') {
            console.log("Reconfiguring pool...");
            try {
                // Attempt reconfiguration with userServer1 and port 20049
                userServerIncrement++;
                n_port++;
                if(n_port == 20051){
                    n_port = 20048
                    userServerIncrement = 0
                    poolConfig = {
                        host: 'ccscloud.dlsu.edu.ph',
                        user: `mainManager`,
                        port: n_port,
                        database: 'clustertest'
                    }
                    pool = mysql.createPool(poolConfig).promise();
                }
                else{
                    poolConfig = {
                        host: 'ccscloud.dlsu.edu.ph',
                        user: `userServer${userServerIncrement}`,
                        port: n_port,
                        database: 'clustertest'
                    }
                    pool = mysql.createPool(poolConfig).promise();
                }
                console.log("Pool Configuration:");
                console.log("Host:", poolConfig.host);
                console.log("User:", poolConfig.user);
                console.log("Port:", poolConfig.port);
                console.log("Database:", poolConfig.database);
                // Retry the query
                return await updateAppointment(pxid, clinicid, doctorid, apptid, status, TimeQueued, QueueDate, StartTime, EndTime, type, Virtual);
            } catch (error) {
                console.error(`Error occurred while retrying with userServer${userServerIncrement} and port ${n_port}:`, error.message);
                throw error;
            }
        }
        console.error("Error in updateAppointment function:", error);
        throw error;
    }
}


// search function
export async function searchAppointments(apptid) {
    try {
        // Construct and execute the SQL query with the search term
        const [rows] = await pool.query(`
            SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
            START TRANSACTION;
            SELECT * FROM appointment 
            WHERE apptid LIKE ?
            COMMIT;`, [`%${apptid}%`]); // Use placeholders for query parameters

        // Return the search results
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
                if(n_port == 20051){
                    n_port = 20048
                    userServerIncrement = 0
                    poolConfig = {
                        host: 'ccscloud.dlsu.edu.ph',
                        user: `mainManager`,
                        port: n_port,
                        database: 'clustertest'
                    }
                    pool = mysql.createPool(poolConfig).promise();
                }
                else{
                    poolConfig = {
                        host: 'ccscloud.dlsu.edu.ph',
                        user: `userServer${userServerIncrement}`,
                        port: n_port,
                        database: 'clustertest'
                    }
                    pool = mysql.createPool(poolConfig).promise();
                }
                console.log("Pool Configuration:");
                console.log("Host:", poolConfig.host);
                console.log("User:", poolConfig.user);
                console.log("Port:", poolConfig.port);
                console.log("Database:", poolConfig.database);
                // Retry the query
                return await searchAppointments(apptid);
            } catch (error) {
                console.error(`Error occurred while retrying with userServer${userServerIncrement} and port ${n_port}:`, error.message);
                throw error;
            }
        }
    }
}

// TODO: Add proper implementation for report generation function

export async function getLocationData() {
    try {
        const [locationData] = await pool.query(`
            SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
            START TRANSACTION;
            SELECT c.RegionName, c.City, COUNT(a.apptid) AS NumberOfAppointments
            FROM appointment a
            JOIN clinics c ON a.clinicid = c.clinicid
            GROUP BY c.RegionName, c.City;
            COMMIT;
        `);
        //console.log(locationData);
        return locationData;
    } catch (error) {
        console.error("Error in getLocationData function:", error);
        throw error;
    }
}

export async function getVirtualData() {
    try {
        const [virtualData] = await pool.query(`
            SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
            START TRANSACTION;
            SELECT \`Virtual\`, COUNT(apptid) AS NumberOfAppointments
            FROM appointment
            GROUP BY \`Virtual\`;
            COMMIT;
        `);
        //console.log(virtualData);
        return virtualData;
    } catch (error) {
        console.error("Error in getVirtualData function:", error);
        throw error;
    }
}

export async function getAgeDemographicsData() {
    try {
        const [ageDemographicsData] = await pool.query(`
        SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
        START TRANSACTION;
        SELECT 
        CASE
            WHEN p.age BETWEEN 0 AND 17 THEN '0-17'
            WHEN p.age BETWEEN 18 AND 35 THEN '18-35'
            WHEN p.age BETWEEN 36 AND 55 THEN '36-55'
            WHEN p.age > 55 THEN '56+'
            ELSE 'Unknown'
        END AS AgeGroup,
        COUNT(p.pxid) AS NumberOfPx
        FROM px p
        GROUP BY AgeGroup;
        COMMIT;
        `);
        //console.log(ageDemographicsData);
        return ageDemographicsData;
    } catch (error) {
        console.error("Error in getAgeDemographicsData function:", error);
        throw error;
    }
}

