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

export async function createData(id, age){
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
const result = databaseLuzon()
console.log(result)
