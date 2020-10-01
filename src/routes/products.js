const express = require("express");
const router = express.Router();

const pool = require("../database");

router.get("/add", (req, res) => {
	res.render("products/add");
});

router.post("/add", async (req, res) => {
	console.log(req.body);
	const { titulo, img, descripcion, precio, cantidad, cat_id } = req.body;
	let datos = {
		titulo,
		img,
		descripcion,
		precio,
		cantidad,
		cat_id,
	};

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

	await pool.query("INSERT INTO productos set ?", [datos]);
	req.flash("success", "Productos Agregados");
	
});

router.get('/', async (req, res) => {
	const product = await pool.query('SELECT * FROM productos');
	res.render('products/productos', { product });
});

module.exports = router;