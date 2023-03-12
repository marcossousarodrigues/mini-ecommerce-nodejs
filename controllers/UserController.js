const User = require('../models/User')
const Product = require('../models/Product')
const flash = require('express-flash')
const bcrypt = require('bcryptjs');

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
        const userid = req.session.userid
        const products = await Product.find({userid: userid}).lean()
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
        
        const isPassword = await bcrypt.compare(password, user.password).then( (res) =>{
            return res
        })

        if(!isPassword)
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

    static async createUser(req, res)
    {
        const name = req.body.name
        const email = req.body.email
        const password = req.body.password
        const confirmpassword = req.body.confirmpassword

        const findUser = await User.find({email: email}).lean()
        

        if(name == '')
        {
            req.flash('message', 'O campo nome é obrigatorio!')
            res.render('pages/user/create')
            return
        }
        else if(email === '')
        {
            req.flash('message', 'O campo email é obrigatorio!')
            res.render('pages/user/create')
            return
        }
        else if (findUser.length > 0)
        {
            req.flash('message', 'Email já cadastrado!')
            res.render('pages/user/create')
            return
        }
        else if (password == '')
        {
            req.flash('message', 'O campo senha é obrigatorio!')
            res.render('pages/user/create')
            return
        }
        else if(password !== confirmpassword)
        {
            req.flash('message', 'As senhas não conferem!')
            res.render('pages/user/create')
            return
        }

        try
        {   
           
            const salt = bcrypt.genSaltSync(10);
            const bcryPassword = bcrypt.hashSync(password, salt);

            const user = new User({name, email, password: bcryPassword})

            user.save()
    
            req.session.userid = user._id
            req.session.save( ()=>{  
                req.flash('message', 'Usuario registrado com sucesso')
                res.redirect('/user/dashboard')
            })
    
        }
        catch(error)
        {
            console.log('erro', error)
        }
      
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