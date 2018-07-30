$(".datepicker").datepicker({
    format: "yyyy/mm/dd",
    changeMonth: true,
    changeYear: true
})

//信息展示
var data = JSON.parse(localStorage.getItem('data'))
var stuName = []
data.student.forEach(element => {
    stuName.push({
        studentNumber: element.studentNumber,
        stuName: element.name
    })
})

function show(){
    var html = ''
    var stuName = []
    data.payCost.forEach(item =>{
        data.student.forEach(ele =>{
            if(ele.studentNumber == item.studentNumber){
                stuName.push(ele.name)
            }
        })
    })
    data.payCost.forEach((item, index) =>{
        html += `<tr>
                    <td>
                        <input type="checkbox" name="" id="a1" class="selectItem" data-id=${item.id}>
                    </td>
                    <td>${item.studentNumber}</td>
                    <td>${stuName[index]}</td>
                    <td>${item.payDate}</td>
                    <td>${item.type}</td>
                    <td>${item.prices}</td>
                    <td>${item.favorable}</td>
                    <td>
                        <span class="del" data-id=${item.id}>删除</span> /
                        <span class="change" data-toggle="modal" data-target="#myModal" data-id=${item.id}>修改</span>
                    </td>
                </tr>`
    })
    $('#payCost').html(html)
}
show()


// 添加取暖费
function add(obj){
    // var tr = `<tr>
    //             <td>
    //                 <input type="checkbox" name="" id="a1" class="selectItem">
    //             </td>
    //             <td>${obj.num}</td>
    //             <td>${obj.name}</td>
    //             <td>${obj.datepicker}</td>
    //             <td>${obj.type}</td>
    //             <td>${obj.expense}</td>
    //             <td>${obj.discount}</td>
    //             <td>
    //                 <span class="del">删除</span> /
    //                 <span class="change" data-toggle="modal" data-target="#myModal">修改</span>
    //             </td>
    //         </tr>`;
    // $("#mod tbody").prepend(tr);
    var dataId = data.payCost[0] ? data.payCost[0].id + 1 : 1
    obj.id = dataId
    data.payCost.unshift(obj)
    console.log(data.payCost)
    localStorage.setItem('data',JSON.stringify(data))
    location.reload()
}

//姓名智能回填
var flag = false;
var studentName

$("#num").on('blur',() =>{
    studentName = ''
    flag = false
    stuName.forEach(item =>{
        if(item.studentNumber == $("#num").val()){
            flag = true
            studentName = item.stuName
            return
        }
    })
    if(studentName){
        $('#name').val(studentName)
    }else{
        $('#name').val('学号不存在！')
    }
})


    //提交按钮
$(".btn-primary").on("click",function(e){
    var comNum = 0;
    var objLength = 0;

    if(!flag){
        $('.pop').html('学号信息不存在！')
        $(".pop").css({display:"inline"})
        return
    }
    else{
        $('.pop').html('请先完善信息！')
        $(".pop").css({display:"none"})

        var obj = {
            "studentNumber": $("#num").val(),//学号
            "payDate": $("#datepicker").val(),//缴纳日期
            "prices": $("#expense").val(),//应缴金额
            "favorable": $("#discount").val(), //优惠金额
            "type": $("#type").val() //类型
        }
    
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
    $("#myModalLabel").html("添加信息");
    $("#num").val("");               //初始化模态框字段 置空
    $("#name").val("");
    $("#datepicker").val("");
    $("#expense").val("");
    $("#discount").val("");
    $("#type").val("正常缴纳");
})

//修改信息
$("body").on("click",".change",function(){
    var that = this;
    $(".btn-primary").attr("genre","mod"); //点击提交按钮时设置标识 添加
    $(".pop").css({display:"none"});
    $("#myModalLabel").html("修改信息");

    var obj = {
        "type": $(this).parent().prevAll().eq(2).html(),//类型
        "expense": $(this).parent().prevAll().eq(1).html(),  //应缴金额
        "datepicker": $(this).parent().prevAll().eq(3).html(), //缴纳日期
        "name": $(this).parent().prevAll().eq(4).html(), //姓名
        "discount": $(this).parent().prev().html(), //优惠金额
        "num": $(this).parent().prevAll().eq(5).html(),//学号
    }

    $("#type").val(obj.type);               //初始化模态框字段
    $("#num").val(obj.num);
    $("#name").val(obj.name);
    $("#discount").val(obj.discount);
    $("#datepicker").val(obj.datepicker);
    $("#expense").val(obj.expense);
    $("#num").attr('autofocus',true)

    var dataId = $(this).attr('data-id') * 1

    $(".btn-primary").off("click")
    $(".btn-primary").on("click",function(){
        var comNum = 0;
        var objLength = 0;
        var obj = {
            "type": $("#type").val(),
            "studentNumber": $("#num").val(),
            "payDate": $("#datepicker").val(),
            "prices": $("#expense").val(),
            "favorable": $("#discount").val(),
            "id": dataId
        }
        

        for( var i in obj ){
            objLength++;
            if(obj[i]) comNum++;
        }

        if(!flag){
            $('.pop').html('学号信息不存在！')
            $(".pop").css({display:"inline"})
            return
        }
        else{
            $('.pop').html('请先完善信息！')
            $(".pop").css({display:"none"})

            if(comNum < objLength) $(".pop").css({display:"inline"});
            else{
                $(".btn-default").trigger("click");         //关闭模态框
                if( $(".btn-primary").attr("genre") == "mod" )//根据标识判断操作是修改还是添加
                {  
                    // $(that).parent().prevAll().eq(5).html(obj.num)
                    // $(that).parent().prevAll().eq(4).html(obj.name)
                    // $(that).parent().prevAll().eq(3).html(obj.datepicker)
                    // $(that).parent().prevAll().eq(2).html(obj.type)
                    // $(that).parent().prevAll().eq(1).html(obj.expense)
                    // $(that).parent().prev().html(obj.discount)
                    data.payCost.forEach(item =>{
                        if(item.id == obj.id){
                            item.studentNumber = obj.studentNumber
                            item.payDate = obj.payDate
                            item.type = obj.type
                            item.prices = obj.prices
                            item.favorable = obj.favorable
                            return
                        }
                    })
                    localStorage.setItem('data',JSON.stringify(data))
                    location.reload()
                }
            }
        }
    })
})

// 删除公寓  通过事件委托解决新添加的元素绑定不上事件的问题
$("body").on("click",".del",function () {
    var id = $(this).attr('data-id') * 1
    var res = confirm("确认删除吗？")
    if (!res) return;
    else {
        console.log(id)
        var data = JSON.parse(localStorage.getItem('data'))
        data.payCost.forEach((item, index) =>{
            if(item.id == id){
                data.payCost.splice(index, 1)
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
                data.payCost.forEach((item, index) =>{
                    if(item.id == element){
                        data.payCost.splice(index, 1)
                    }
                })
            })
            localStorage.setItem('data',JSON.stringify(data))
            location.reload()
        }
    }
})