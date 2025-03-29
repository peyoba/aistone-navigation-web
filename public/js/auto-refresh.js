/**
 * 禁用所有可能的自动刷新行为
 */
(function() {
  console.log('初始化刷新保护...');
  
  // 保存原始方法引用
  const originalSetInterval = window.setInterval;
  const originalSetTimeout = window.setTimeout;
  const originalReload = window.location.reload;
  const originalAssign = window.location.assign;
  const originalReplace = window.location.replace;
  const originalGo = window.history.go;
  const originalBack = window.history.back;
  const originalForward = window.history.forward;
  
  // 创建封装方法，阻止可能导致刷新的操作
  window.setInterval = function(callback, delay) {
    // 允许长周期的定时器，阻止短周期可能导致刷新的定时器
    if (delay < 5000) {
      console.log('已阻止可能导致频繁刷新的setInterval调用:', delay);
      return null;
    }
    return originalSetInterval(callback, delay);
  };
  
  window.setTimeout = function(callback, delay) {
    // 阻止可能包含刷新相关代码的字符串回调
    if (typeof callback === 'string' && 
        (callback.includes('location') || callback.includes('reload'))) {
      console.log('已阻止可能导致页面刷新的setTimeout字符串调用');
      return null;
    }
    return originalSetTimeout(callback, delay);
  };
  
  // 重写location对象的方法
  window.location.reload = function() {
    console.log('已阻止页面reload调用');
    return false;
  };
  
  window.location.assign = function(url) {
    console.log('已阻止location.assign调用:', url);
    return false;
  };
  
  window.location.replace = function(url) {
    console.log('已阻止location.replace调用:', url);
    return false;
  };
  
  // 重写history对象的方法
  window.history.go = function(delta) {
    console.log('已阻止history.go调用:', delta);
    return false;
  };
  
  window.history.back = function() {
    console.log('已阻止history.back调用');
    return false;
  };
  
  window.history.forward = function() {
    console.log('已阻止history.forward调用');
    return false;
  };
  
  // 监控文档就绪状态变化
  document.addEventListener('readystatechange', function() {
    console.log('文档状态变化:', document.readyState);
  });
  
  // 在页面加载完成后执行，防止其他脚本覆盖我们的保护
  window.addEventListener('DOMContentLoaded', function() {
    console.log('DOM已加载，已安装自动刷新保护');
  });
  
  // 添加页面卸载前的确认，阻止可能的刷新
  window.addEventListener('beforeunload', function(e) {
    console.log('尝试卸载页面，已阻止');
    e.preventDefault();
    e.returnValue = '';
    return '';
  });
})(); 