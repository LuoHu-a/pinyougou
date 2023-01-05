window.addEventListener('load',function(){
  //1.获取元素
  const arrow_l = document.querySelector('.arrow-l')
  const arrow_r = document.querySelector('.arrow-r')
  const focus = document.querySelector('.focus')
  const focusWidth = focus.offsetWidth
  //节流阀：当上一个函数动画内容执行完毕，再去执行下一个函数动画，让时间无法连续触发
  //核心思路：利用回调函数，添加一个变量来控制，锁住函数和解锁函数
  //开始设置一个变量 flag=true
  //if(flag){flag=false;do something}  关闭水龙头
  //利用回调函数 动画执行完毕，flag=true 打开水龙头
  // 2.鼠标经过focus 就显示隐藏左右按钮
  focus.addEventListener('mouseenter',function(){
      //鼠标进入轮播图区域，左右按钮显示
      arrow_l.style.display = 'block'
      arrow_r.style.display = 'block'
      //停止定时器
      clearInterval(timer)
      timer = null
  })
  focus.addEventListener('mouseleave',function(){
      //鼠标离开轮播图区域，左右按钮隐藏
      arrow_l.style.display = 'none'
      arrow_r.style.display = 'none'
      //开启定时器
      timer = setInterval(function(){
        //手动调用右侧按钮点击事件
        arrow_r.click()
    },2000)
  })
  //3.动态生成小圆圈   有几张图片,就生成几个小圆圈
  //先得到ul里面图片的张数（图片放在li里面，所以就是li的个数）
  //利用for循环动态生成小圆圈（这个小圆圈要放入ol里面）
  //创建节点 createElement('li')
  //插入节点 ol.appendChild(li)
  const ul = focus.querySelector('ul')   //用focus限制以获取focus区域的ul
  const ol = focus.querySelector('.circle')
  for(let i =0; i < ul.children.length; i++){
      //创建一个小li
      const li = document.createElement('li')
      //记录当前小圆圈的索引号，通过自定义属性来做
      li.setAttribute('index',i)  //把i的值赋值给index
      //把小li插入到ol里面
      ol.appendChild(li)
      //4.小圆圈的排他思想
      //点击当前小圆圈，就添加current类
      //其余小圆圈就移除这个current类
      //注意：在生成小圆圈的时候就可以直接绑定点击事件
      li.addEventListener('click',function(){
          //移除所有li的current类名
          for(let i = 0;i < ol.children.length; i++){
              ol.children[i].className=''
          }
          //留下自己的类 当前的li设置current类名
          this.className='current'
          //5.点击小圆圈滚动图片
          //用到缓动动画函数animate动画函数
          //使用动画函数的前提，该元素必须有定位
          //注意是ul移动而不是li
          //核心算法：点击某个小圆圈，让图片滚动 小圆圈的**索引号乘以图片的宽度**作为ul的移动距离(负值)
          //设置自定义属性，点击的时候获取这个自定义属性
          //当我们点击了某个小li，就拿到当前小li的索引号
          let index = this.getAttribute('index')
          //当我们点击了某个小li，就拿到当前小li的索引号给num和circle
          num = index
          circle = index
          // num = circle = index
          animate(ul, -index * focusWidth)
      })
  }
  //第一个小圆圈需要添加current类
  ol.children[0].className = 'current'
  // 6. 克隆第一张图片(li) 放到ul 最后面       
  //加true深克隆 复制里面的子节点  false浅克隆 不复制该节点里面的节点  
  //克隆图片是在创建小圆点后边,不用担心小圆点数量
  const first = ul.children[0].cloneNode(true)
  ul.appendChild(first)
  
  //7.点击右侧按钮，让图片滚动一张
  //声明一个变量num,点击一次自增1，让这个变量乘以图片宽度就是ul的滚动距离
  //图片无缝滚动原理：把ul第一个li复制一份放在ul的最后面
  //当图片滚动到克隆的最后一张时，让ul快速不做动画的跳到最左侧：left为0
  //同时num赋值为0，就可以重新开始滚动图片
  let num = 0
  //circle控制小圆圈的播放
  let circle = 0
  //flag 节流阀
  let flag = true
  arrow_r.addEventListener('click',function(){
      if(flag){
          //关闭节流阀
          flag = false
          if(num == ul.children.length - 1){
          ul.style.left = 0
          num = 0
      }
      num++
          animate(ul, -num * focusWidth, function(){
              flag = true //打开节流阀
          })
      //8.点击右侧按钮，小圆圈跟随变化
      //声明一个变量circle,每次点击自增1，左侧点击也需要用到，所以可以声明为全局变量
      //5张图片只有4个小圆圈，必须加一个判断条件（如果circle==4，重新复原为0）
      circle++
      //if(circle == ol.children.length) {
      //    circle = 0
      //}
      circle = circle == ol.children.length ? 0 : circle
      //调用函数        
      circleChange()
      }
  })
  
  //9.点击左侧按钮
  arrow_l.addEventListener('click',function(){
      if(flag){
          flag = false
          if(num == 0){
          num = ul.children.length - 1
          ul.style.left = -num * focusWidth + 'px'    
      }
      num--
          animate(ul, -num * focusWidth, function(){
              flag = true
          })
      //8.点击右侧按钮，小圆圈跟随变化
      //声明一个变量circle,每次点击自增1，左侧点击也需要用到，所以可以声明为全局变量
      //如果circle < 0 说明第一张图片则小圆圈要改为第4个小圆圈（3） 
      circle--
      //if(circle < 0 ) {
      //    circle = ol.children.length - 1
      //}
      circle = circle < 0 ? ol.children.length - 1 : circle
      //调用函数
      circleChange()
      }
  })
  function circleChange(){
      //先清除其余小圆圈的current类名
      for(let i=0;i < ol.children.length; i++){
          ol.children[i].className = ''
      }
      //留下当前的小圆圈的current类名
      ol.children[circle].className = 'current'
  }
  
  //10.自动播放轮播图
  let timer = setInterval(function(){
      //手动调用右侧按钮点击事件
      arrow_r.click()
  },2000)

  //11.显示隐藏电梯导航
  const recom = document.querySelector('.recom')
  const fixedtool = document.querySelector('.fixedtool')
  let toolTop = recom.offsetTop
  //12.页面滚动事件
  document.addEventListener('scroll',function() {
    //页面卷去的头部大小等于到推荐的距离 此时侧边看要改为固定定位
    if(window.pageYOffset >= toolTop) {
        fixedtool.style.display = 'block'
        fixedtool.style.position = 'fixed'
    }else {
        fixedtool.style.display = 'none'
        fixedtool.style.position = 'absolute'
    }
  })

  //13.点击小li滚动到对应内容区域，左侧电梯导航小li相应添加和删除current类名
  const fixedToolArr = document.querySelectorAll('.fixedtool ul li')
  const jumpArr = document.querySelectorAll('.jump')
  for(let i = 0;i < fixedToolArr.length;i++){
    fixedToolArr[i].addEventListener('click',function(){
        if(flag){
            //排他思想
            for(let i = 0; i < fixedToolArr.length; i++){
                fixedToolArr[i].className=''
            }
            fixedToolArr[i].className = 'current'
            Scroll(window,jumpArr[i].offsetTop,function(){
                flag = true
            })
        }
    })
    
  }
  //14.当页面移动到某个区域时，左侧电梯导航小li相应添加和删除current类名
  document.addEventListener('scroll',function() {
        for(let i = 0;i < fixedToolArr.length;i++){
            if(window.pageYOffset >= jumpArr[i].offsetTop) {      
                for(let i = 0; i < fixedToolArr.length; i++){
                    fixedToolArr[i].className='' 
                }
                fixedToolArr[i].className = 'current'
            }
        }
  })
    
    function Scroll(obj,target,callback) {
        clearInterval(obj.timer)
        obj.timer = setInterval(function() {
            let step = (target - window.pageYOffset) / 10
            step = step > 0 ? Math.ceil(step) : Math.floor(step)
            if(window.pageYOffset === target) {
                clearInterval(obj.timer)
                callback && callback()
            }
            window.scroll(0, window.pageYOffset + step)
        },15)
    }
})