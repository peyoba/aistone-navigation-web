/**
 * 刷新监控脚本 - 监控并防止页面无限刷新
 * 
 * 该脚本必须在页面最前面加载，以便拦截可能导致刷新的APIs
 */
(function() {
  // 配置参数
  const CONFIG = {
    // 监控窗口时间（毫秒）
    TIME_WINDOW: 10000,
    
    // 在TIME_WINDOW时间内允许的最大刷新次数
    MAX_REFRESH_COUNT: 3,
    
    // 是否启用日志记录
    ENABLE_LOGGING: true,
    
    // 是否显示警告UI
    SHOW_WARNING_UI: true,
    
    // 是否阻止所有刷新尝试
    BLOCK_ALL_REFRESHES: false,
    
    // 是否监控网络请求
    MONITOR_NETWORK: true,
    
    // 是否监控DOM变化
    MONITOR_DOM: true
  };
  
  // 刷新计数器
  let refreshCounter = 0;
  
  // 上次刷新时间
  let lastRefreshTime = Date.now();
  
  // 是否检测到无限刷新
  let infiniteRefreshDetected = false;
  
  // 已拦截的刷新尝试
  let interceptedAttempts = [];
  
  // 已替换的API
  const replacedAPIs = [];
  
  // 重定向历史
  const redirectHistory = [];
  
  // 记录日志
  function log(...args) {
    if (CONFIG.ENABLE_LOGGING) {
      console.log('[刷新监控]', ...args);
    }
  }
  
  // 记录警告
  function warn(...args) {
    if (CONFIG.ENABLE_LOGGING) {
      console.warn('[刷新监控]', ...args);
    }
  }
  
  // 记录错误
  function error(...args) {
    if (CONFIG.ENABLE_LOGGING) {
      console.error('[刷新监控]', ...args);
    }
  }
  
  // 初始化状态检查
  function initStateCheck() {
    // 检查页面是否刚刚刷新
    try {
      const perfEntries = performance.getEntriesByType('navigation');
      if (perfEntries && perfEntries.length > 0) {
        const navType = perfEntries[0].type;
        log('页面导航类型:', navType);
        
        if (navType === 'reload') {
          // 记录刷新
          trackRefresh('performance.navigation', '页面显式重新加载');
        }
      }
    } catch (e) {
      error('无法检查导航类型:', e);
    }
    
    // 检查URL中的特殊参数
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('refresh_count')) {
        const count = parseInt(urlParams.get('refresh_count')) || 0;
        if (count > 0) {
          log(`检测到URL中的刷新计数: ${count}`);
          
          // 如果刷新计数过高，可能存在循环刷新
          if (count >= CONFIG.MAX_REFRESH_COUNT) {
            warn(`检测到可能的刷新循环，刷新计数为 ${count}`);
            infiniteRefreshDetected = true;
            showWarning(`检测到可能的刷新循环，已阻止进一步刷新。请检查控制台以获取更多信息。`);
          }
        }
      }
    } catch (e) {
      error('检查URL参数失败:', e);
    }
  }
  
  // 替换可能导致页面刷新的方法
  function replaceRefreshMethods() {
    try {
      // 备份原始方法
      const originalMethods = {
        assign: window.location.assign,
        replace: window.location.replace,
        reload: window.location.reload,
        setHref: Object.getOwnPropertyDescriptor(window.location, 'href').set,
        setTimeout: window.setTimeout,
        setInterval: window.setInterval,
        open: window.open,
        submit: HTMLFormElement.prototype.submit
      };
      
      // 替换 window.location.reload
      window.location.reload = function(forceGet) {
        const stack = new Error().stack || '';
        const caller = stack.split('\n')[2] || 'unknown';
        
        // 记录刷新尝试
        const attempt = {
          method: 'location.reload',
          time: new Date().toISOString(),
          caller: caller,
          args: [forceGet]
        };
        
        interceptedAttempts.push(attempt);
        
        // 检查是否应该阻止刷新
        if (shouldBlockRefresh('location.reload', caller)) {
          warn('已阻止 location.reload() 调用:', caller);
          return false;
        }
        
        // 追踪刷新并执行原始方法
        trackRefresh('location.reload', caller);
        return originalMethods.reload.apply(window.location, arguments);
      };
      replacedAPIs.push('location.reload');
      
      // 替换 window.location.assign
      window.location.assign = function(url) {
        const stack = new Error().stack || '';
        const caller = stack.split('\n')[2] || 'unknown';
        
        // 记录重定向尝试
        redirectHistory.push({
          from: window.location.href,
          to: url,
          time: new Date().toISOString(),
          method: 'location.assign',
          caller: caller
        });
        
        // 检查是否是同一URL导致的刷新循环
        if (url === window.location.href && shouldBlockRefresh('location.assign', caller)) {
          warn('已阻止 location.assign() 到相同URL的调用:', url, caller);
          return;
        }
        
        log('检测到 location.assign() 调用:', url, caller);
        return originalMethods.assign.call(window.location, url);
      };
      replacedAPIs.push('location.assign');
      
      // 替换 window.location.replace
      window.location.replace = function(url) {
        const stack = new Error().stack || '';
        const caller = stack.split('\n')[2] || 'unknown';
        
        // 记录重定向尝试
        redirectHistory.push({
          from: window.location.href,
          to: url,
          time: new Date().toISOString(),
          method: 'location.replace',
          caller: caller
        });
        
        // 检查是否是同一URL导致的刷新循环
        if (url === window.location.href && shouldBlockRefresh('location.replace', caller)) {
          warn('已阻止 location.replace() 到相同URL的调用:', url, caller);
          return;
        }
        
        log('检测到 location.replace() 调用:', url, caller);
        return originalMethods.replace.call(window.location, url);
      };
      replacedAPIs.push('location.replace');
      
      // 替换 window.location.href setter
      try {
        Object.defineProperty(window.location, 'href', {
          set: function(url) {
            const stack = new Error().stack || '';
            const caller = stack.split('\n')[2] || 'unknown';
            
            // 记录重定向尝试
            redirectHistory.push({
              from: window.location.href,
              to: url,
              time: new Date().toISOString(),
              method: 'location.href',
              caller: caller
            });
            
            // 检查是否是同一URL导致的刷新循环
            if (url === window.location.href && shouldBlockRefresh('location.href', caller)) {
              warn('已阻止 location.href 到相同URL的赋值:', url, caller);
              return;
            }
            
            log('检测到 location.href 赋值:', url, caller);
            return originalMethods.setHref.call(this, url);
          },
          
          get: function() {
            return window.location.toString();
          },
          
          configurable: true
        });
        replacedAPIs.push('location.href setter');
      } catch (e) {
        error('无法替换 location.href setter:', e);
      }
      
      // 监控表单提交
      HTMLFormElement.prototype.submit = function() {
        const stack = new Error().stack || '';
        const caller = stack.split('\n')[2] || 'unknown';
        
        log('检测到表单提交:', this.action || 'current page', caller);
        return originalMethods.submit.apply(this, arguments);
      };
      replacedAPIs.push('HTMLFormElement.prototype.submit');
      
      // 添加beforeunload事件监听器来检测页面卸载
      window.addEventListener('beforeunload', function(event) {
        const stack = new Error().stack || '';
        
        // 如果检测到无限刷新，阻止页面卸载
        if (infiniteRefreshDetected && CONFIG.BLOCK_ALL_REFRESHES) {
          event.preventDefault();
          event.returnValue = '页面似乎在无限刷新循环中。确定要离开吗？';
          return event.returnValue;
        }
        
        log('检测到页面卸载尝试', {
          url: window.location.href,
          time: new Date().toISOString(),
          stack: stack
        });
      });
      
      log('成功替换和监控刷新方法:', replacedAPIs.join(', '));
    } catch (e) {
      error('替换刷新方法失败:', e);
    }
  }
  
  // 监控网络请求
  function monitorNetwork() {
    if (!CONFIG.MONITOR_NETWORK) return;
    
    try {
      // 监控XMLHttpRequest
      const originalXHROpen = XMLHttpRequest.prototype.open;
      const originalXHRSend = XMLHttpRequest.prototype.send;
      
      XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        this._refreshMonitor_method = method;
        this._refreshMonitor_url = url;
        
        return originalXHROpen.apply(this, arguments);
      };
      
      XMLHttpRequest.prototype.send = function(data) {
        const stack = new Error().stack || '';
        const caller = stack.split('\n')[2] || 'unknown';
        
        log('检测到XHR请求:', this._refreshMonitor_method, this._refreshMonitor_url, caller);
        
        // 添加请求完成的监听器
        this.addEventListener('load', function() {
          if (this.status >= 300 && this.status < 400) {
            log('检测到XHR重定向:', this.status, this._refreshMonitor_url);
          }
        });
        
        return originalXHRSend.apply(this, arguments);
      };
      
      // 监控Fetch API
      const originalFetch = window.fetch;
      
      window.fetch = function(input, init) {
        const stack = new Error().stack || '';
        const caller = stack.split('\n')[2] || 'unknown';
        
        const url = typeof input === 'string' ? input : (input instanceof Request ? input.url : String(input));
        const method = init && init.method ? init.method : 'GET';
        
        log('检测到Fetch请求:', method, url, caller);
        
        return originalFetch.apply(this, arguments)
          .then(response => {
            if (response.redirected) {
              log('检测到Fetch重定向:', response.url, response.status);
            }
            return response;
          });
      };
      
      log('成功监控网络请求');
    } catch (e) {
      error('监控网络请求失败:', e);
    }
  }
  
  // 监控DOM变化
  function monitorDOM() {
    if (!CONFIG.MONITOR_DOM) return;
    
    try {
      // 创建MutationObserver来监控DOM变化
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          // 检查是否有<meta http-equiv="refresh">标签
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(function(node) {
              // 检查meta标签
              if (node.nodeName === 'META') {
                const httpEquiv = node.getAttribute('http-equiv');
                if (httpEquiv && httpEquiv.toLowerCase() === 'refresh') {
                  const content = node.getAttribute('content');
                  warn('检测到meta刷新标签:', content);
                  
                  // 如果检测到无限刷新，移除meta标签
                  if (infiniteRefreshDetected) {
                    warn('由于检测到无限刷新，已移除meta刷新标签');
                    node.parentNode.removeChild(node);
                  }
                }
              }
              
              // 检查iframe标签
              if (node.nodeName === 'IFRAME') {
                const src = node.getAttribute('src');
                log('检测到新iframe:', src);
              }
            });
          }
        });
      });
      
      // 监控整个文档
      observer.observe(document, {
        childList: true,
        subtree: true
      });
      
      log('成功监控DOM变化');
    } catch (e) {
      error('监控DOM变化失败:', e);
    }
  }
  
  // 追踪刷新
  function trackRefresh(method, caller) {
    const now = Date.now();
    const timeSinceLastRefresh = now - lastRefreshTime;
    
    // 更新计数器和时间
    refreshCounter++;
    lastRefreshTime = now;
    
    log(`页面刷新 #${refreshCounter}, 距上次刷新 ${timeSinceLastRefresh}ms, 方法: ${method}, 调用者: ${caller}`);
    
    // 检查是否可能存在无限刷新
    if (timeSinceLastRefresh < CONFIG.TIME_WINDOW) {
      // 检查刷新频率
      if (refreshCounter >= CONFIG.MAX_REFRESH_COUNT) {
        warn(`检测到可能的无限刷新循环: ${refreshCounter} 次刷新在 ${CONFIG.TIME_WINDOW}ms 内`);
        infiniteRefreshDetected = true;
        
        // 显示警告UI
        showWarning(`检测到可能的无限刷新循环，已阻止进一步刷新。请检查控制台以获取更多信息。`);
      }
    } else {
      // 重置计数器
      refreshCounter = 1;
    }
    
    // 将刷新计数添加到URL，以便在下一页面中追踪
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('refresh_count', refreshCounter.toString());
      
      // 使用历史API更新URL而不触发页面刷新
      window.history.replaceState({}, document.title, url.toString());
    } catch (e) {
      error('无法更新URL中的刷新计数:', e);
    }
  }
  
  // 检查是否应该阻止刷新
  function shouldBlockRefresh(method, caller) {
    // 如果检测到无限刷新并配置为阻止所有刷新，则阻止
    if (infiniteRefreshDetected && CONFIG.BLOCK_ALL_REFRESHES) {
      return true;
    }
    
    // 如果刷新计数超过阈值，则阻止
    if (refreshCounter >= CONFIG.MAX_REFRESH_COUNT) {
      return true;
    }
    
    // 其他情况不阻止
    return false;
  }
  
  // 显示警告UI
  function showWarning(message) {
    if (!CONFIG.SHOW_WARNING_UI) return;
    
    try {
      // 检查是否已经有警告元素
      let warningEl = document.getElementById('refresh-monitor-warning');
      
      if (!warningEl) {
        // 创建警告元素
        warningEl = document.createElement('div');
        warningEl.id = 'refresh-monitor-warning';
        warningEl.style.position = 'fixed';
        warningEl.style.top = '0';
        warningEl.style.left = '0';
        warningEl.style.right = '0';
        warningEl.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
        warningEl.style.color = 'white';
        warningEl.style.padding = '10px';
        warningEl.style.textAlign = 'center';
        warningEl.style.zIndex = '9999';
        warningEl.style.fontWeight = 'bold';
        
        // 添加关闭按钮
        const closeButton = document.createElement('button');
        closeButton.textContent = '×';
        closeButton.style.float = 'right';
        closeButton.style.backgroundColor = 'transparent';
        closeButton.style.border = 'none';
        closeButton.style.color = 'white';
        closeButton.style.fontSize = '20px';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = function() {
          warningEl.style.display = 'none';
        };
        
        warningEl.appendChild(closeButton);
        
        // 添加错误信息
        const messageEl = document.createElement('span');
        messageEl.textContent = message;
        warningEl.appendChild(messageEl);
        
        // 等到文档加载完毕再添加
        const addWarningToBody = function() {
          if (document.body) {
            document.body.appendChild(warningEl);
          } else {
            // 如果文档尚未加载完毕，稍后再试
            setTimeout(addWarningToBody, 100);
          }
        };
        
        addWarningToBody();
      } else {
        // 更新现有警告元素
        const messageEl = warningEl.querySelector('span');
        if (messageEl) {
          messageEl.textContent = message;
        }
        warningEl.style.display = 'block';
      }
    } catch (e) {
      error('显示警告UI失败:', e);
    }
  }
  
  // 导出API
  window.refreshMonitor = {
    getState: function() {
      return {
        refreshCounter,
        lastRefreshTime,
        infiniteRefreshDetected,
        interceptedAttempts,
        replacedAPIs,
        redirectHistory,
        config: CONFIG
      };
    },
    
    resetCounter: function() {
      refreshCounter = 0;
      lastRefreshTime = Date.now();
      infiniteRefreshDetected = false;
      log('刷新计数器已重置');
    },
    
    setConfig: function(newConfig) {
      Object.assign(CONFIG, newConfig);
      log('配置已更新:', CONFIG);
    },
    
    getInterceptedAttempts: function() {
      return [...interceptedAttempts];
    },
    
    getRedirectHistory: function() {
      return [...redirectHistory];
    }
  };
  
  // 初始化
  try {
    log('刷新监控脚本已激活');
    
    // 初始化状态检查
    initStateCheck();
    
    // 替换刷新方法
    replaceRefreshMethods();
    
    // 等到文档加载完毕再执行其他初始化
    const finishInit = function() {
      // 监控网络请求
      monitorNetwork();
      
      // 监控DOM变化
      monitorDOM();
      
      log('刷新监控初始化完成');
    };
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', finishInit);
    } else {
      finishInit();
    }
  } catch (e) {
    error('刷新监控初始化失败:', e);
  }
})(); 