const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Permitir CORS para Angular
app.use(cors({
    origin: 'http://localhost:4200', // Replace with your Angular app's port
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());

// Conectar a la base de datos MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root", // Cambia esto si tienes otro usuario
    password: "",
    database: "idealista"
});

db.connect(err => {
    if (err) {
        console.error("Error al conectar a MySQL:", err);
        return;
    }
    console.log("Conectado a MySQL");
});

// ========= END POINTS =========================================================


// ===   CONSULTAS =============================================================
// Endpoint para obtener datos de barrios (con filtro por municipio opcional)
app.get("/api/barrios", (req, res) => {
    const param_municipio = parseInt(req.query.municipio, 10);

    if (req.query.municipio && isNaN(param_municipio)) {
        console.error("El valor del municipio no es un número válido");
        res.status(400).send("El valor del municipio debe ser un número entero");
        return;
    }

    let query = "SELECT * FROM barrio";
    let queryParams = [];

    if (param_municipio) {
        query += " WHERE municipios_idmunicipios = ?";
        queryParams.push(param_municipio);
    }

    db.query(query, queryParams, (err, results) => {
        if (err) {
            console.error("Error en la consulta:", err);
            res.status(500).send("Error en el servidor");
            return;
        }
        res.json(results);
    });
});

// Endpoint para obtener datos de viviendas (con filtro por barrio opcional)
app.get("/api/viviendas", (req, res) => {
    const param_barrio = parseInt(req.query.barrio, 10);

    if (req.query.barrio && isNaN(param_barrio)) {
        console.error("El valor del barrio no es un número válido");
        res.status(400).send("El valor del barrio debe ser un número entero");
        return;
    }

    let query = "SELECT * FROM vivienda";
    let queryParams = [];

    if (param_barrio) {
        query += " WHERE Barrio_idBarrio = ?";
        queryParams.push(param_barrio);
    }

    db.query(query, queryParams, (err, results) => {
        if (err) {
            console.error("Error en la consulta:", err);
            res.status(500).send("Error en el servidor");
            return;
        }
        res.json(results);
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});