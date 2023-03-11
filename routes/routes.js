const router = require('express').Router()
const ProductController = require('../controllers/ProductController')
const UserController = require('../controllers/UserController')


router.get('/products', ProductController.showProducts)
router.get('/product/create', ProductController.createProduct)
router.get('/product/edit/:id', ProductController.showEditProduct)
router.get('/product/delete/:id', ProductController.deleteProduct)
router.get('/product/:param', ProductController.showProductsDestined)
router.get('/product/details/:id', ProductController.showDetails)

router.get('/user/register', UserController.showCreateUser)
router.get('/user/login', UserController.showLoginUser)
router.get('/user/edit', UserController.showEdit)

router.get('/user/dashboard', UserController.dashboard)


router.get('/user/logout', UserController.logout)

router.get('/', ProductController.showProducts)

// Rotas Post

router.post('/product/create', ProductController.createProductPost)
router.post('/user/register', UserController.createUser)
router.post('/user/login', UserController.loginUser)
router.post('/user/edit', UserController.editUser)


module.exports = router