$(".datepicker").datepicker({
    format: "yyyy/mm/dd",
    changeMonth: true,
    changeYear: true
})

var stuName = []
function outofill(){
    var data = JSON.parse(localStorage.getItem('data'))
   data.student.forEach(element => {
               stuName.push({
                   studentNumber: element.studentNumber,
                   stuName: element.name
               })
   })
}
outofill()

//信息展示
function show(){
    var data = JSON.parse(localStorage.getItem('data'))
    var html = ""
    var studentName = []
    data.checkIn.forEach(item => {
        data.student.forEach(element => {
            if(item.studentNumber == element.studentNumber){
                studentName.push(element.name)
                return
            }
        });
    });
    $.each(data.checkIn,function(index,item){
        html +=    `<tr>
                        <td>
                            <input type="checkbox" name="" id="a1" class="selectItem" data-id=${item.id}>
                        </td>
                        <td>${item.studentNumber}</td>
                        <td>${studentName[index]}</td>
                        <td>${item.dormitoryNo}</td>
                        <td>${item.checkInDate}</td>
                        <td>${item.checkInPeriod}</td>
                        <td>
                            <span class="del" data-id=${item.id}>删除</span> /
                            <span class="change" data-toggle="modal" data-target="#myModal" data-id=${item.id}>修改</span>
                        </td>
                    </tr>`
    })
    $(".tableBody").html(html)
    $("#mod").DataTable()
}

show()

//添加入住信息
function add(obj){
    // var tr = `<tr>
    //             <td>
    //                 <input type="checkbox" name="" id="a1" class="selectItem">
    //             </td>
    //             <td>${obj.num}</td>
    //             <td>${obj.name}</td>
    //             <td>${obj.dormitoryName}</td>
    //             <td>${obj.datepicker}</td>
    //             <td>${obj.count}</td>
    //             <td>
    //                 <span class="del">删除</span> /
    //                 <span class="change" data-toggle="modal" data-target="#myModal">修改</span>
    //             </td>
    //         </tr>`;
    // $("#mod tbody").prepend(tr);
    var data = JSON.parse(localStorage.getItem('data'))
    obj.id = data.checkIn[0] ? data.checkIn[0].id + 1 : 1
    data.checkIn.unshift(obj)
    data.dormitory.forEach(function(item){
        if(item.dormitoryNo == obj.dormitoryNo){
            if(item.bedNumber == item.lvingPopulation){
                alert('此宿舍已经没有空闲床位了，请重新选择')
                return
            }else
                item.lvingPopulation ++
        }
    })
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
    var comNum = 0
    var objLength = 0
    var flag = 0
    var data = JSON.parse(localStorage.getItem('data'))
    data.student.forEach(function(item){
        if(item.studentNumber == $("#num").val()){
            if(item.name != $("#name").val()) return flag = 1
            else return flag = 2
        }
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
            "checkInDate": $("#datepicker").val(),//入住日期
            "dormitoryNo": $("#dormitoryName").val(),//宿舍编号
            "checkInPeriod": $("#count").val()//入住期限
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
    $("#myModalLabel").html("添加入住信息");
    $("#num").val("");               //初始化模态框字段 置空
    $("#name").val("");
    $("#dormitoryName").val("");
    $("#count").val("");
    $("#datepicker").val("");
})

//修改信息
$("body").on("click",".change",function(){
    var that = this;
    $(".btn-primary").attr("genre","mod"); //点击提交按钮时设置标识 添加
    $(".pop").css({display:"none"});
    $("#myModalLabel").html("修改入住信息");

    var obj = {
        "count": $(this).parent().prev().html(),  //入住期限
        "datepicker": $(this).parent().prevAll().eq(1).html(), //入住日期
        "dormitoryName": $(this).parent().prevAll().eq(2).html(), //宿舍编号
        "name": $(this).parent().prevAll().eq(3).html(), //姓名
        "num": $(this).parent().prevAll().eq(4).html(),//学号
    }
                
    $("#num").val(obj.num);//初始化模态框字段
    $("#name").val(obj.name);
    $("#count").val(obj.count);
    $("#dormitoryName").val(obj.dormitoryName);
    $("#datepicker").val(obj.datepicker);
    var olddormitory = obj.dormitoryName
    var dataId = $(this).attr('data-id')
    $(".btn-primary").on("click",function(){
        var comNum = 0;
        var objLength = 0;
        var flag = 0
        var data = JSON.parse(localStorage.getItem('data'))
        data.student.forEach(function(item){
            if(item.studentNumber == $("#num").val()){
                if(item.name != $("#name").val()) return flag = 1
                else return flag = 2
            }
        })
        if(!flag){
            $('.pop').html('该学号不存在！')
            $(".pop").css({display:"inline"})
            return
        }else{
            $('.pop').html('请先完善信息！')
            $(".pop").css({display:"none"})
            var obj = {
                "dormitoryNo": $("#dormitoryName").val(),
                "checkInDate": $("#datepicker").val(),
                "checkInPeriod": $("#count").val(),
                "name": $("#name").val(),
                "studentNumber": $("#num").val()
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
                    var data = JSON.parse(localStorage.getItem('data'))
                    data.dormitory.forEach(function(item){
                        if(item.dormitoryNo == obj.dormitoryNo){
                            if(item.bedNumber == item.lvingPopulation){
                                alert('此宿舍已经没有空闲床位了，请重新选择')
                                return
                            }else
                                item.lvingPopulation ++
                        }
                    })
                    data.dormitory.forEach(function(item){
                        if(item.dormitoryNo == olddormitory){
                                item.lvingPopulation --
                        }
                    })
                    data.checkIn.forEach(item =>{
                        if(item.id == obj.id){
                            item.studentNumber = obj.studentNumber
                            item.dormitoryNo = obj.dormitoryNo
                            item.checkInDate = obj.checkInDate
                            item.checkInPeriod = obj.checkInPeriod
                        }
                    })
                    localStorage.setItem('data',JSON.stringify(data))
                    location.reload()
                }
            }
        }
    });
})

// 删除公寓  通过事件委托解决新添加的元素绑定不上事件的问题
$("body").on("click",".del",function () {
    var id = $(this).attr('data-id') * 1
    var res = confirm("确认删除吗？")
    if (!res) return;
    else {
        var olddormitory = null
        var data = JSON.parse(localStorage.getItem('data'))
        data.checkIn.forEach((item, index) =>{
            if(item.id == id){
                olddormitory =  data.checkIn.splice(index, 1)
            }
        })
        if(olddormitory){
            data.dormitory.forEach(function(item){
                if(item.dormitoryNo == olddormitory[0].dormitoryNo){
                        item.lvingPopulation --
                }
            })
        }
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
                data.checkIn.forEach((item, index) =>{
                    if(item.id == element){
                        let olddormitory = data.checkIn.splice(index, 1)
                        data.dormitory.forEach(function(item){
                            if(item.dormitoryNo == olddormitory[0].dormitoryNo){
                                    item.lvingPopulation --
                            }
                        })
                    }
                })
            })
            localStorage.setItem('data',JSON.stringify(data))
            location.reload()
        }
    }
})