require('./gaussBlur');
var lastTime = 0,
    allTime,
    percent = Number(localStorage.percent)||0,
    frameId,
    lastPercent = Number(localStorage.percent)||0;
function renderImg(data) {
  var img = new Image();
  img.src = data.image;
  img.onload = function () {
    $('.img').append(img);
    gauss(img)
  }
}

function renderInfo(data) {
  var str = '<p>' + data.song + '</p>' +
    '<p>' + data.singer + '</p>' +
    '<p>' + data.album + '</p>';
  $('.info').html(str);
}

function renderProgress() {
  $('.cur-pro').css('transform', 'translate(' + (- 100 + percent * 100) + '% )');
}

function renderCurTime(data) {
  if (data !== undefined){
    lastPercent = percent = data;
  }
  $('.cur-time').html(formatTime(percent * allTime));
}
function getCurTime() {
  var startTime = new Date().getTime();
  cancelAnimationFrame(frameId);
  function frame() {
    var curTime = new Date().getTime();
    //同帧赋值缓存CPU升高
    localStorage.percent = percent = lastPercent + (curTime - startTime) / allTime / 1000;
    renderCurTime();
    renderProgress();
    frameId = requestAnimationFrame(frame);
  }
  frame();
}
function getAllTime(data) {
  $('.all-time').html(formatTime(data.duration));
}
function pauseRender() {
  lastPercent = percent;
  cancelAnimationFrame(frameId);
}
function formatTime(data) {
  var timeMin = data / 60 > 10 ? parseInt(data / 60) : '0' + parseInt(data / 60);
  var timeSec = data % 60 > 10 ? parseInt(data % 60) : '0' + parseInt(data % 60);
  var time = timeMin + ':' + timeSec;
  return time;
}
function islike(data) {
  var like = data.isLike ? 'like' : 'not-like';
  $('.ctr div:first-child')[0].className = like;
}

function gauss(img) {
  window.player.blurImg(img, $('.wrapper'));
}

function  initParam() {
  lastPercent = percent = 0;
  getCurTime();
}
function render(data) {
  allTime = data.duration;
  renderImg(data);
  renderInfo(data);
  getAllTime(data);
  islike(data);
  renderProgress();
  renderCurTime();
}

module.exports = {
  render:render,
  getCurTime: getCurTime,
  pauseRender: pauseRender,
  initParam: initParam,
  renderCurTime: renderCurTime,
  percent: percent
};
