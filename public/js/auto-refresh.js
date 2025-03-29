/**
 * 禁用所有可能的自动刷新行为
 */
(function() {
  // 停止可能的定时器刷新
  const originalSetInterval = window.setInterval;
  const originalSetTimeout = window.setTimeout;
  
  window.setInterval = function(callback, delay) {
    if (delay < 10000) { // 禁用短于10秒的间隔
      console.log('已阻止可能导致频繁刷新的setInterval调用');
      return null;
    }
    return originalSetInterval(callback, delay);
  };
  
  window.setTimeout = function(callback, delay) {
    if (typeof callback === 'string' && 
        (callback.includes('location') || callback.includes('reload'))) {
      console.log('已阻止可能导致页面刷新的setTimeout调用');
      return null;
    }
    return originalSetTimeout(callback, delay);
  };
  
  // 阻止location相关刷新
  const originalReload = window.location.reload;
  window.location.reload = function() {
    console.log('已阻止页面自动刷新');
    return false;
  };
  
  // 在页面加载完成后执行
  window.addEventListener('DOMContentLoaded', function() {
    console.log('已安装自动刷新保护');
  });
})(); 