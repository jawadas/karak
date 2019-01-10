$(document).ready(function () {
    $('#pickyDate').datepicker({
        format: "dd/mm/yyyy",  
        todayHighlight:'TRUE',
        autoclose: true
    }).on('changeDate', function (ev) {
$(this).datepicker('hide');
})
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; 
var yyyy = today.getFullYear();
yyyy = parseInt(yyyy)  ;
today = dd+'/'+mm+'/'+yyyy;
document.getElementById("pickyDate").value = today;
});
