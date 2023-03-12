const Product = require('../models/Product')
const flash = require('express-flash')

module.exports = 
class ProductController {
    static async showProducts(req, res)
    {   
        const products = await Product.find().lean()
        res.render('pages/product/products', {products})
    }   

    static async showProductsDestined(req, res)
    {   
        const param = req.params.param
        const products = await Product.find({destined: param}).lean()
      
        res.render('pages/product/products', {products})
    }
    static createProduct(req, res)
    {
        res.render('pages/product/create')
    }
    static async showEditProduct(req, res)
    {
        const id = req.params.id

        const product = await Product.findById({_id: id }).lean()

        if(product.destined == 1)
        {
            product.masc = true
        }
        else if(product.destined == 2)
        {
            product.femi = true
        }
        else if(product.destined == 3)
        {
            product.chil = true
        }
        else if(product.destined == 4)
        {
            product.outh = true
        }

        res.render('pages/product/edit', {product})
    }

    static async showDetails(req, res)
    {
        const id = req.params.id

        const product = await Product.findById(id).lean()

        res.render('pages/product/details', {product})
    }

    static async createProductPost(req, res)
    {
        const userid = req.body.userid
        const name = req.body.name
        const description = req.body.description
        const price = req.body.price
        const image = req.body.image
        const destined = req.body.destined

        const product = new Product({name, description, price, image, destined, userid})

        await product.save()

        res.redirect('/products') 
        return
        
    }

    static async editProductPost(req, res)
    {
        const id = req.body.id
        const {name, description, price, image, destined} = req.body

        const product = {
            name, description, price, image, destined
        }

        await Product.updateOne({_id: id}, product).lean()
        req.flash('message','Produto e ditado com sucesso')
        res.redirect('/user/dashboard')

    }

    static async deleteProduct(req, res)
    {
        const id = req.params.id
        
        await Product.deleteOne({_id: id })
        res.redirect('/user/dashboard')
        
    }
}