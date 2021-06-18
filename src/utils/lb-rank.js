const Niveles = require('../database/niveles');
module.exports = async (user) => {
    let userDB = await Niveles.findOne({ id: user.id })
    if(!userDB) userDB = await Niveles.create({ id: user.id })

    const todo = await Niveles.find().lean()
    const ordenado = todo.sort((a, b) => b.nivel - a.nivel || b.xp - a.xp)
    return {
        ordenado,
        position: ordenado.map(x => x.id).indexOf(user.id) + 1 
    }
}