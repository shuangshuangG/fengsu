$(".datepicker").datepicker({
    format: "yyyy/mm/dd",
    changeMonth: true,
    changeYear: true
})
//添加缴纳取暖费信息
var data = localStorage.getItem('data')
data = JSON.parse(data)
function showMsg(){
    var data = localStorage.getItem('data')
    data = JSON.parse(data)
    console.log(data.student)
    var html = ''
    // var tr = `<tr>
    //             <td>
    //                 <input type="checkbox" name="" id="a1" class="selectItem">
    //             </td>
    //             <td>${obj.num}</td>
    //             <td>${obj.name}</td>
    //             <td>${obj.sex}</td>
    //             <td>${obj.datepicker}</td>
    //             <td>${obj.objTea}</td>
    //             <td>${obj.jobTea}</td>
    //             <td>
    //                 <span class="del">删除</span> /
    //                 <span class="change" data-toggle="modal" data-target="#myModal">修改</span>
    //             </td>
    //         </tr>`;
    data.student.forEach(function(item,index){
        html += `<tr>
                <td>
                    <input type="checkbox" name="" id="a1" data-id=${item.id} class="selectItem">
                </td>
                <td>${item.studentNumber}</td>
                <td>${item.name}</td>
                <td>${item.sex}</td>
                <td>${item.classNo}</td>
                <td>${item.openingHours}</td>
                <td>${item.projectTeacher}</td>
                <td>${item.employmentTeacher}</td>
                <td>
                    <span class="del" data-id=${item.id}>删除</span> /
                    <span class="change" data-id=${item.id} data-toggle="modal" data-target="#myModal">修改</span>
                </td>
            </tr>`;
    })
    $('#student').html(html)
    $("#mod").DataTable();

}
showMsg()
function add(obj){
    var data = localStorage.getItem('data')
    data = JSON.parse(data)
    var id = data.student[0] ? data.student[0].id + 1 : 1
    obj.id = id
    data.student.unshift(obj)
    // console.log(data.student)
    data = JSON.stringify(data)
    localStorage.setItem('data',data)
    location.reload()
    // var tr = `<tr>
    //             <td>
    //                 <input type="checkbox" name="" id="a1" class="selectItem">
    //             </td>
    //             <td>${obj.num}</td>
    //             <td>${obj.name}</td>
    //             <td>${obj.sex}</td>
    //             <td>${obj.datepicker}</td>
    //             <td>${obj.objTea}</td>
    //             <td>${obj.jobTea}</td>
    //             <td>
    //                 <span class="del">删除</span> /
    //                 <span class="change" data-toggle="modal" data-target="#myModal">修改</span>
    //             </td>
    //         </tr>`;
    // $("#mod tbody").prepend(tr);
}
    //提交按钮
$(".btn-primary").on("click",function(e){
    var comNum = 0;
    var objLength = 0;
    var obj = {
        "studentNumber": $("#num").val(),//学号
        "name": $("#name").val(),  //姓名
        "classNo":$('#class').val(),
        "openingHours": $("#datepicker").val(),//开班时间
        "sex": $("#sex").val(),//性别
        "projectTeacher": $("#objTea").val(),//项目老师
        "employmentTeacher": $("#jobTea").val()//就业老师
    }
    // console.log(obj)

    for( var i in obj ){
        objLength++;
        if(obj[i]) comNum++;
    }

    if(comNum < objLength) $(".pop").css({display:"inline"});
    else{
        $(".btn-default").trigger("click");         //关闭模态框
        if( $(".btn-primary").attr("genre") == "add" ) add(obj);  //根据标识判断操作是修改还是添加
    }

});
//添加信息
$(".add").on("click",function(){
    $(".btn-primary").attr("genre","add"); //点击提交按钮时设置标识 添加
    $(".pop").css({display:"none"});
    $("#myModalLabel").html("添加学员信息");
    $("#num").val("");               //初始化模态框字段 置空
    $("#name").val("");
    $("#sex").val("");
    $("#objTea").val("");
    $("#jobTea").val("");
    $("#datepicker").val("");
    $("#expense").val("");
})

//修改信息
$("body").on("click",".change",function(){
    var that = this;
    $(".btn-primary").attr("genre","mod"); //点击提交按钮时设置标识 添加
    $(".pop").css({display:"none"});
    $("#myModalLabel").html("修改学员信息");

    var obj = {
        "employmentTeacher": $(this).parent().prev().html(),  //就业老师
        "projectTeacher": $(this).parent().prevAll().eq(1).html(), //项目老师
        "openingHours": $(this).parent().prevAll().eq(2).html(), //开班时间
        "classNo":$(this).parent().prevAll().eq(3).html(),
        "sex": $(this).parent().prevAll().eq(4).html(), //性别
        "name": $(this).parent().prevAll().eq(5).html(), //姓名
        "studentNumber": $(this).parent().prevAll().eq(6).html(),//学号
    }         
    $("#num").val(obj.studentNumber);//初始化模态框字段
    $("#name").val(obj.name);
    $("#objTea").val(obj.projectTeacher);
    $("#jobTea").val(obj.employmentTeacher);
    $("#datepicker").val(obj.openingHours);
    $("#sex").val(obj.sex);
    $("#class").val(obj.classNo);

    var dataId = $(this).attr('data-id')*1

    $(".btn-primary").on("click",function(){
        var comNum = 0;
        var objLength = 0;
        var obj = {
            "employmentTeacher": $("#jobTea").val(),
            "openingHours": $("#datepicker").val(),
            "projectTeacher": $("#objTea").val(),
            "name": $("#name").val(),
            "sex": $("#sex").val(),
            "studentNumber": $("#num").val(),
            "classNo": $("#class").val()
        }
        for( var i in obj ){
            objLength++;
            if(obj[i]) comNum++;
        }

        if(comNum < objLength) $(".pop").css({display:"inline"});
        else{
            $(".btn-default").trigger("click");         //关闭模态框
            if( $(".btn-primary").attr("genre") == "mod" )//根据标识判断操作是修改还是添加
            {  
                obj.id = dataId
                data.student.forEach(function(item,index){
                    if(obj.id == item.id){  
                        data.student[index] = obj
                        return
                    }
                })
                data = JSON.stringify(data)
                localStorage.setItem('data',data)
                location.reload()
                

                // $(that).parent().prevAll().eq(5).html(obj.num)
                // $(that).parent().prevAll().eq(4).html(obj.name)
                // $(that).parent().prevAll().eq(3).html(obj.sex)
                // $(that).parent().prevAll().eq(2).html(obj.datepicker)
                // $(that).parent().prevAll().eq(1).html(obj.objTea)
                // $(that).parent().prev().html(obj.jobTea)
            }
        }
    });
})

// 删除公寓  通过事件委托解决新添加的元素绑定不上事件的问题
$("body").on("click",".del",function (e) {
    var res = confirm("确认删除吗？");
    if (!res) return;
    else {
        var id = $(this).attr('data-id')
        console.log(data)
        data.student.forEach(function(item,index){
            if(item.id == id){
                data.student.splice(index,1)
                data = JSON.stringify(data)
                localStorage.setItem('data',data)
                location.reload()
                return
            }
        })
    }
})

// 全选
var flag1 = true;
$(".selectAll").on("click",function(){
    if(flag1)
    {
        $(".selectItem").prop("checked",true);
        flag1 = !flag1;
    }
    else{
        $(".selectItem").prop("checked",false);
        flag1 = !flag1;
    }
})

// 批量删除
var selectNum = 0;
$(".deletes").on("click",function(){
    if( $(".selectAll").prop("checked") ) selectNum = -1;
    else selectNum = 0;
    var idArr = []
    $(".selectItem").each(function(index,item){
        if( $(item).prop("checked") ){
            selectNum++
            idArr.push($(item).attr("data-id"))
        }
    })
    if(!idArr[0]) idArr.shift()
    // console.log(idArr)
    if(!selectNum) alert("未选中任何删除项！");
    else{
        var res = confirm("确认删除该 "+selectNum+" 项数据？");
        // if(res) alert("请求已发送！");
        if(res){
            // $.ajax({
            //     url: "/api/school/del",
            //     type: "post",
            //     contentType: "application/json",
            //     data: JSON.stringify({id: idArr}),
            //     success: (res) =>{
            //         if(res.status == 'ok') show()
            //         else alert('信息删除失败，'+res.msg)
            //     },
            //     error: (err)=>{
            //         console.log(err.statusText)
            //     }
            // })
            console.log(idArr)
            var data = localStorage.getItem('data')
            data = JSON.parse(data)
            console.log(idArr)
            idArr.forEach(function(idItem){
            data.student.forEach(function(item,index){
                    if(idItem == item.id){
                        data.student.splice(index,1)
                        return
                    }
                })
            })
            data = JSON.stringify(data)
            localStorage.setItem('data',data)
            location.reload()
        }
    }
})