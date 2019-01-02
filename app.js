
var mysql      = require('mysql');
var express = require("express");
var app     = express();
var path    = require("path");
var bodyParser = require('body-parser');
app.use('/img',express.static(path.join(__dirname, 'images')));
app.use('/js',express.static(path.join(__dirname, 'js')));
app.use('/css',express.static(path.join(__dirname, 'css')));
app.use(bodyParser.json());


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
var sql = "select type from shopdb.receipts";
connection.connect(function(err) {
  if (err) throw err;
  connection.query(sql, function (err, rows, fields) {
    if (err) throw err;
    str='';
    for(i=0;i<rows.length;i++)
    str = str + rows[i].type +'\n';
    res.write(str);
     res.end( str);
     

      });
      connection.end(); 

      //res.write(rows);   
});
});

app.post('/submit',function(req,res){
   var type = req.body.payment_type;
   var name = req.body.type;
   var sql = "insert into shopdb.receipts (receiptid,type,sellerName) Values ('1001', '"+ type  + "', '" + name + "',)";
   console.log(type);
   console.log(sql);
  connection.connect(function(err) {
    if (err) throw err;
    connection.query(sql, function (err, result, fields) {
      if (err) throw err;
     console.log(result);
        });     
  });
  connection.end(); 

  res.write('<html lang="ar">');
  res.write('<body>');
  res.write('<h1>Data Saved!</h1>');
  res.write(req.body.date);
  res.write('</body>');
  res.write('</html>');
  res.end();

});

app.listen(3000);

console.log("Running at Port 3000");

