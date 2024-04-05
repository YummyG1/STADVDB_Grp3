import mysql from 'mysql2'

const pool = mysql.createPool({
    host: 'ccscloud.dlsu.edu.ph',
    user: 'mainManager',
    port: '20048',
    database: 'clustertest'

}).promise()

async function databaseResults(){
    const [rows]= await pool.query("SELECT * FROM bossmantable")
    return rows
}

async function createData(id, age){
    const result = await pool.query(`
    INSERT INTO bossmantable (idbossmantable, age)
    VALUES (?, ?)`, [id, age])
    return result.insertID
}

let listOfTable = await databaseResults()
console.log(listOfTable)

const newData =  await createData('391','122')
console.log(newData)

listOfTable = await databaseResults()
console.log(listOfTable)