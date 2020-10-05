// 从localStorage取出登录者信息
loginStr = localStorage.getItem("loginuser") ;
if (null == loginStr || loginStr == '') {
    location.href="../Login.html" ;
}
// 将localStorage取出字符串转换js对象
loginUser = JSON.parse(loginStr) ;

$(function(){
    $("#sysTable").bootstrapTable({
        url : serverPath + 'sysuser/getAll' ,
        method : 'get' ,
        toolbar : '#toolbar' ,   // 为表格绑定工具栏
        striped: true,			// 显示为斑马线格式，奇偶行不通背景色

        showRefresh: "true",	// 显示刷新按钮
        showToggle: "true",		// 显示格式切换按钮
        showColumns: "true",	// 显示列过滤按钮
        columns : [
            /* {checkbox : true} ,   // 显示为复选框*/
            {field : 'id' , title : 'id'} ,
            {field : 'name' , title : '账号' } ,
            {field : 'role' , title : '角色' } ,
            {field : 'regDate' , title : '创建日期' } ,
            {field : 'state' , title : '是否删除' ,
                formatter : function(value , row , index){   // 对该列值进行加工处理
                    return  value==0 ? '否' : '是' ;
                }
            } ,
            {
                title : '删除管理员' ,
                formatter: delShow,
                events: delFun ,
            }

        ] ,
    });

    // 添加管理员按钮动作
    $("#addSysuserBtn").click(function () {
        $.post(
            serverPath + "sysuser/add" ,
            $("#addSysuserForm").serialize() ,
            function(responseData) {
                bootbox.alert(responseData.errMsg) ;
                if(0 == responseData.errCode) {
                    $("#sysTable").bootstrapTable('refresh') ;
                    // 清空表单数据
                    $("#addSysuserForm")[0].reset() ;
                    // 关闭模态框
                    $("#addWindow").modal("hide") ;
                }
            }
        );
    });
    // 取消添加管理员按钮动作
    $("#resetSysuserBtn").click(function(){
        $("#addSysuserForm")[0].reset() ;
        $("#addWindow").modal("hide") ;
    });


    // 请求所有有效角色
    $.get(
        serverPath + "role/getall" ,
        function(responseData) {
            var all = responseData.data ;
            var str = "" ;
            $.each(all , function(index , item){
                str += '<option>' + item.role + '</option>' ;
            }) ;
            $("#role").html(str) ;
        }
    )
})

function delShow(value, row, index) {
    if(row.state == 0 && row.name != loginUser.name) {
        var del = '<button  type="button" class="remove btn btn-xs btn-danger">' +
            '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>删除' +
            '</button>';
        return del;
    }
}
window.delFun = {
    // click表示绑定click动作，   .remove 表示为class是remove的元素绑定事件 【注意中间的空格】
    'click .remove' : function(e , value , row , index) {
        // 删除逻辑处理
        bootbox.confirm("确认删除?" , function(data){
            if(data) {
                $.post(
                    serverPath + "sysuser/del" ,
                    'id=' + row.id ,
                    function(responseData) {
                        bootbox.alert(responseData.errMsg) ;
                        if(0 == responseData.errCode) {
                            // 表格刷新
                            $("#sysTable").bootstrapTable('refresh') ;
                        }
                    }
                );
            }
        }) ;
    }
}
