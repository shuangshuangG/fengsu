$(".datepicker").datepicker({
    format: "yyyy/mm/dd",
    changeMonth: true,
    changeYear: true
})

var data = localStorage.getItem('data')
data = JSON.parse(data)
function CheckNum(num){
    for(let i = 0; i < data.student.length; i++){
        if(data.student[i].studentNumber == num){
            return true
        }
    }
    return false
}
function showMsg(){
    var data = localStorage.getItem('data')
    data = JSON.parse(data)
    console.log(data.Suspension)
    var html = ''
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
    data.Suspension.forEach(function(item,index){
        html += `<tr>
                <td>
                    <input type="checkbox" name="" id="a1" data-id=${item.id} class="selectItem">
                </td>
                <td>${item.studentNumber}</td>
                <td>${item.suspensionDate}</td>
                <td>${item.returnDate}</td>
                <td>
                    <span class="del" data-id=${item.id}>删除</span> /
                    <span class="change" data-id=${item.id} data-toggle="modal" data-target="#myModal">修改</span>
                </td>
            </tr>`;
    })
    $('#leaveSchool').html(html)

}
showMsg()

function add(obj){
    var data = localStorage.getItem('data')
    data = JSON.parse(data)
    var id = data.Suspension[0] ? data.Suspension[0].id + 1 : 1
    obj.id = id
    data.Suspension.unshift(obj)
    // console.log(data.student)
    data = JSON.stringify(data)
    localStorage.setItem('data',data)
    location.reload()
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
}
    //提交按钮
$(".btn-primary").on("click",function(e){
    var comNum = 0;
    var objLength = 0;
    var obj = {
        "studentNumber": $("#num").val(),//学号
        "suspensionDate": $("#datepicker").val(),//休学日期
        "returnDate": $("#datepicker2").val()//复学日期
    }
    // console.log(obj)
    let flag = CheckNum(obj.studentNumber)
    if(!flag) {
        $('.pop').html('学号不存在')
        $(".pop").css({display:"inline"})
        return
    }
    $('.pop').html('请先完善信息！')
    $(".pop").css({display:"none"})
    
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
    $("#myModalLabel").html("添加休学信息");         //初始化模态框字段 置空
    $("#num").val("");
    $("#datepicker").val("");
    $("#datepicker2").val("");
})

//修改信息
$("body").on("click",".change",function(){
    var that = this;
    $(".btn-primary").attr("genre","mod"); //点击提交按钮时设置标识 添加
    $(".pop").css({display:"none"});
    $("#myModalLabel").html("修改休学信息");

    var obj = {
        "datepicker2": $(this).parent().prev().html(), //复学日期
        "datepicker": $(this).parent().prevAll().eq(1).html(), //休学日期
        "num": $(this).parent().prevAll().eq(2).html(),//学号
    }
                
    $("#num").val(obj.num);//初始化模态框字段
    $("#datepicker2").val(obj.datepicker2);
    $("#datepicker").val(obj.datepicker);
    var dataId = $(this).attr('data-id')*1
    $(".btn-primary").on("click",function(){
        var comNum = 0;
        var objLength = 0;
        var obj = {
            "returnDate": $("#datepicker2").val(),
            "suspensionDate": $("#datepicker").val(),
            "studentNumber": $("#num").val()
        }

        for( var i in obj ){
            objLength++;
            if(obj[i]) comNum++;
        }

        if(comNum < objLength) $(".pop").css({display:"inline"});
        else{
            let flag = CheckNum(obj.studentNumber)
            if(!flag) {
                // alert('学号不存在')
                $('.pop').html('学号不存在')
                $(".pop").css({display:"inline"})
                return
            }
            $('.pop').html('请先完善信息！')
            $(".pop").css({display:"none"})

            $(".btn-default").trigger("click");         //关闭模态框
            if( $(".btn-primary").attr("genre") == "mod" )//根据标识判断操作是修改还是添加
            {  
                obj.id = dataId
                data.Suspension.forEach(function(item,index){
                    if(obj.id == item.id){  
                        data.Suspension[index] = obj
                        return
                    }
                })
                data = JSON.stringify(data)
                localStorage.setItem('data',data)
                location.reload()
            }
        }
    });
})

// 删除公寓  通过事件委托解决新添加的元素绑定不上事件的问题
$("body").on("click",".del",function () {
    var res = confirm("确认删除吗？");
    if (!res) return;
    else {
       var id = $(this).attr('data-id')
       data.Suspension.forEach(function(item,index){
          if(item.id == id){
              data.Suspension.splice(index,1)
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
              console.log(idArr)
              var data = localStorage.getItem('data')
              data = JSON.parse(data)
              console.log(idArr)
              idArr.forEach(function(idItem){
              data.Suspension.forEach(function(item,index){
                      if(idItem == item.id){
                          data.Suspension.splice(index,1)
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