const db = require('..config/database')

class usuarioDAO {
    static async criar(nome,email,senha){
        const sql = 'INSERT INTO usuarios(nome, email, senha) values (?,?,?)'
        const [result]= await db.execute(sql,[nome,email,senha])
        return result.insertId  
    }
    //função para criar usuários


    //função para login.
    static async buscarPorEmail(email){
        const sql='SELECT * FROM usuarios WHERE email =?'   
        const [rows]=await db.execute(sql,[email])
        return rows[0]
    }
}
module.exports = UsuarioDAO;