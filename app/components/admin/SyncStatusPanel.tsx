'use client';

import { useState, useEffect } from 'react';
import { getSyncStatus, syncFrontendData, SyncStatus, addDataChangeListener } from '../../utils/dataService';

interface SyncStatusPanelProps {
  locale: string;
}

export default function SyncStatusPanel({ locale }: SyncStatusPanelProps) {
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [logMessages, setLogMessages] = useState<string[]>([]);
  
  // 添加日志消息
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    setLogMessages(prev => [logMessage, ...prev].slice(0, 10)); // 保留最新的10条消息
  };
  
  // 加载同步状态
  const loadSyncStatus = () => {
    const status = getSyncStatus();
    setSyncStatus(status);
    return status;
  };
  
  // 显示前端数据状态
  const getFrontendStatusText = () => {
    if (!syncStatus) return locale === 'en' ? 'Loading...' : '加载中...';
    
    return syncStatus.frontendDataStatus === 'available' 
      ? (locale === 'en' ? 'Available' : '有数据')
      : (locale === 'en' ? 'No Data' : '无数据');
  };
  
  // 显示管理端数据状态
  const getAdminStatusText = () => {
    if (!syncStatus) return locale === 'en' ? 'Loading...' : '加载中...';
    
    return syncStatus.adminDataStatus === 'available' 
      ? (locale === 'en' ? 'Available' : '有数据')
      : (locale === 'en' ? 'No Data' : '无数据');
  };
  
  // 显示同步状态
  const getSyncStatusText = () => {
    if (!syncStatus) return locale === 'en' ? 'Loading...' : '加载中...';
    
    switch (syncStatus.syncStatus) {
      case 'synced':
        return locale === 'en' ? 'Synced' : '已同步';
      case 'incomplete':
        return locale === 'en' ? 'Incomplete' : '数据不完整';
      case 'failed':
        return locale === 'en' ? 'Failed' : '同步失败';
      default:
        return locale === 'en' ? 'Unknown' : '未知状态';
    }
  };
  
  // 手动同步数据
  const handleSync = () => {
    setIsSyncing(true);
    addLog(locale === 'en' ? 'Manual sync started...' : '开始手动同步...');
    
    try {
      const success = syncFrontendData();
      addLog(success 
        ? (locale === 'en' ? 'Sync completed successfully' : '同步成功完成') 
        : (locale === 'en' ? 'Sync failed' : '同步失败'));
        
      // 重新加载同步状态
      const newStatus = loadSyncStatus();
      if (newStatus.message) {
        addLog(newStatus.message);
      }
    } catch (error) {
      addLog(locale === 'en' 
        ? `Sync error: ${error instanceof Error ? error.message : String(error)}` 
        : `同步错误: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsSyncing(false);
    }
  };
  
  // 初始化和设置事件监听器
  useEffect(() => {
    // 初始加载同步状态
    loadSyncStatus();
    
    // 添加数据变化监听器
    const cleanupListener = addDataChangeListener(() => {
      const newStatus = loadSyncStatus();
      addLog(locale === 'en' 
        ? 'Data change detected, status updated' 
        : '检测到数据变化，状态已更新');
      
      if (newStatus.message) {
        addLog(newStatus.message);
      }
    });
    
    // 添加初始日志
    addLog(locale === 'en' ? 'Page initialized...' : '页面初始化...');
    
    // 检查用户是否已登录
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    addLog(isLoggedIn 
      ? (locale === 'en' ? 'User is logged in' : '用户已登录') 
      : (locale === 'en' ? 'User is not logged in' : '用户未登录'));
    
    // 检查前端数据
    try {
      const gamesData = localStorage.getItem('stone_games_data');
      addLog(gamesData 
        ? (locale === 'en' ? 'Checking frontend data...' : '检查前端数据...') 
        : (locale === 'en' ? 'No frontend data found' : '未找到前端数据'));
    } catch (error) {
      addLog(locale === 'en' ? 'Error checking data' : '检查数据错误');
    }
    
    return () => {
      cleanupListener();
    };
  }, [locale]);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        {locale === 'en' ? 'Data Sync Status' : '数据同步状态'}
      </h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">
              {locale === 'en' ? 'Frontend Data:' : '前端数据:'}
            </p>
            <p className="text-base font-medium">
              {getFrontendStatusText()}
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">
              {locale === 'en' ? 'Admin Data:' : '管理员数据:'}
            </p>
            <p className="text-base font-medium">
              {getAdminStatusText()}
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">
              {locale === 'en' ? 'Status:' : '状态:'}
            </p>
            <p className={`text-base font-medium ${
              syncStatus?.syncStatus === 'synced' ? 'text-green-600' :
              syncStatus?.syncStatus === 'incomplete' ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {getSyncStatusText()}
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">
              {locale === 'en' ? 'Last Sync:' : '最后同步:'}
            </p>
            <p className="text-base font-medium">
              {syncStatus ? new Date(syncStatus.lastSyncTime).toLocaleString() : '-'}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className={`px-4 py-2 rounded ${
            isSyncing
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isSyncing
            ? (locale === 'en' ? 'Syncing...' : '同步中...')
            : (locale === 'en' ? 'Sync Frontend Data' : '同步前端数据')
          }
        </button>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2 text-gray-700">
          {locale === 'en' ? 'Debug Info' : '调试信息'}
        </h3>
        <div className="bg-gray-800 text-white p-4 rounded text-sm font-mono h-40 overflow-y-auto">
          {logMessages.map((log, index) => (
            <div key={index} className="mb-1">{log}</div>
          ))}
          {logMessages.length === 0 && (
            <div className="text-gray-400">
              {locale === 'en' ? 'No logs yet' : '暂无日志'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 