var timerHander ;

// 从sessionStorage取出登录者信息
var userObj = new Object() ;
var str = sessionStorage.getItem("loginuser") ;

// 未登录用户不允许访问该页
if(str == null || str == undefined || str == "") {
    location.href="login.html" ;
}

$(function(){
    // 登录用户,取出登录者信息
    if(str != null || str != "" || str != undefined) {
        userObj = JSON.parse(str) ;
    }

    if(userObj.photourl != null && userObj.photourl != '') {
        $("#showLoginPhoto").attr("src" ,userObj.photourl) ;
    }

    if(null != userObj) {
        $("#showLoginUser").text(userObj.name);
    } else {
        $("#showLoginUser").text('未登录');
    }

    // 注销按钮动作


    // treeview设置
    // $.getJSON(url , 回调函数) 是使用ajax的get请求方式，请求结果是一个json字符串
    //json/menu.json    中换菜单
    $.getJSON('json/menu.json', function (data) {
        $("#tree").treeview({
            data: data,
            selectedIcon: "glyphicon glyphicon-menu-right",
            selectedBackColor: '#FF7F24',
            collapseIcon : '' ,  // 子项展开时去掉前面默认的 + 图标
            expandIcon : '' ,    // 子项未展开时去掉前面默认 + 图标
            onNodeSelected: function (event, data) {
                var navHtml = '' ;
                if(data.text.indexOf('首页') >= 0) {
                    navHtml = "<li>首页</li>" ;
                } else {
                    // 根据当前选中节点的父节点
                    var parent = $("#tree").treeview("getNode", data.parentId);
                    navHtml = "<li>" + parent.text + "</li>" +
                        "<li>" + data.text + "</li>" ;
                }
                $("#breadcrumb").html(navHtml);
                $("#contentFrame").attr("src", data.href);
            }
        })
    })

    timerHander = setInterval(function(){
        $("#showLoginTime").text(getDateStr(new Date())) ;
    }, 1000) ;
})
window.onunload = function() {
    clearInterval(timerHander) ;
}
