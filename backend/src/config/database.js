const mysql=require('mysql2/promise')

const db = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'',
    database:"Varazo"
})
module.exports=db;
//NIELSON: função para criar uma conexão com o banco de dados.