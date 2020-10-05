$(function(){
    var aStr = sessionStorage.getItem("currentActivity") ;
    if(aStr == '' || aStr == null) {
        window.close() ;
        return ;
    }
    var aObj = JSON.parse(aStr) ;
    sessionStorage.removeItem("currentActivity") ;
    console.log(aObj) ;
    $(".showtitle").html(aObj.title) ;
    $(".showdate").text(aObj.date) ;
    $(".showcontent").html(aObj.content) ;
})
