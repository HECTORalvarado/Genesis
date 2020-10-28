const express = require("express");
const router = express.Router();

const pool = require("../database");

router.get("/add", (req, res) => {
	res.render("products/add");
});

router.post("/add", async (req, res) => {
	let datos = req.body;
	if ( datos.search ) {
		const product = await pool.query('SELECT * FROM productos WHERE titulo like ?', '%'+datos.search+'%');
		res.render('products/productos', { product });
	} else {
		/* let datos = {
			titulo,
			img,
			descripcion,
			precio,
			cantidad,
			cat_id,
		}; */
		/* Cambia de categoria a id para que se guarde en la DB */
		switch (datos.cat_id) {
			case "calzado_dama":
				datos.cat_id = 1;
				break;
			case "calzado_caballero":
				datos.cat_id = 2;
				break;
			case "calzado_niño":
				datos.cat_id = 3;
				break;
			case "cristaleria":
				datos.cat_id = 4;
				break;
			case "ropa_cama":
				datos.cat_id = 5;
				break;
			case "jugetes":
				datos.cat_id = 6;
				break;
			case "ropa_niño":
				datos.cat_id = 7;
				break;
			case "ropa_dama":
				datos.cat_id = 8;
				break;
			case "ropa_caballero":
				datos.cat_id = 9;
				break;
			default:
				res.send("not work it");
				break;
		}
		/* Agrega un producto a la DB */
		await pool.query("INSERT INTO productos set ?", [datos]);
		console.log([datos]);
		req.flash("success", "Productos Agregados");
		res.render('products/productos');
	}
});
/* Muestra los productos disponibles */
router.get('/', async (req, res) => {
	let product = await pool.query('SELECT * FROM productos');
	for (let index = 0; index < Object.keys(product).length; index++) {
		product[index].precioCent = product[index].precio * 100;
	}

	res.render('products/productos', { product });
});

module.exports = router;