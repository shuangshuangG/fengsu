var data = localStorage.getItem('data')
data = JSON.parse(data)
var json = []
function getJson(){
    var data = localStorage.getItem('data')
    data = JSON.parse(data)

    data.campus.forEach(function(item){
        let temp = {}
        temp.name = item.campusName
        temp.No = item.campusNo
        temp.id = item.id
        json.push(temp)
    })
    data.campus.forEach(function(items,index){
        let tem = []
        data.apartment.forEach(function(item){
            if(items.id == item.campusId){
                let temp = {}
                temp.name = item.apartmentName
                temp.No = item.apartmentNo
                temp.id = item.id
                tem.push(temp)
            }
        })
        json[index].apartment = tem
    })
}

function getCampusId(id){
    for(let i = 0; i < data.campus.length; i++){
        if(data.campus[i].id == id)
            return data.campus[i].campusNo
    }
    return false
}

function getApartmentId(id){
    for(let i = 0; i < data.apartment.length; i++){
        if(data.apartment[i].id == id)
            return data.apartment[i].apartmentNo
    }
    return false
}

function getDormitoryId(id){
    for(let i = 0; i < data.dormitory.length; i++){
        if(data.dormitory[i].id == id)
            return data.dormitory[i].dormitoryNo
    }
    return false
}

function getDormitoryDedNumberId(id){
    for(let i = 0; i < data.dormitory.length; i++){
        if(data.dormitory[i].id == id)
            return data.dormitory[i].bedNumber
    }
    return false
}

function getDormitoryIds(id){
    for(let i = 0; i < data.dormitory.length; i++){
        if(data.dormitory[i].id == id)
            return data.dormitory[i].bedNumber
    }
    return false
}

function showMsg(){
    var data = JSON.parse(localStorage.getItem('data'))
    var html = ''
    var campusNO = [],apartmentNO = [],dormitoryNo = []
    data.cost.forEach((element, index) => {
        html += `<tr>
                    <td>
                        <input type="checkbox" name="" id="a1" class="selectItem" data-id=${element.id}>
                    </td>
                    <td>${getCampusId(element.campusId)}</td>
                    <td>${getApartmentId(element.apartmentId)}</td>
                    <td>${getDormitoryId(element.dormitoryId)}</td>
                    <td>${getDormitoryDedNumberId(element.dormitoryId)}</td>
                    <td>${element.pricingTime}</td>
                    <td>${element.standardCosts}</td>
                    <td>
                        <span class="del" data-id=${element.id}>删除</span> /
                        <span class="change" data-toggle="modal" data-target="#myModal" data-id=${element.id}>修改</span>
                    </td>
                </tr>`
    });
    $('#costs').html(html)
}
function initPick(e1,e2,json){
    let html = ''
    let id = $(e1).attr('data-id') || $(e1).val()
    let num = 0
    if(id){
        json.forEach(function(item,index){
            if(id == item.id)
                num = index
        })
    }
    json.forEach(function(item,index){
        if(index == num)
            html += `<option value=${item.id} selected> ${item.No}</option>`
        else
            html += `<option value=${item.id} > ${item.No}</option>`
    })
    $(e1).html(html)
    let id2 =  $(e2).attr('data-id') || $(e2).val()
    let num2 = 0
    if(id2){
        json[num].apartment.forEach(function(item,index){
            if(id2 == item.id)
                num2 = index
        })
    }
    html = ''
    json[num].apartment.forEach(function(item,index){
        if(index == num2)
            html += `<option value=${item.id} selected> ${item.No}</option>`
        else
            html += `<option value=${item.id} > ${item.No}</option>`
    })
    $(e2).html(html)
    if($('#dormitory')){
        if(!$(e2).val()) return
        let id3 = $(e2).attr('data-id') || $(e2).val()
        let id4 =  $('#dormitory').attr('data-id') || $('#dormitory').val()
        let num3 = 0 
        let dormitory = []
        data.dormitory.forEach(function(item,index){
            if(item.apartmentId == id3){
                dormitory.push({id:item.id,name:item.dormitoryNo,num:item.bedNumber})
                if(item.id == id4)
                    num3 = item.id
            }
        })
        html = ''
        dormitory.forEach(function(item){
            if(item.id == num3){
                html += `<option value=${item.id} selected> ${item.name}</option>`
                $('#count').val(item.num)
            }
            else
                html += `<option value=${item.id} > ${item.name}</option>`
        })
        $('#dormitory').html(html)
    }
}


function selectPick(e1,e2,json){
    $(e1).on('change',function(e){
        let id = e.target.value
        let apartment = [] 
        json.forEach(function(item){
            if(item.id == id){
                apartment = item.apartment
                return
            } 
        })
        let htmls = ''
        apartment.forEach(function(item,index){
            if(index == 0)
               htmls += `<option value=${item.id} selected> ${item.No}</option>`
            else
               htmls += `<option value=${item.id} > ${item.No}</option>`
        })
        $(e2).html(htmls)
        let id2
        if(!$('#dormitory') || !e.target.value) return
        id2 = $(e2).val()
        dormitory = [] 
        data.dormitory.forEach(function(item){
            if(item.apartmentId == id2){
                dormitory.push({id:item.id,name:item.dormitoryNo,num:item.bedNumber})
            }
        })
        html = ''
        dormitory.forEach(function(item,index){
            if(index == 0){
               html += `<option value=${item.id} selected> ${item.name}</option>`
               $('#count').val(item.num) 
            }
            else
               html += `<option value=${item.id} > ${item.name}</option>`
        })
        $('#dormitory').html(html)
    })
    if($('#dormitory')){
       $(e2).on('change',function(e){
             let id = e.target.value
             let dormitory = [] 
             data.dormitory.forEach(function(item){
                 if(item.apartmentId == id){
                     dormitory.push({id:item.id,name:item.dormitoryNo,num:item.bedNumber})
                 }
             })
             let html = ''
             dormitory.forEach(function(item,index){
                 if(index == 0){
                    $('#count').val(item.num) 
                    html += `<option value=${item.id} selected> ${item.name}</option>`
                 }
                 else
                    html += `<option value=${item.id} > ${item.name}</option>`
             })
             $('#dormitory').html(html)
        })
    }
    if($('#dormitory')){
        $('#dormitory').on('change',function(e){
        let id = $(this).val()
        let bednum = 0
        data.dormitory.forEach(function(item){
            if(item.id == id){
                bednum = item.bedNumber
            }
        })
        $('#count').val(bednum) 
    })
    }
}
function dataChang(){
    $('#time').on('change',function(){
        let time = $(this).val()
        if(time == '2016-05-01') 
            $("#cost").html(`<option value="370">370</option>
                <option value="470">470</option>
                <option value="570">570</option>  `)
        if(time == '2017-10-01') 
            $("#cost").html(`<option value="470">470</option>
                <option value="570">570</option>
                <option value="670">670</option>`)
        if(time == '2018-02-01') 
            $("#cost").html(`<option value="570">570</option>
                <option value="670">670</option>
                <option value="770">770</option> `)
    })
}


getJson()
showMsg()
initPick('#campus','#apartment',json)
selectPick('#campus','#apartment',json)
dataChang()

// 添加校区
function add(obj){
   var id = data.cost[0] ? data.cost[0].id + 1 : 1 
   obj.id = id*1
   console.log(obj)
   data.cost.unshift(obj)
   // console.log(data.cost)
   data = JSON.stringify(data)
   localStorage.setItem('data',data)
   data = JSON.parse(data)
   location.reload()
}
    //提交按钮
$(".btn-primary").off("click")
$(".btn-primary").on("click",function(e){
    var comNum = 0;
    var objLength = 0;
    var obj = {
        "campusId": $("#campus").val(),//校区编号
        "apartmentId": $("#apartment").val(),  //公寓编号
        "pricingTime": $("#time").val(),//定价时间
        "standardCosts": $("#cost").val(),//费用标准
        "dormitoryId": $("#dormitory").val() //宿舍编号
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

});
//添加住宿费
$(".add").on("click",function(){
    $(".btn-primary").attr("genre","add"); //点击提交按钮时设置标识 添加
    $(".pop").css({display:"none"});
    $("#myModalLabel").html("添加住宿费");
    $("#campus").val("");               //初始化模态框字段 置空
    $("#apartment").val("");
    $("#dormitoryName").val("");
    $("#count").val("");
    initPick('#campus','#apartment',json)
})

//修改住宿费
$("body").on("click",".change",function(){
    var that = this;
    $(".btn-primary").attr("genre","mod"); //点击提交按钮时设置标识 添加
    $(".pop").css({display:"none"});
    $("#myModalLabel").html("修改住宿费信息");

    var obj = {}
    var dataId = $(this).attr('data-id')*1
    data.cost.forEach(function(item){
        if(item.id == dataId)
            obj = item
    })
    $("#campus").attr('data-id',obj.campusId); 
    $("#apartment").attr('data-id',obj.apartmentId*1);
    $("#dormitory").attr('data-id',obj.dormitoryId*1);
    $("#time").val(obj.pricingTime);
    if(obj.pricingTime == '2016-05-01') 
        $("#cost").html(`<option value="370">370</option>
            <option value="470">470</option>
            <option value="570">570</option>  `)
    if(obj.pricingTime == '2017-10-01') 
        $("#cost").html(`<option value="470">470</option>
            <option value="570">570</option>
            <option value="670">670</option>`)
    if(obj.pricingTime == '2018-02-01') 
        $("#cost").html(`<option value="570">570</option>
            <option value="670">670</option>
            <option value="770">770</option> `)
    $("#cost").val(obj.standardCosts);
    initPick('#campus','#apartment',json)

    $(".btn-primary").off("click")
    $(".btn-primary").on("click",function(){
        var comNum = 0;
        var objLength = 0;
        var obj = {
            "campusId": $("#campus").val(),//校区编号
            "apartmentId": $("#apartment").val(),  //公寓编号
            "pricingTime": $("#time").val(),//定价时间
            "standardCosts": $("#cost").val(),//费用标准
            "dormitoryId": $("#dormitory").val() //宿舍编号
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
                data.cost.forEach(function(item,index){
                    if(obj.id == item.id){  
                        data.cost[index] = obj
                        return
                    }
                })
                // console.log(obj)
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
               data.cost.forEach(function(item,index){
                   if(item.id == id){
                       data.cost.splice(index,1)
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
              data.cost.forEach(function(item,index){
                      if(idItem == item.id){
                          data.cost.splice(index,1)
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