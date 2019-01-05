
var mysql      = require('mysql');
var express = require("express");
var app     = express();
var path    = require("path");
var bodyParser = require('body-parser');
var dateFormat = require('dateFormat');
app.use('/img',express.static(path.join(__dirname, 'images')));
app.use('/js',express.static(path.join(__dirname, 'js')));
app.use('/css',express.static(path.join(__dirname, 'css')));
app.use(bodyParser.json());
app.set('views', path.join(__dirname,'views'));
app.set('view engine' , 'pug');



var connection = mysql.createConnection({
    host:'myshop.ci4gwurifubp.eu-west-2.rds.amazonaws.com',
    user:'jawadas',
    password:'3li#CODIT',
    database:'shopdb',
    port: '3306',

 });

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
  //__dirname : It will resolve to your project folder.
});

app.get('/AddReceipt.html',function(req,res){
  res.sendFile(path.join(__dirname+'/AddReceipt.html'));
  //__dirname : It will resolve to your project folder.
    


});

app.use(bodyParser.urlencoded({
  extended: false
}));

app.get('/dailyReceipts',function(req,res){
var sql = "select date,type,price from shopdb.receipts";
var receiptlist = [];
  connection.query(sql, function (err, rows, fields) {
    if (err) throw err;
    for(i=0;i<rows.length;i++)
    {
    var receipt = {
      'date':rows[i].date,
      'type':rows[i].type,
      'price':rows[i].price
    }
    console.log(receipt);
    receiptlist.push(receipt);
  }

    // Add object into array
   

    res.render('displayReceipts',{
      receiptlist: receiptlist
      });
});


});

app.post('/submit',function(req,res){


  var date1 = new Date(req.body.pickyDate); 
  var date_ =new Date(Date.parse(date1));
  var date = dateFormat(date_, "yyyy-mm-dd" );


  var price = req.body.price;
  var type = req.body.type;
  var payment_type = req.body.payment_type;

   var sql = "insert into shopdb.receipts (date,price,type,payment_type) Values ('"+  date+ "', '" + price + "', '" + type + "', '" + payment_type + "')";

   
   console.log(type);
   console.log(sql);
    // connection.query(sql, function (err, result, fields) {
    //   if (err) throw err;
    //     });     


  res.render('displaySave',{
    });

});

app.listen(3000);

console.log("Running at Port 3000");

