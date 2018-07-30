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

var data = JSON.parse(localStorage.getItem('data'))
//信息展示
function show(){
    var data = JSON.parse(localStorage.getItem('data'))
    var stuName = [],bedNum = [],dorNo = [],standardCosts = [],
        checkInDate = [],stateDays = [],cost = [],lastCost = [],
        costList = [],warmingFee = [],payWarmingList = []
    data.retreat.forEach((item, index) => {
        data.student.forEach(element => {
            if(element.studentNumber == item.studentNumber){
                stuName.push(element.name)
            }
        })
        data.payCost.forEach(items =>{
            if(items.studentNumber == item.studentNumber){
                costList.push({
                    studentNumber:items.studentNumber,
                    payDate: items.payDate,
                    prices: items.prices,
                    favorable: items.favorable
                })
            }
        })
        data.payWarming.forEach(items =>{
            if(items.studentNumber == item.studentNumber){
                payWarmingList.push({
                    studentNumber:items.studentNumber,
                    payDate: items.payDate,
                    prices: items.prices
                })
            }
        })
        
        data.checkIn.forEach(element => {
            if(element.studentNumber == item.studentNumber){
                dorNo.push(element.dormitoryNo)
                checkInDate.push(element.checkInDate)
                data.dormitory.forEach(ele =>{
                    if(ele.dormitoryNo == element.dormitoryNo){
                        bedNum.push(ele.bedNumber)

                        data.cost.forEach(e =>{
                            if(ele.id == e.dormitoryId){
                                standardCosts.push(e.standardCosts)
                            }
                        })
                        
                        data.warming.forEach(e =>{
                            if(ele.id == e.dormitoryId){
                                warmingFee.push({
                                    warmingFee: e.warmingFee,
                                    heatingTimeStart: e.heatingTime.split('~')[0],
                                    heatingTimeEnd: e.heatingTime.split('~')[1]
                                })
                            }
                        })
                    }
                })
            }
        })
        var dateOut = item.retreatDate
        var dateIn = checkInDate[index]
        var days = ( new Date(dateOut) - new Date(dateIn) ) / 86400000
        stateDays.push(days)

        var warmingStart,warmingEnd,warmingDay
        warmingStart = new Date(dateIn) - new Date(warmingFee[index].heatingTimeStart) > 0 ?
                       new Date(dateIn) : new Date(warmingFee[index].heatingTimeStart)
        warmingEnd = new Date(dateOut) - new Date(warmingFee[index].heatingTimeEnd) < 0 ?
                     new Date(dateOut) : new Date(warmingFee[index].heatingTimeEnd)
        // console.log(warmingEnd - warmingStart)
        warmingDay = (warmingEnd - warmingStart) / 86400000
        // console.log(warmingDay)

        var dayCost = standardCosts[index] / 30
        
        var warmingDayCost = warmingFee[index].warmingFee / 30
        // cost.push(parseInt(warmingDayCost * days))
        cost.push(parseInt(dayCost * days) + parseInt(warmingDayCost * warmingDay))
        console.log(cost)

        //缴费总计 优惠金额
        var totalCost = costList[costList.length-1].favorable * 1

        //缴费总计 住宿费
        costList.forEach(list =>{
            if(list.studentNumber == item.studentNumber){
                totalCost += list.prices * 1
            }
        })

        //缴费总计 取暖费
        payWarmingList.forEach(list =>{
            if(list.studentNumber == item.studentNumber){
                totalCost += list.prices * 1
            }
        })

        console.log(totalCost,cost[index])

        lastCost.push(parseInt(totalCost - cost[index]))
    })
    
    console.log(stuName,bedNum,dorNo,standardCosts,checkInDate,costList,stateDays,cost,lastCost,warmingFee,payWarmingList)

    var html = ''
    data.retreat.forEach((item,index) =>{
        var li = '',li2 = ''
        costList.forEach(ele =>{
            if(item.studentNumber == ele.studentNumber)
            li += `<li class="li">${ele.payDate} <span> ${ele.prices}元</span></li>`
        })
        payWarmingList.forEach(ele =>{
            if(item.studentNumber == ele.studentNumber)
            li2 += `<li class="li">${ele.payDate} <span> ${ele.prices}元</span></li>`
        })

        html += `<tr>
                    <td>
                        <input type="checkbox" name="" id="a1" class="selectItem" data-id=${item.id}>
                    </td>
                    <td>${item.studentNumber}</td>
                    <td>${stuName[index]}</td>
                    <td>${dorNo[index]}</td>
                    <td>${bedNum[index]}</td>
                    <td>
                        <ul class="all">
                            <li>悬浮查看
                                <ul>
                                    <li style="text-align:left;padding-left:10px;position:relative;top:5px;z-index:5;">住宿费:</li>
                                    ${li}
                                    <li style="text-align:left;padding-left:10px;position:relative;top:5px;z-index:5;">取暖费:</li>
                                    ${li2}
                                </ul>
                            </li>
                        </ul>
                    </td>
                    <td>${standardCosts[index]}</td>
                    <td>${checkInDate[index]}</td>
                    <td>${stateDays[index]}</td>
                    <td>${item.retreatDate}</td>
                    <td>${cost[index]}</td>
                    <td>${lastCost[index]}</td>
                    <td>
                        <span class="del" data-id=${item.id}>删除</span> /
                        <span class="change" data-toggle="modal" data-target="#myModal" data-id=${item.id}>修改</span>
                    </td>
                </tr>`
    })
    $('#checkOut').html(html)
}
show()

//添加缴纳取暖费信息
function add(obj){
    // var tr = `<tr>
    //             <td>
    //                 <input type="checkbox" name="" id="a1" class="selectItem">
    //             </td>
    //             <td>${obj.num}</td>
    //             <td>张三</td>
    //             <td>21-301</td>
    //             <td>30</td>
    //             <td>
    //                 <ul class="all">
    //                     <li>悬浮查看
    //                         <ul>
    //                             <li class="li">2018/3/15 <span> 10000元</span></li>
    //                             <li class="li">2018/4/15 <span> 2000元</span></li>
    //                             <li class="li">2018/5/15 <span> 4000元</span></li>
    //                         </ul>
    //                     </li>
    //                 </ul>
    //             </td>
    //             <td>570元</td>
    //             <td>2018/5/12</td>
    //             <td>3个月18天</td>
    //             <td>${obj.datepicker}</td>
    //             <td>16000</td>
    //             <td>2000</td>
    //             <td>
    //                 <span class="del">删除</span> /
    //                 <span class="change" data-toggle="modal" data-target="#myModal">修改</span>
    //             </td>
    //         </tr>`;
    // $("#mod tbody").prepend(tr);
    var data = JSON.parse(localStorage.getItem("data"))
    var dataId = data.retreat[0] ? data.retreat[0].id * 1 + 1 : 1
    obj.id = dataId

    var dorNo
    var data = JSON.parse(localStorage.getItem('data'))
    data.checkIn.forEach(item =>{
        if(item.studentNumber == obj.studentNumber){
            dorNo = item.dormitoryNo
            return
        }
    })
    // console.log(dorNo)
    data.dormitory.forEach(item =>{
        if(item.dormitoryNo == dorNo){
            item.lvingPopulation--
        }
    })

    data.retreat.unshift(obj)
    localStorage.setItem('data',JSON.stringify(data))
    location.reload()
}
    //提交按钮
$(".btn-primary").on("click",function(e){
    var comNum = 0;
    var objLength = 0;
    var obj = {
        "studentNumber": $("#num").val(),//学号
        "retreatDate": $("#datepicker").val()//退宿日期
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
    $("#myModalLabel").html("添加退宿信息");
    $("#num").val("");               //初始化模态框字段 置空
    $("#datepicker").val("");
})

//修改信息
$("body").on("click",".change",function(){
    var that = this;
    $(".btn-primary").attr("genre","mod"); //点击提交按钮时设置标识 添加
    $(".pop").css({display:"none"});
    $("#myModalLabel").html("修改退宿信息");

    var obj = {
        "datepicker": $(this).parent().prevAll().eq(2).html(), //退宿日期
        "num": $(this).parent().prevAll().eq(10).html()//学号
    }
                
    $("#num").val(obj.num);//初始化模态框字段
    $("#datepicker").val(obj.datepicker);

    var dataId = $(this).attr('data-id') * 1
    $(".btn-primary").on("click",function(){
        var comNum = 0;
        var objLength = 0;
        var obj = {
            "retreatDate": $("#datepicker").val(),
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
                // $(that).parent().prevAll().eq(10).html(obj.num)
                // $(that).parent().prevAll().eq(9).html("张三")
                // $(that).parent().prevAll().eq(8).html("21-301")
                // $(that).parent().prevAll().eq(7).html("30")
                // $(that).parent().prevAll().eq(6).html("悬浮查看")
                // $(that).parent().prevAll().eq(5).html("570元")
                // $(that).parent().prevAll().eq(4).html("02/12/2018")
                // $(that).parent().prevAll().eq(3).html("2个月18天")
                // $(that).parent().prevAll().eq(2).html(obj.datepicker)
                // $(that).parent().prevAll().eq(1).html("16000")
                // $(that).parent().prev().html("200")
                obj.id = dataId
                data.retreat.forEach(item =>{
                    if(item.id == obj.id){
                        item.studentNumber = obj.studentNumber
                        item.retreatDate = obj.retreatDate
                    }
                })
                localStorage.setItem('data',JSON.stringify(data))
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
               data.retreat.forEach(function(item,index){
                   if(item.id == id){
                       data.retreat.splice(index,1)
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
              data.retreat.forEach(function(item,index){
                      if(idItem == item.id){
                          data.retreat.splice(index,1)
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