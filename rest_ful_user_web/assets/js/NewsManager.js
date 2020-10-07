// 从localStorage取出登录者信息
loginStr = sessionStorage.getItem("loginuser") ;
if (null == loginStr || loginStr == '') {
    location.href="../login.html" ;
}
// 将localStorage取出字符串转换js对象
loginUser = JSON.parse(loginStr) ;

$(function(){

    // 页面初始化时，填充新闻类别
    $.get(
        serverPathManager + "news/newstype" ,
        function(reqData) {
            if(0 == reqData.errCode) {
                typeArr = reqData.data ;
                var str = '' ;
                $.each(typeArr , function(index , item){
                    str += '<option value="'+item.id+'">' + item.typename + '</option>' ;
                });
                $("#search_typeid").html($("#search_typeid").html() + str) ;
            }
        }
    )

    $("#newsTable").bootstrapTable({
        url : serverPathManager + 'news/page' ,
        method : 'GET' ,
        toolbar : '#toolbar' ,   // 为表格绑定工具栏
        striped: true,			// 显示为斑马线格式，奇偶行不通背景色

        showRefresh: "true",	// 显示刷新按钮
        showToggle: "true",		// 显示格式切换按钮
        showColumns: "true",	// 显示列过滤按钮

        // 分页相关 ，如果分页，服務器端返回的数据需要包含有total属性和rows属性
        pagination: true,		// 显示分页
        pageNumber: 1,			// 初始化加载第一页
        pageSize: 5,			// 每页2条数据
        pageList: [3, 5, 10],	// 可以选择的每页数量
        sidePagination: "server", //表示服务端请求分页数据

        // 提交到Server的参数列表 ，
        // 参数设定相关
        queryParamsType: "undefined",  // undefined：提交到服务器端的参数自定义
        queryParams: function(params) {
            // // 参数params中自带 pageSize , pageNumber , sortName , sortOrder
            //
            // // 为params对象增加额外三个属性
            // params.titleKey = $.trim($("#search_title").val()) ;
            // params.date = $.trim($("#search_date").val()) ;
            // console.dir(params) ;
            // return params ;

            // 参数params中自带 pageSize , pageNumber , sortName , sortOrder
// news/page?curPage=1&size=10&typeid=2&title=小&pubdate=2020年10月01日
            params.curPage = params.pageNumber ;
            params.size = params.pageSize ;
            params.title = $.trim($("#search_title").val()) ;
            params.pubdate = $.trim($("#search_date").val()) ;
            if(-1 != $("#search_typeid").val()) {
                params.typeid = $("#search_typeid").val();
            }
            return params ;

        },

        columns : [
            /*{checkbox : true} ,*/
            {checkbox : true} ,   // 显示复选框列

            {field : 'id' , title : 'ID' , visible : false} ,
            {title : '序号' , formatter:function (value, row, index) {
                    return index+1 ;
                }} ,
            {
                field : 'title' ,
                title : '标题' ,
                formatter : function(value, row, index){
                    return  '<span class="showDetail" style="color:blue; cursor: pointer; ">'+ value +'</span>';
                },
                events : window.showDetail = {
                    'click .showDetail' : function (e , value , row , index) {
                        sessionStorage.setItem("currentNews" , JSON.stringify(row)) ;
                        window.open('NewsDetail.html') ;

                    }
                }} ,
            {field : 'pubdatetime' , title : '发布日期' } ,
            {field : 'comefrom' ,title : '新闻来源'} ,
            {
                title : '操作' ,
                formatter: operateFormatter,
                events: operateEvent ,
            }

        ] ,
    });


    // 搜索按钮动作
    $("#btn_query").click(function(){
        $("#newsTable").bootstrapTable('refresh') ;
    });

    $("#btn_add").click(function(){
        window.open('AddNews.html') ;
    });

    $("#btn_delete").click(function(){
        var rows = $("#newsTable").bootstrapTable('getSelections');
        //console.log(rows) ;
        if(0 == rows.length) {
            bootbox.alert('请选中要删除的行!') ;
            return ;
        }
        bootbox.confirm('确认删除?' , function(confirmData) {
            if(confirmData) {
                var ids = '' ;
                $.each(rows , function(index , item) {
                    ids += 'id=' + item.id + '&' ;
                });
                console.log(ids) ;
                $.ajax({
                    url : serverPathManager + "news/ids"  ,
                    type : 'DELETE' ,
                    data : ids ,
                    datatype : 'json' ,
                    success : function(reqData) {
                        bootbox.alert(reqData.msg) ;
                        if(0 == reqData.errCode) {
                            // 表格刷新
                            $("#newsTable").bootstrapTable('refresh') ;
                        }
                    }
                });
            }
        })
    });

    // 日历控件初始化
    $('#showDatetimePicker').datetimepicker({
        format: 'yyyy年mm月dd日',
        autoclose: true,
        minView:'month',
        maxView:'month',
        todayBtn : true ,
        language:'zh-CN'
    });

})

// 操作栏外观
function operateFormatter(value, row, index) {
    var del = '<button  type="button" class="remove btn btn-xs btn-danger">' +
        '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>删除' +
        '</button>';
    var detail = '<button  type="button" class="detail btn btn-xs btn-info">' +
        '<span class="glyphicon glyphicon-arrow-right" aria-hidden="true"></span>更新' +
        '</button>';
    // return del ;
    return del + "&nbsp;&nbsp;" + detail ;

}
window.operateEvent = {
    'click .remove' : function(e , value , row , index) {
        bootbox.confirm("确认删除本活动?" , function(data){
            if(data) {
                // $.post(
                //     serverPath + "activities/delById" ,
                //     'id=' + row.id ,
                //     function(responseData) {
                //         bootbox.alert(responseData.errMsg) ;
                //         if(0 == responseData.errCode) {
                //             // 表格刷新
                //             $("#activitiesTable").bootstrapTable('refresh') ;
                //         }
                //     }
                // );

                $.ajax({
                    url : serverPathManager + "news/" + row.id ,
                    type : 'DELETE' ,
                    datatype : 'json' ,
                    success : function(reqData) {
                        bootbox.alert(reqData.msg) ;
                        if(0 == reqData.errCode) {
                            // 表格刷新
                            $("#newsTable").bootstrapTable('refresh') ;
                        }
                    }
                });

            }
        }) ;
    } ,

    'click .detail' : function(e , value , row , index) {
        sessionStorage.setItem("currentNews" , JSON.stringify(row)) ;
        window.open('NewsDetail.html') ;
    }

}
