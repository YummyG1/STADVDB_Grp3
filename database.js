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