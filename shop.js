var express = require('express');
var app = express();

const { shopdb } = require("./db");

app.set('view engine', 'ejs');

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', function(req, res) {


    res.render('index' , {});
});

app.get('/getcustomer/:id', function(req, res) {

    const id = req.params.id

    const customer = shopdb.prepare(`SELECT * FROM customer WHERE id=?`).all(id)

    const products = shopdb.prepare(`SELECT * FROM products`).all()
    console.log(products);

    res.render('partials/customer' , {customer:customer[0] , products});
});




app.post('/specs', function(req, res) {
    const {product } =req.body

    console.log(req.body);
    res.render('partials/table.ejs' , {product})
});
app.post('/productssave', function(req, res) {

    const{code , desc ,  qty , rate , amount , dis , discount } = req.body

    
    if (Array.isArray(code)) {
        code.forEach((element ,index) => {
            shopdb.prepare(`INSERT INTO sales (code , desc , qty ,rate ,amount , dis , discount) VALUES (? , ? ,?,?,?,?,? )`)
            .run(code[index] , desc[index] , qty[index] , rate[index] , amount[index] , dis[index] , discount[index])
        });
    }else{
        shopdb.prepare(`INSERT INTO sales (code , desc , qty ,rate ,amount , dis , discount) VALUES (? , ? ,?,?,?,?,? )`)
        .run(code , desc , qty , rate , amount , dis , discount)
    }





    res.redirect('/')
});




app.listen(8080,()=>{
    console.log("http://localhost:8080");
});