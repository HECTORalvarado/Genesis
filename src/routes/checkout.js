const express = require("express");
const pool = require("../database");
const router = express.Router();
const stripe = require('stripe')('sk_test_51HfVBhHeZ8a6bHaCizPDE6eZxE0zNftnGU9pD4gOgOJu3QWHb7lSvQ7OthFgOE2zaPfctI8Gh4RsP7cSZ3sQDQzA00rxYBr1s9');

router.post('/checkout', async (req, res)=> {

    const customer = await stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
    });
    
    const product = await pool.query('select * from productos where id = ?', req.body.id);
    const precio = product[0].precio * 100;
    const usuario = req.user.username;
    const user = await pool.query("select id from usuario where username = ?", usuario);
    
    arr = {
        id_orden: req.body.stripeToken,
        id_product: req.body.id,
        cantidad: 1,
        id_usuario: user[0].id
    };
    await pool.query('insert into detalle_orden set ?', [arr]);
    const charge = await stripe.charges.create({
        amount: precio,
        currency: 'usd',
        customer: customer.id,
        description: product[0].descripcion
    });
    
    req.flash('success', 'Gracias por su compra :D');
    res.render('success');
});

module.exports = router;