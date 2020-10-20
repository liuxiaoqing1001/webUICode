var timerHander ;
$(function(){
    timerHander = setInterval(function(){
        $("#showLoginTime").text(getDateStr(new Date())) ;
    }, 1000) ;
})

window.onunload = function() {
    clearInterval(timerHander) ;
}