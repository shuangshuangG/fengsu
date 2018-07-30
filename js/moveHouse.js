$(".datepicker").datepicker({
    format: "yyyy/mm/dd",
    changeMonth: true,
    changeYear: true
})

//姓名智能回填
var data = JSON.parse(localStorage.getItem('data'))
var stuName = []
data.checkIn.forEach(element => {
    data.payCost.forEach(item =>{
            stuName.push({
                studentNumber: element.studentNumber,
                dormitoryNo: element.dormitoryNo
            })
    })
})

var newStuName = []
stuName.forEach(function(items){
    let flag = false
    newStuName.forEach(function(item){
        if(items.studentNumber == item.studentNumber)
            flag = true
    })
    if(!flag){
        newStuName.push(items)
    }
})
stuName = newStuName
var flag = false;
var studentName

$("#num").on('blur',() =>{
    studentName = ''
    flag = false
    stuName.forEach(item =>{
        if(item.studentNumber == $("#num").val()){
            flag = true
            studentName = item.dormitoryNo
            return
        }
    })
    if(studentName){
        $('#leaveout').val(studentName)
    }else{
        $('#leaveout').val('学号不存在！')
    }
})

//信息展示
function show(){
    var data = JSON.parse(localStorage.getItem('data'))
    var html = ""
    $.each(data.relocation,function(index,item){
        html +=    `<tr><td>
                        <input type="checkbox" name="" id="a1" class="selectItem" data-id=${item.id}>
                    </td>
                    <td>${item.studentNumber}</td>
                    <td>${item.moveOutNo}</td>
                    <td>${item.moveInNo}</td>
                    <td>${item.moveDate}</td>
                    <td>
                        <span class="del" data-id=${item.id}>删除</span> /
                        <span class="change" data-toggle="modal" data-target="#myModal" data-id=${item.id}>修改</span>
                    </td></tr>`
        })
    $(".tableBody").html(html)
    $("#mod").DataTable()
}

show()


//添加迁宿信息
function add(obj){
    // var tr = `<tr>
    //             <td>
    //                 <input type="checkbox" name="" id="a1" class="selectItem">
    //             </td>
    //             <td>${obj.num}</td>
    //             <td>${obj.datepicker}</td>
    //             <td>${obj.datepicker2}</td>
    //             <td>
    //                 <span class="del">删除</span> /
    //                 <span class="change" data-toggle="modal" data-target="#myModal">修改</span>
    //             </td>
    //         </tr>`;
    // $("#mod tbody").prepend(tr);
    var data = JSON.parse(localStorage.getItem('data'))
    obj.id = data.relocation[0] ? data.relocation[0].id + 1 : 1
    // console.log(obj)
    data.dormitory.forEach(item =>{
        if(item.dormitoryNo == obj.moveOutNo){
            item.lvingPopulation--
        }
        if(item.dormitoryNo == obj.moveInNo){
            item.lvingPopulation++
        }
    })
    data.checkIn.forEach(item =>{
        if(item.studentNumber == obj.studentNumber){
            item.dormitoryNo = obj.moveInNo
        }
    })
    data.relocation.unshift(obj)
    localStorage.setItem('data',JSON.stringify(data))
    location.reload()
}
    //提交按钮
$(".btn-primary").on("click",function(e){
    var comNum = 0;
    var objLength = 0;
    var objLength = 0;
    var flag = 0
    var data = JSON.parse(localStorage.getItem('data'))
    data.student.forEach(function(item){
        if(item.studentNumber == $("#num").val()) return flag = 1
    })
    if(!flag){
        $('.pop').html('该学号不存在！')
        $(".pop").css({display:"inline"})
        return ;
    }
    else{
        $('.pop').html('请先完善信息！')
        $(".pop").css({display:"none"})
        var obj = {
            "studentNumber": $("#num").val(),//学号
            "moveDate": $("#datepicker").val(),//迁宿日期
            "moveOutNo": $("#leaveout").val(),//迁出宿舍编号
            "moveInNo": $("#leavein").val()//迁入宿舍编号
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
    } 

});
//添加信息
$(".add").on("click",function(){
    $(".btn-primary").attr("genre","add"); //点击提交按钮时设置标识 添加
    $(".pop").css({display:"none"});
    $("#myModalLabel").html("添加迁宿信息");         //初始化模态框字段 置空
    $("#leaveout").val("");
    $("#leavein").val("");
    $("#num").val("");
    $("#datepicker").val("");
})

//修改信息
$("body").on("click",".change",function(){
    var that = this;
    $(".btn-primary").attr("genre","mod"); //点击提交按钮时设置标识 添加
    $(".pop").css({display:"none"});
    $("#myModalLabel").html("修改迁宿信息");

    var obj = {
        "datepicker": $(this).parent().prevAll().eq(0).html(), //迁宿日期
        "num": $(this).parent().prevAll().eq(3).html(),//学号
        "leaveout": $(this).parent().prevAll().eq(2).html(),//迁出宿舍编号
        "leavein": $(this).parent().prevAll().eq(1).html()//迁入宿舍编号
    }
                
    $("#num").val(obj.num);//初始化模态框字段
    $("#datepicker").val(obj.datepicker);
    $("#leaveout").val(obj.leaveout);
    $("#leavein").val(obj.leavein);

    var oldLeaveOut = obj.leavein
    var dataId = $(this).attr('data-id') * 1
    $(".btn-primary").on("click",function(){
        var comNum = 0;
        var objLength = 0;

        var flag = 0
        var data = JSON.parse(localStorage.getItem('data'))
        data.student.forEach(function(item){
            if(item.studentNumber == $("#num").val()) return flag = 1
        })
        if(!flag){
            $('.pop').html('该学号不存在！')
            $(".pop").css({display:"inline"})
            return
        }
        else{
            $('.pop').html('请先完善信息！')
            $(".pop").css({display:"none"})
            var obj = {
                "moveDate": $("#datepicker").val(),
                "moveInNo": $("#leavein").val(),
                "moveOutNo": $("#leaveout").val(),
                "studentNumber": $("#num").val()
            }
            
            obj.id = dataId
            for( var i in obj ){
                objLength++;
                if(obj[i]) comNum++;
            }

            if(comNum < objLength) $(".pop").css({display:"inline"});
            else{
                $(".btn-default").trigger("click");         //关闭模态框
                if( $(".btn-primary").attr("genre") == "mod" )//根据标识判断操作是修改还是添加
                {  
                    // $(that).parent().prevAll().eq(3).html(obj.num)
                    // $(that).parent().prevAll().eq(2).html(obj.leaveout)
                    // $(that).parent().prevAll().eq(1).html(obj.leavein)
                    // $(that).parent().prev().html(obj.datepicker)
                    var data = JSON.parse(localStorage.getItem('data'))
                    data.dormitory.forEach(item =>{
                        if(item.dormitoryNo == oldLeaveOut){
                            item.lvingPopulation--
                        }
                        if(item.dormitoryNo == obj.moveInNo){
                            item.lvingPopulation++
                        }
                    })
                    data.checkIn.forEach(item =>{
                        if(item.studentNumber == obj.studentNumber){
                            item.dormitoryNo = obj.moveInNo
                        }
                    })
                    data.relocation.forEach(item =>{
                        if(item.id == obj.id){
                            item.studentNumber = obj.studentNumber
                            item.moveOutNo = obj.moveOutNo
                            item.moveInNo = obj.moveInNo
                            item.moveDate = obj.moveDate
                        }
                    })
                    localStorage.setItem('data',JSON.stringify(data))
                    location.reload()
                }
            }
        }
    })
})

// 删除信息  通过事件委托解决新添加的元素绑定不上事件的问题
$("body").on("click",".del",function () {
    var id = $(this).attr('data-id') * 1
    var res = confirm("确认删除吗？")
    if (!res) return;
    else {
        console.log(id)
        var data = JSON.parse(localStorage.getItem('data'))
        data.relocation.forEach((item, index) =>{
            if(item.id == id){
                data.relocation.splice(index, 1)
            }
        })
        localStorage.setItem('data',JSON.stringify(data))
        location.reload()
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
            idArr.push($(item).attr("data-id") * 1)
        }
    })
    if(!idArr[0]) idArr.shift()
    if(!selectNum) alert("未选中任何删除项！");
    else{
        var res = confirm("确认删除该 "+selectNum+" 项数据？");
        if(!res) return
        else{
            console.log(idArr)
            var data = JSON.parse(localStorage.getItem('data'))
            idArr.forEach(element =>{
                data.relocation.forEach((item, index) =>{
                    if(item.id == element){
                        data.relocation.splice(index, 1)
                    }
                })
            })
            localStorage.setItem('data',JSON.stringify(data))
            location.reload()
        }
    }
})