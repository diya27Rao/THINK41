const fs=require('fs');
const mysql = require('mysql2');
const csv = require('csv-parser');

const connection = mysql.createConnection({
    host: 'localhost',  
    user: 'root',
    password:'',
    database: 'ecom'
});
const filePath = 'D:\\exam\\products.csv';
const products = [];
 fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
        products.push([
            parseInt(row.id),
            row.name,
            row.category,
            isNaN(parseFloat(row.price)) ? 0 : parseFloat(row.price),
            isNaN(parseInt(row.stock)) ? 0 : parseInt(row.stock),
        ]);
            
        
    })
    .on('end', () => {
        // Remove duplicate IDs
        const uniqueProducts = [];
        const seenIds = new Set();
        products.forEach(product => {
            if (!seenIds.has(product[0])) {
                uniqueProducts.push(product);
                seenIds.add(product[0]);
            }
        });
        const query = 'INSERT INTO products (id, name, category, price, stock) VALUES ? ON DUPLICATE KEY UPDATE name=VALUES(name), category=VALUES(category), price=VALUES(price), stock=VALUES(stock)';
        connection.query(query, [uniqueProducts], (err, result) => {
            if (err) throw err;
            console.log(`Inserted ${result.affectedRows} rows`);
            connection.end();
        });
    })