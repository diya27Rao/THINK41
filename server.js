const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
 
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ecom'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

app.get('/products', (req, res) => {
    const sql = "SELECT * FROM products";
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching products:', err.message);
            return res.status(500).send('Internal Server Error');
        }
        res.json(results);
    });
});

app.get('/api/products/:id', (req, res) => {
    const productId = req.params.id;
    const sql = "SELECT * FROM products WHERE id = ?";
    db.query(sql, [productId], (err, results) => {
        if (err) {
            console.error('Error fetching product:', err.message);
            return res.status(500).send('Internal Server Error');
        }
        if (results.length === 0) {
            return res.status(404).send('Product not found');
        }
        res.status(200).json(results[0]);
    });
}); 

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
