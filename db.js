const Database = require('better-sqlite3');

const shopdb = new Database('../database/shop/shopdb.db');
// const scriptsdb = new Database('../database/kadmin/scriptsdb.db');

shopdb.exec(`
  CREATE TABLE IF NOT EXISTS customer (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    contact INTEGER,
    dob INTEGER,
    age INTEGER,
    familyhead TEXT,
    address TEXT,
    city TEXT,
    pincode INTEGER
  )
`
);
shopdb.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code INTEGER,
    desc TEXT,
    rate NUMERIC,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`
);
shopdb.exec(`
  CREATE TABLE IF NOT EXISTS sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code INTEGER,
    desc TEXT,
    qty INTEGER,
    rate NUMERIC,
    amount NUMERIC,
    dis NUMERIC,
    discount NUMERIC,
    customerid INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`
);


// scriptsdb.exec(`
//   CREATE TABLE IF NOT EXISTS scripts (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     user TEXT,
//     name TEXT,
//     script TEXT,
//     timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
//   )
// `);

console.log('Connected to the database');

module.exports = { shopdb };
