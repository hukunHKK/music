var render = require('./render');
var index = localStorage.index||0,
    audio = new Audio(),
    musicList,
    percent;
$(audio).on('ended',function () {
  $('.ctr div:nth-child(4)').trigger('click');
})
$('.ctr').on('click','div:first-child',function() {
  $(this).toggleClass('like').toggleClass('not-like');
});
//上一曲
$('.ctr').on('click','div:nth-child(2)',function() {
  $(this).next().removeClass('play').addClass('pause');
  if(index==0){
    audio.src = '../../' + musicList[musicList.length - 1].audio;
    index = musicList.length - 1;
  }else{
    audio.src = '../../' + musicList[--index].audio;
  }
  localStorage.index = index;
  render.initParam();
  render.render(musicList[index]);
  audio.play();
});
//暂停
$('.ctr').on('click', 'div:nth-child(3)',function() {
  $(this).toggleClass('play').toggleClass('pause');
  if(audio.paused){
    render.getCurTime();
    audio.play();
  }else{
    render.pauseRender();
    audio.pause();
  }
})
//下一曲
$('.ctr').on('click', 'div:nth-child(4)', function () {
  $(this).prev().removeClass('play').addClass('pause');
  if (index == musicList.length - 1) {
    audio.src = '../../' + musicList[0].audio;
    index = 0;
  } else {
    audio.src = '../../' + musicList[++index].audio;
  }
  localStorage.index = index;
  render.initParam();
  render.render(musicList[index]);
  audio.play();
});
//进度条拖动
$('.point').on('touchstart',function(e) {
  
})
.on('touchmove',function(e) {
  var left = $('.re-pro').offset().left;
  var width = $('.re-pro').offset().width;
  var x = e.changedTouches[0].clientX;
  percent = (x - left)/width;
  percent = percent<=0?0:percent;
  percent = percent>=1?1:percent;
  console.log(percent)
  render.pauseRender();
  render.renderCurTime(percent);
  $('.cur-pro').css('transform', 'translate(' + (-100 + percent * 100) + '% )');
})
.on('touchend',function() {
  audio.currentTime = musicList[index].duration * percent;
  $('.ctr div:nth-child(3)').removeClass('play').addClass('pause');
  audio.play();
  render.getCurTime();
})
function getData() {
  $.ajax({
    url: './source/data.json',
    method: 'get',
    success: function (data) {
      musicList = data;
      audio.src = musicList[index].audio;
      audio.currentTime = musicList[index].duration * render.percent;
      render.render(data[index]);
    }
  })
}
getData();
