var express = require('express');
var app = express();

const { shopdb } = require("./db");

app.set('view engine', 'ejs');

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', function(req, res) {

    const customer = shopdb.prepare(`SELECT * FROM customer `).all()
    res.render('index' , {customer});
});

app.get('/getcustomer/:id', function(req, res) {

    const id = req.params.id

    const customer = shopdb.prepare(`SELECT * FROM customer WHERE id=?`).all(id)

    const products = shopdb.prepare(`SELECT * FROM products`).all()

    const sales = shopdb.prepare(`SELECT * FROM sales WHERE customerid = ?`).all(id)



    console.log(products);

    res.render('partials/customer' , {customer:customer[0] , products ,sales});
});




app.post('/specs', function(req, res) {
    const {product } =req.body

    console.log(req.body);
    res.render('partials/table.ejs' , {product})
});
app.post('/productssave', function(req, res) {

    const{code , desc ,  qty , rate , amount , dis , discount ,id} = req.body

    shopdb.prepare(`DELETE FROM sales WHERE customerid = ?`).run(id)
    if (Array.isArray(code)) {
        code.forEach((element ,index) => {
            shopdb.prepare(`INSERT INTO sales (code , desc , qty ,rate ,amount , dis , discount , customerid) VALUES (? , ? ,?,?,?,?,?,? )`)
            .run(code[index] , desc[index] , qty[index] , rate[index] , amount[index] , dis[index] , discount[index] , id)
        });
    }else{
        shopdb.prepare(`INSERT INTO sales (code , desc , qty ,rate ,amount , dis , discount, customerid) VALUES (? , ? ,?,?,?,?,?,? )`)
        .run(code , desc , qty , rate , amount , dis , discount , id)
    }





  
});

app.post('/addcustomer', function(req, res) {
    const {code , name , contact , email , dob , age,head,address,city,pincode  } =req.body

    shopdb.prepare(`INSERT INTO customer (name , contact , email , dob , age,familyhead,address,city,pincode ) VALUES (?,?,?,?,?,?,?,?,?)`)
    .run( name , contact , email , dob , age,head,address,city,pincode)

    const id = shopdb.prepare(`SELECT * FROM customer WHERE contact=?`).all(contact)

    console.log(req.body);
    res.redirect(`getcustomer/${id[0].id}`)
});

app.post('/sendmessage', async function(req, res) {
    const {number , message } =req.body

    console.log(number , message);
    try {
    


        const apiUrl = 'https://wapi.kamingo.in/send-message'; // Replace with the actual API URL
    
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ number: number, message: message }),
        });
    
    
    
        if (response.ok) {
          const responseData = await response.json();
          console.log('API Response:', responseData);
    
        } else {
          console.error('API Error:', response);
          // Send a JSON response with status 'error'
        }
      } catch (error) {
        console.error('Error:', error);
    
      }

      res.send(`sent! ✅`)

});

app.post('/makebill', async function(req, res) {
  const { customerid,value , dis , discount , vat , reason , otherCharges , balanceAmount , advance , mode , netAmount , dueDate , dueTime } =req.body

  const customer =  shopdb.prepare(`SELECT * FROM customer WHERE id=?`).all(customerid)
  const sales =  shopdb.prepare(`SELECT * FROM sales WHERE customerid=?`).all(customerid)

console.log(customer);
  const bill = {
    value: value,
    dis: dis,
    discount: discount,
    vat: vat,
    reason: reason,
    otherCharges: otherCharges,
    balanceAmount: balanceAmount,
    advance: advance,
    mode: mode,
    netAmount: netAmount,
    dueDate: dueDate,
    dueTime: dueTime
  };
  


  console.log(req.body);
  res.render('partials/billing/invoice' , {bill , customer:customer[0] , sales })

});


app.listen(8080,()=>{
    console.log("http://localhost:8080");
});