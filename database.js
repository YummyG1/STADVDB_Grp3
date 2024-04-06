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
    const result = await pool.query(`
    INSERT INTO bossmantable (idbossmantable, age)
    VALUES (?, ?)`, [id, age])
  return databaseResults()
}
const result = databaseLuzon()
console.log(result)
