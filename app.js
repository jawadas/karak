
var mysql      = require('mysql');
var express = require("express");
var app     = express();
var path    = require("path");
var moment = require('moment');
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
    multipleStatements: true

 });

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
  //__dirname : It will resolve to your project folder.
});

app.get('/AddReceipt.html',function(req,res){
  res.sendFile(path.join(__dirname+'/AddReceipt.html'));
  //__dirname : It will resolve to your project folder.
});

app.get('/EndPeriod',function(req,res){
  res.sendFile(path.join(__dirname+'/EndPeriod.html'));
  //__dirname : It will resolve to your project folder.
});

app.use(bodyParser.urlencoded({
  extended: false
}));

app.get('/dailyReceipts',function(req,res){
  var today = new Date();
 
  var date = moment(today,('DD/MM/YYYY')).format('YYYY-MM-DD');
  console.log(date);
var sql = "select date,type,price,payment_type from shopdb.receipts where date =?"
var sql2= "select sales_total,sales_system from shopdb.sales where sales_date ='" +date +"'";

var receiptlist = [];
var sum_price =0;
var total_system = 0;
var total_cash = 0;

  connection.query(sql, date, function (err, rows, fields) {
   
    if (err) throw err;
    
    for(i=0;i<rows.length;i++)
    {
      var javaDate = [];
      var new_date = [];
      javaDate[i] = new Date(rows[i].date);
      new_date[i] = (javaDate[i].getFullYear() + '/' + (javaDate[i].getMonth() + 1) + '/' +javaDate[i].getDate() );
      sum_price = sum_price + rows[i].price


    var receipt = {
      'date':new_date[i],
      'type':rows[i].type,
      'price':rows[i].price,
      'payment_type':rows[i].payment_type
    }
  // console.log(receipt);
    receiptlist.push(receipt);      
  }
  connection.query(sql2, function (err, result, fields) {
    if (err) throw err;
    for(i=0;i<result.length;i++)
    {
     total_cash +=result[i].sales_total;
     total_system +=result[i].sales_system;
    }
      //console.log(total);
      // ----Add object into array----
  res.render('displayReceipts',{
  receiptlist: receiptlist,
  sum_price: sum_price,
  total_sales: total_system,
  total_cash: total_cash
  });
//--------
      });  



});

});

app.post('/submit',function(req,res){

var date = moment(req.body.pickyDate,('DD/MM/YYYY')).format('YYYY-MM-DD');
  //console.log(date);

  var price = req.body.price;
  var type = req.body.type;
  var payment_type = req.body.payment_type;

   var sql = "insert into shopdb.receipts (date,price,type,payment_type) Values (?,?,?,?)";

   
   //console.log(type);
   //console.log(sql);
    connection.query(sql, [date,price,type,payment_type], function (err, result, fields) {
      if (err) throw err;
        });     


  res.render('displaySave',{
    });

});

app.post('/SubmitEndPeriod',function(req,res){

    var sales_date = moment(req.body.pickyDate,('DD/MM/YYYY')).format('YYYY-MM-DD');
    //console.log(date);
    var sales_period = req.body.period;
    var sales_system = req.body.sales_system;
    var total_sales = req.body.total_sales;
  
  
     var sql2 = "insert into shopdb.sales (sales_date,sales_period,sales_system,sales_total) Values (?,?,?,?)";
  
     
     //console.log(type);
     console.log(sql2);
      connection.query(sql2, [sales_date,sales_period,sales_system,total_sales], function (err, result, fields) {
        if (err) throw err;
          });     
  
  
    res.render('displaySave',{
      });
  
  });

app.listen(3000);

console.log("Running at Port 3000");

