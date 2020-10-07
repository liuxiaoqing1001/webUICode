// 从localStorage取出登录者信息
loginStr = sessionStorage.getItem("loginuser") ;
if (null == loginStr || loginStr == '') {
    location.href="../login.html" ;
}
loginUser = JSON.parse(loginStr) ;

$(function(){
    $("#empTable").bootstrapTable({
        url : serverPath + 'employee/pageData' ,
        method : 'GET' ,
        toolbar : '#toolbar' ,   // 为表格绑定工具栏
        striped: true,			// 显示为斑马线格式，奇偶行不通背景色

        showRefresh: "true",	// 显示刷新按钮
        showToggle: "true",		// 显示格式切换按钮
        showColumns: "true",	// 显示列过滤按钮

        // 分页相关 ，如果分页，服務器端返回的数据需要包含有total属性和rows属性
        pagination: true,		// 显示分页
        pageNumber: 1,			// 初始化加载第一页
        pageSize: 5,			// 每页5条数据
        pageList: [3, 5, 10],	// 可以选择的每页数量
        sidePagination: "server", //表示服务端请求分页数据

        queryParamsType: "undefined",  // undefined：提交到服务器端的参数自定义
        queryParams: function(params) {
            // 参数params中自带 pageSize , pageNumber , sortName , sortOrder

            params.nameKey = $.trim($("#search_uname").val()) ;
            params.mobileKey = $.trim($("#search_mobile").val()) ;
            params.gender = $('#formSearch input[name="gender"]:checked').val() ;

            var state = $('#formSearch input[name="state"]:checked').val() ;
            if("-1" != state) {
                params.state = $('#formSearch input[name="state"]:checked').val() ;
            }
            var role = $('#formSearch input[name="role"]:checked').val() ;
            if("-1" != role) {
                params.role = $('#formSearch input[name="role"]:checked').val() ;
            }
            console.dir(params) ;
            return params ;
        },

        columns : [
            /* {checkbox : true} ,   // 显示为复选框*/
            {field : 'id' , title : 'id' , visible : false} ,
            {field:'tid' , title : '编号' , visible:false } ,
            {field : 'tname' , title : '姓名' ,formatter : function(value , row , index){
                    return  '<span class="showDetail" style="color:blue; cursor: pointer; ">'+ value +'</span>';
                },events: updateEvent , } ,
            {field : 'gender' , title : '性别' } ,
            {field : 'mobile' , title : '联系电话'} ,
            {field : 'role' , title : '角色' , formatter : function(value , row , index){
                    return  value==0 ? '教工' : '职工' ;
                } } ,
            {field : 'hiredate' , title : '入职日期' } ,
            {field : 'state' , title : '状态' , formatter : function(value , row , index){
                    switch(value) {
                        case 0 :  return '正式' ;
                        case 1 : return '离职 - '+ row.departure ;
                        case 2 : return '试用' ;
                    }
                } } ,

            {
                title : '操作' ,
                formatter: operateFormatter,
                events: operateEvent ,
            }

        ] ,
    });


    // 搜索按钮动作
    $("#btn_query").click(function(){
        $("#empTable").bootstrapTable('refresh') ;
    });

    // 添加员工按钮动作
    $("#btn_addSure").click(function () {
        $.post(
            serverPath + "employee/add" ,
            $("#addForm").serialize() ,
            function(responseData) {
                bootbox.alert(responseData.errMsg) ;
                if(0 == responseData.errCode) {
                    $("#empTable").bootstrapTable('refresh') ;
                    // 清空表单数据
                    $("#addForm")[0].reset() ;
                    $("#addPhoto").attr('src' , '../assets/img/userphoto_default.jpg') ;
                    // 关闭模态框
                    $("#addWindow").modal("hide") ;
                }
            }
        );
    });
    // 取消添加管理员按钮动作
    $("#btn_addCancel").click(function(){
        $("#addForm")[0].reset() ;
        $("#addPhoto").attr('src' , '../assets/img/userphoto_default.jpg') ;
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

    // 显示详情模态框中“更新”按钮动作
    $("#btn_detailSure").click(function(){
        localStorage.removeItem('currentEId') ;
        $.post(
            serverPath + "employee/update" ,
            $("#detailForm").serialize() ,
            function(resData) {
                bootbox.alert(resData.errMsg) ;
                if(0 == resData.errCode) {
                    $("#empTable").bootstrapTable('refresh') ;
                    // 清空表单数据
                    $("#detailForm")[0].reset() ;
                    // 清空头像显示
                    $("#showPhoto").removeAttr('src') ;
                    // 关闭模态框
                    $("#detailWindow").modal("hide") ;
                }
            }
        );
    });
    // 显示详情模态框中“取消”按钮动作
    $("#btn_detailCancel").click(function(){
        localStorage.removeItem('currentEId') ;
        $("#detailForm")[0].reset() ;
        // 清空头像显示
        $("#showPhoto").removeAttr('src') ;
        $("#detailWindow").modal("hide") ;
    });

    // 更新头像图片被点击
    $("#imgUpdate").click(function(){
        var updatePhoto = new PhotoInput() ;
        updatePhoto.init("userphoto" ,serverPath + "employee/uploadPhoto?id=" + $("#showId").val() , "modalUpdatePhoto" , "imgUpdate")

    });

    // 日历控件初始化
    $('#addBirthDatetimepicker').datetimepicker({
        format: 'yyyy年mm月dd日',
        autoclose: 1,//选择后自动关闭
        startView: 'month',
        minView:'month',
        maxView:'decade',
        language:'zh-CN'
    });
    $('#addHiredateDatetimepicker').datetimepicker({
        format: 'yyyy年mm月dd日',
        autoclose: 1,//选择后自动关闭
        startView: 'month',
        minView:'month',
        maxView:'decade',
        language:'zh-CN'
    });

    // 新增员工，头像FileInput初始化
    var addPhoto = new PhotoInput() ;
    addPhoto.init("userphoto" ,serverPath + "employee/uploadPhoto" , "modalUpdatePhoto" , "imgAdd")

})

// 操作栏外观
function operateFormatter(value, row, index) {
    var del = '<button  type="button" class="remove btn btn-xs btn-danger">' +
        '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>离职' +
        '</button>';
    var change = '<button  type="button" class="change btn btn-xs btn-success">' +
        '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>转正' +
        '</button>';
    if(row.state == 0) {  // 正式
        return del ;
    } else if(row.state == 2) { // 试用
        return del + "&nbsp;&nbsp;" + change ;
    }
}
window.operateEvent = {
    //  离职处理
    'click .remove' : function(e , value , row , index) {
        // 删除逻辑处理
        bootbox.confirm("确认员工离职?" , function(data){
            if(data) {
                $.post(
                    serverPath + "employee/leave" ,
                    'id=' + row.id ,
                    function(responseData) {
                        bootbox.alert(responseData.errMsg) ;
                        if(0 == responseData.errCode) {
                            // 表格刷新
                            $("#empTable").bootstrapTable('refresh') ;
                        }
                    }
                );
            }
        }) ;
    } ,
    //  转正处理
    'click .change' : function(e , value , row , index) {
        // 删除逻辑处理
        bootbox.confirm("确认员工转正?" , function(data){
            if(data) {
                $.post(
                    serverPath + "employee/hiredate" ,
                    'id=' + row.id ,
                    function(responseData) {
                        bootbox.alert(responseData.errMsg) ;
                        if(0 == responseData.errCode) {
                            // 表格刷新
                            $("#empTable").bootstrapTable('refresh') ;
                        }
                    }
                );
            }
        }) ;
    }
}

window.updateEvent = {
    'click .showDetail' : function(e , value , row , index) {
        // 模态框填充数据，显示详情
        $("#showId").val(row.id);
        $("#showTid").text(row.tid);
        $("#showName").text(row.tname);
        $("#showRole").val(row.role == 0 ? "教工" : "职工");
        $("#showNation").val(row.nation);
        $("#showEdu").val(row.education);
        $("#showSchool").val(row.school);
        $("#showGender").val(row.gender);
        $("#showEmail").val(row.email);        $("#showBirth").val(row.birth);
        $("#showMobile").val(row.mobile);
        $("#showAddr").val(row.address);
        if (null != row.photo && '' != row.photo && 'null' != row.photo) {
            $("#imgUpdate").attr('src', row.photo);
        }
        $("#showEnterDate").val(row.hiredate) ;
        $("#showLeaveDate").val(row.departure) ;
        var statStr = "正式" ;
        if(row.state == 1) {
            statStr = "离职" ;
        } else if(row.state == 2) {
            stateStr = "试用" ;
        }
        $("#showState").val(statStr) ;

        // 模态框出现
        $("#detailWindow").modal("show") ;
    }
}


