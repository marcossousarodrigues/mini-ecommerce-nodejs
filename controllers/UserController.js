const User = require('../models/User')
const Product = require('../models/Product')
const flash = require('express-flash')

module.exports =
class UserController
{
    static showCreateUser(req, res)
    {
        res.render('pages/user/create')
    }

    static showLoginUser(req, res)
    {
        res.render('pages/user/login')
    }

    static async showEdit(req, res)
    {
        const id = req.session.userid
        const user = await User.findById({_id: id}).lean()

        res.render('pages/user/edit', {user})
    }

    static async dashboard(req, res)
    {
        const products = await Product.find().lean()
        res.render('pages/dashboard/dashboard', {products})

    }



    static async loginUser(req, res)
    {   
        const email = req.body.email
        const password = req.body.password

        const user = await User.findOne({email: email})

        if(!user)
        {
            req.flash('message', 'Usuario invalido')

            res.render('pages/user/login')
            return 
        }

        if(user.password !== password)
        {
            req.flash('message', 'Senha invalida')
            res.render('pages/user/login')
            return
        }

        req.session.userid = user._id
        
        req.session.save( ()=>{
            res.redirect('/')
            return
        })
        
    }

    static createUser(req, res)
    {
        const name = req.body.name
        const email = req.body.email
        const password = req.body.password

        const user = new User({name, email, password})

        user.save()

        req.session.userid = user._id
        req.session.save( ()=>{  
            req.flash('message', 'Usuario registrado com sucesso')
            res.redirect('/')
        })

    }

    static async editUser(req, res)
    {
        const {id, name, email, password, confirmpassword } = req.body
        const user = {
            _id: id,
            name,
            email,
            password
        }

        try
        {
            await User.updateOne({_id: user._id}, user)

            req.flash('message', 'Usuario alterado com sucesso!')
            res.redirect('/user/edit')
            return
        }
        catch(error)
        {
            console.log(error)
        }

    }

    static logout(req, res)
    {
        req.session.destroy()
        res.redirect('/')
    }

}