$(function(){
    $("#btnLoginSure").click(function() {
        // 表单验证
        var formV = $("#loginForm").serialize() ;
        console.log(formV) ;
        // 以ajax方式提交表单
        location.href="page/main.html" ;
    })
})