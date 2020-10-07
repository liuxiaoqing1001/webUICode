$(function(){
    var aStr = sessionStorage.getItem("currentNews") ;
    if(aStr == '' || aStr == null) {
        window.close() ;
        return ;
    }
    var aObj = JSON.parse(aStr) ;
    sessionStorage.removeItem("currentNews") ;
    console.log(aObj) ;
    $(".showtitle").html(aObj.title) ;
    $(".showdate").text(aObj.pubdatetime) ;
    $(".showcontent").html(aObj.content) ;
})
