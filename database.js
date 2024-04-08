import mysql from 'mysql2'

const pool = mysql.createPool({
    host: 'ccscloud.dlsu.edu.ph',
    user: 'mainManager',
    port: '20048',
    database: 'clustertest'

}).promise()

export async function databaseResultsbossman(){
    const [rows]= await pool.query("SELECT * FROM bossmantable") // selecting what table to show 
    return rows
}

export async function databaseLuzon(){
    const [rows]= await pool.query("SELECT * FROM Luzon")
    return rows
}

// CREATE FUNCTIONS

export async function createAppointment(pxid, clinicid, doctorid, status, TimeQueued, QueueDate, StartTime, EndTime, type, Virtual) {
    try {
        const result = await pool.query(`
            INSERT INTO appointments (pxid, clinicid, doctorid, status, TimeQueued, QueueDate, StartTime, EndTime, type, Virtual)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [pxid, clinicid, doctorid, status, TimeQueued, QueueDate, StartTime, EndTime, type, Virtual]);
    } catch (error) {
        console.error("Error in createAppointment function:", error);
        throw error;
    }
}

export async function createClinic(clinicid, hospitalname, IsHospital, City, Province, RegionName) {
    try {
        const result = await pool.query(`
            INSERT INTO clinics (clinicid, hospitalname, IsHospital, City, Province, RegionName)
            VALUES (?, ?, ?, ?, ?, ?)`, [clinicid, hospitalname, IsHospital, City, Province, RegionName]);
    } catch (error) {
        console.error("Error in createClinic function:", error);
        throw error;
    }
}

export async function createDoctor(doctorid, mainspecialty, age) {
    try {
        const result = await pool.query(`
            INSERT INTO doctors (doctorid, mainspecialty, age)
            VALUES (?, ?, ?)`, [doctorid, mainspecialty, age]);
    } catch (error) {
        console.error("Error in createDoctor function:", error);
        throw error;
    }
}

export async function createPx(pxid, age, gender) {
    try {
        const result = await pool.query(`
            INSERT INTO px (pxid, age, gender)
            VALUES (?, ?, ?)`, [pxid, age, gender]);
    } catch (error) {
        console.error("Error in createPx function:", error);
        throw error;
    }
}



export async function createDatabossman(id, age){
    try {
        const result = await pool.query(`
            INSERT INTO bossmantable (idbossmantable, age)
            VALUES (?, ?)`, [id, age]);
            
    } catch (error) {
        // Handle any errors that might occur during the database query execution
        console.error("Error in createData function:", error);
        throw error; // Re-throw the error to be handled by the caller
    }
}

export async function createDataLuzon(id, city, province){
    try {
        const result = await pool.query(`
            INSERT INTO Luzon (idLuzon, Cities, Provinces)
            VALUES (?, ?, ?)`, [id, city, province]);
            
    } catch (error) {
        // Handle any errors that might occur during the database query execution
        console.error("Error in createData function:", error);
        throw error; // Re-throw the error to be handled by the caller
    }
}

// UPDATE FUNCTIONS






export async function updateDataLuzon(id, city, province) {
    try {
        const result = await pool.query(`
            UPDATE Luzon 
            SET Cities = ?, Provinces = ?
            WHERE idLuzon = ?`, [city, province, id]);

        // Check if any rows were affected by the update operation
        if (result.affectedRows === 0) {
            throw new Error(`Record with id ${id} not found.`);
        }

        // Return the result or any necessary data
        return result;
    } catch (error) {
        // Handle any errors that might occur during the database query execution
        console.error("Error in updateDataLuzon function:", error);
        throw error; // Re-throw the error to be handled by the caller
    }
}