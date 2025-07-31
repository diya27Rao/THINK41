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
        const query = 'INSERT INTO products (id, name, category, price, stock) VALUES ?';
        connection.query(query, [products], (err, result) => {
            if (err) throw err ;
                
                console.log(`Inserted ${result.affectedRows} rows`);
            
            connection.end();
        });
    })