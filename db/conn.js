const mongoose = require('mongoose')

const uri = "mongodb+srv://marcosrodrigues3546:marcos123@cluster0.qecpmyz.mongodb.net/?retryWrites=true&w=majority";

async function main()
{
    await mongoose.connect('mongodb+srv://marcosrodrigues3546:marcos123@cluster0.qecpmyz.mongodb.net/?retryWrites=true&w=majority')

    console.log('conectou ao MongoDB com Mongoose!')
}

main().catch( (error)=> console.log(error) )

module.exports = mongoose