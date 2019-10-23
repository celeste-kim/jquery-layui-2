var baseURL = "http://47.106.244.1:7777";
$(function(){
	reloadData();
	//初始化toast
	$(".toast").toast({
		autohide:true,
		delay:1500
	})
	//封装一个提示框的方法
	function message(msg){
		$(".toast .toast-body").text(msg);
		$(".toast").toast("show");
	}
	var one_id;
	// 数组去重
	function delSame(arr){
	    var temp = [];
	     //一个新的临时数组
	    for(var i = 0; i < arr.length; i++){
	        if(temp.indexOf(arr[i]) == -1){
	            temp.push(arr[i]);
	        }
	    }
	    return temp;
	}
	//点击显示模态框
	$('#con_menu').on('click','#raise',function(){
		$('#myModal').modal('show');
		console.log($(this));
		one_id = $(this).children().text();
	})
	//点击保存
	$('#btn_add').on('click',function(){
		var username = $('input[name=username]').val()
		var realname = $('input[name=realname]').val()
		var birth = $('input[name=birth]').val()
		var education = $('input[name=education]').val()
		var workTime = $('input[name=workTime]').val()
		var telephone = $('input[name=telephone]').val()
		//判断男女
		var gender = $('#gender').val();
		var data ={
			username:username,
			realname:realname,
			birth:birth,
			education:education,
			workTime:workTime,
			telephone:telephone,
			gender:gender,
			employmentId:one_id
		}
		$.post(baseURL+'/Jobhunter/quickRegistration',data,function(res){
			if(res.status==200){
					message('报名成功！');
				}else{
					message('报名失败！');
				}
		})
		//清空模态框
		$('.modal-body input').val("");
		//发布后模态框关闭
		$('#myModal').modal('hide');
	})
	//保存结束
	// 筛选
	$('#sb').on('click',function(){
		var pattern = new RegExp($('#ss').val(),'ig');
		//清空列表
		$('#con_menu').empty();
		$.get(baseURL+'/Employment/findAll',function(res){
			//判断响应状态
			if(res.status==200){
				//遍历
				res.data.forEach(function(item,index){
					//正则判断
					if(pattern.test(item.job)){
						//判断审核是否通过
						if(item.auditStatus=='审核通过'){
							//追加
							$(`<div class="m" id="main_content">
					            <h4>`+item.title+`</h4>
					            <div class="m_1">`+item.salary+` 元/月</div>
					            <div class="w">
					            	<div class="m_2 c1">`+item.welfare+`</div>
					            </div>
					            <div class="m_9">
					                <p>工作时间：`+item.workingHours+`</p>
					                <p>工作类型：`+item.job+`</p>
					                <p>招聘人数：`+item.num+`人</p>
					                <p>工作地点：`+item.city+`</p>
					            </div>
					            <div class="m_3" id="raise">一键报名<span>`+item.id+`</span></div>
					        </div>`).appendTo($('#con_menu'));
					        //追加结束
						}
						//判断审核是否通过结束
					}
					//正则判断结束
				})
				//遍历结束
			}
			//判断响应结束
		})
	})
	// 筛选结束
	// 职位
	$.get(baseURL+'/Employment/findAll',function(res){
		// 清空表
		$('#job li:not(:first)').empty();
		var allName =[];
		res.data.forEach(
			function(item){
				allName.push(item.job);
			})
		allName = delSame(allName);
		allName.forEach(function(item){
			$(`<li><a href="javascript:void(0)" >`+item+`</a>
            </li>`).appendTo($('#job'));
		})
	})
	// 职位结束
	//点击职位进行筛选
	$('#job').on('click','a',function(){
		//将其他的a标签样式移除
		$('#job a').removeClass('s');
		//给被点击的a标签加上样式
		$(this).addClass('s');
		// 获取标签的文字
		var job =$(this).text();
		//清空
		$('#con_menu').empty();
		//添加已选
		$('#selected').text(job);
		//当筛选条件为全部的时候
		if($(this).text()=='全部'){
			reloadData();
		}else{
			//将其他的重置为全部
			//将其他的a标签样式移除
			$('#welfare a').removeClass('s');
			//给全部的a标签加上样式
			$('#welfare_one').addClass('s');
			//将其他的a标签样式移除
			$('#place a').removeClass('s');
			//给全部的a标签加上样式
			$('#place_one').addClass('s');
			$.get(baseURL+'/Employment/findAll',function(res){
				// 判断状态
				if(res.status==200){
					// 遍历
					res.data.forEach(function(item){
						// 判断职位相等
						if(job==item.job){
							// 判断审核通过
							if(item.auditStatus=='审核通过'){
								$(`<div class="m" id="main_content">
						            <h4>`+item.title+`</h4>
						            <div class="m_1">`+item.salary+` 元/月</div>
						            <div class="w">
						            	<div class="m_2 c1">`+item.welfare+`</div>
						            </div>
						            <div class="m_9">
						                <p>工作时间：`+item.workingHours+`</p>
						                <p>工作类型：`+item.job+`</p>
						                <p>招聘人数：`+item.num+`人</p>
						                <p>工作地点：`+item.city+`</p>
						            </div>
						            <div class="m_3" id="raise">一键报名<span>`+item.id+`</span></div>
						        </div>`).appendTo($('#con_menu'));
							}
							// 判断审核通过结束1
						}
						// 判断职位结束
					})
					// 遍历结束
				}else{
					message('错误！');
				}
				// 判断状态结束
			})
		}
	})
	//点击职位进行筛选结束
	// 地点
	$.get(baseURL+'/Employment/findAll',function(res){
		// 清空表
		$('#place li:not(:first)').empty();
		var allName =[];
		res.data.forEach(
			function(item){
				allName.push(item.city);
			})
		allName = delSame(allName);
		allName.forEach(function(item){
			$(`<li><a href="javascript:void(0)" >`+item+`</a>
            </li>`).appendTo($('#place'))
		})
	})
	// 地点结束
	//点击地点进行筛选
	$('#place').on('click','a',function(){
		//将其他的a标签样式移除
		$('#place a').removeClass('s');
		//给被点击的a标签加上样式
		$(this).addClass('s');
		var place =$(this).text();
		$('#con_menu').empty();
		//添加已选
		$('#selected').text(place);
		//当筛选条件为全部的时候
		if($(this).text()=='全部'){
			reloadData();
		}else{
			//将其他的重置为全部
			//将其他的a标签样式移除
			$('#welfare a').removeClass('s');
			//给全部的a标签加上样式
			$('#welfare_one').addClass('s');
			//将其他的a标签样式移除
			$('#job a').removeClass('s');
			//给全部的a标签加上样式
			$('#job_one').addClass('s');
			$.get(baseURL+'/Employment/findAll',function(res){
				res.data.forEach(function(item){
					if(place==item.city){
						if(item.auditStatus=='审核通过'){
							$(`<div class="m" id="main_content">
					            <h4>`+item.title+`</h4>
					            <div class="m_1">`+item.salary+` 元/月</div>
					            <div class="w">
					            	<div class="m_2 c1">`+item.welfare+`</div>
					            </div>
					            <div class="m_9">
					                <p>工作时间：`+item.workingHours+`</p>
					                <p>工作类型：`+item.job+`</p>
					                <p>招聘人数：`+item.num+`人</p>
					                <p>工作地点：`+item.city+`</p>
					            </div>
					            <div class="m_3" id="raise">一键报名<span>`+item.id+`</span></div>
					        </div>`).appendTo($('#con_menu'));
						}
					}
				})
			})
		}
			
		
	})
	//点击地点进行筛选结束
	// 福利
	$.get(baseURL+'/Employment/findAll',function(res){
		// 清空表
		$('#welfare li:not(:first)').empty();
		var allName =[];
		res.data.forEach(
			function(item){
				allName.push(item.welfare);
			})
		allName = delSame(allName);
		allName.forEach(function(item){
			$(`<li><a href="javascript:void(0)" >`+item+`</a>
            </li>`).appendTo($('#welfare'))
		})
	})
	// 福利结束
	//点击地点进行筛选
	$('#welfare').on('click','a',function(){
		//将其他的a标签样式移除
		$('#welfare a').removeClass('s');
		//给被点击的a标签加上样式
		$(this).addClass('s');
		var welfare =$(this).text();
		$('#con_menu').empty();
		//添加已选
		$('#selected').text(welfare);
		//当筛选条件为全部的时候
		if($(this).text()=='全部'){
			reloadData();
		}else{
			//将其他的重置为全部
			//将其他的a标签样式移除
			$('#place a').removeClass('s');
			//给全部的a标签加上样式
			$('#place_one').addClass('s');
			//将其他的a标签样式移除
			$('#job a').removeClass('s');
			//给全部的a标签加上样式
			$('#job_one').addClass('s');
			$.get(baseURL+'/Employment/findAll',function(res){
				res.data.forEach(function(item){
					if(welfare==item.welfare){
						if(item.auditStatus=='审核通过'){
							$(`<div class="m" id="main_content">
					            <h4>`+item.title+`</h4>
					            <div class="m_1">`+item.salary+` 元/月</div>
					            <div class="w">
					            	<div class="m_2 c1">`+item.welfare+`</div>
					            </div>
					            <div class="m_9">
					                <p>工作时间：`+item.workingHours+`</p>
					                <p>工作类型：`+item.job+`</p>
					                <p>招聘人数：`+item.num+`人</p>
					                <p>工作地点：`+item.city+`</p>
					            </div>
					            <div class="m_3" id="raise">一键报名<span>`+item.id+`</span></div>
					        </div>`).appendTo($('#con_menu'));
						}
					}
				})
			})
		}
	})
	//点击地点进行筛选结束
    // 加载数据
	function reloadData(){
		$.get(baseURL+'/Employment/findAll',function(res){
			$('#con_menu').empty();
			res.data.forEach(function(item){
				if(item.auditStatus=='审核通过'){
					$(`<div class="m" id="main_content">
			            <h4>`+item.title+`</h4>
			            <div class="m_1">`+item.salary+` 元/月</div>
			            <div class="w">
			            	<div class="m_2 c1">`+item.welfare+`</div>
			            </div>
			            <div class="m_9">
			                <p>工作时间：`+item.workingHours+`</p>
			                <p>工作类型：`+item.job+`</p>
			                <p>招聘人数：`+item.num+`人</p>
			                <p>工作地点：`+item.city+`</p>
			            </div>
			            <div class="m_3" id="raise">一键报名<span>`+item.id+`</span></div>
			        </div>`).appendTo($('#con_menu'));
				}
			})
		})
	}
	// 加载数据结束
})