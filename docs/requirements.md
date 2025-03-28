# Stone Games 游戏导航网站需求文档

## 项目概述

Stone Games是一个简单的游戏导航网站，通过iframe方式嵌入各种网页游戏，为用户提供便捷的游戏发现和体验平台。网站默认提供英文界面，同时支持中文语言切换，便于全球用户访问。

## 项目目标

1. 创建一个简洁易用的游戏导航平台
2. 通过iframe无缝嵌入网页游戏
3. 提供多语言支持（默认英文，支持中文）
4. 实现便捷的管理员后台，方便游戏内容管理
5. 部署在Cloudflare Pages上并绑定aistone.org域名

## 核心功能需求

### 用户端功能

1. **首页展示**
   - 游戏列表（图片+名称+简介）
   - 游戏分类导航
   - 语言切换功能（英文/中文）
   - 响应式设计（适配移动端和桌面端）

2. **游戏页面**
   - iframe游戏嵌入
   - 游戏信息展示
   - 返回首页功能
   - 全屏/调整尺寸选项

### 管理员功能

1. **管理员登录**
   - 安全的登录界面
   - 会话管理

2. **游戏管理**
   - 添加新游戏（表单提交）
   - 编辑现有游戏信息
   - 删除游戏
   - 设置游戏发布状态（显示/隐藏）

3. **分类管理**
   - 创建/编辑/删除游戏分类
   - 设置中英文分类名称

## 技术方案

### 前端技术栈
- Next.js框架
- React组件库
- TypeScript
- Tailwind CSS样式框架
- next-i18next国际化方案

### 数据管理
- JSON文件或轻量级数据库存储
- Next.js API Routes实现数据接口

### 部署环境
- GitHub代码仓库
- GitHub账号: [@peyoba](https://github.com/peyoba)
- Cloudflare Pages托管
- 自定义域名：aistone.org

## 数据结构

### 游戏数据
```json
{
  "id": "unique-game-id",
  "title": {
    "en": "Game Title in English",
    "zh": "游戏中文标题"
  },
  "description": {
    "en": "Game description in English",
    "zh": "游戏中文描述"
  },
  "iframeUrl": "https://example.com/game-url",
  "thumbnail": "/images/game-thumbnail.jpg",
  "category": "category-id",
  "active": true,
  "dateAdded": "2023-06-01T12:00:00Z"
}
```

### 分类数据
```json
{
  "id": "category-id",
  "name": {
    "en": "Category Name in English",
    "zh": "分类中文名称"
  },
  "order": 1,
  "active": true
}
```

## 开发计划与时间线

### 第一阶段：MVP核心功能（2周）

#### 第1周：基础框架搭建
- 创建Next.js项目框架
- 设计英文默认界面
- 实现中英文国际化框架
- 设计简洁的首页布局
- 实现基础导航组件
- 配置Cloudflare Pages部署环境

#### 第2周：核心功能实现
- 游戏卡片组件开发
- iframe嵌入功能实现
- 简单分类系统开发
- 响应式适配（移动端/桌面端）
- 管理员界面原型开发

### 第二阶段：管理功能（1周）
- 创建管理员登录界面
- 开发游戏管理功能
  - 添加新游戏表单
  - 编辑现有游戏
  - 删除游戏
- 开发游戏iframe链接上传功能
- 中英文内容管理系统

### 第三阶段：测试与部署（1周）
- 功能测试与Bug修复
- 性能优化
- Cloudflare Pages配置
- 域名绑定与DNS设置
- 上线发布

## 部署流程

1. 代码推送到GitHub仓库
2. GitHub Actions自动构建
3. 部署到Cloudflare Pages
   - 构建命令: `npm run build`
   - 输出目录: `.next`
4. 绑定aistone.org域名
   - 在Cloudflare Pages控制台添加自定义域名
   - 配置相应的DNS记录

## 后期迭代计划

### 第二版（用户体验提升）
- 搜索功能
- 游戏详情页面增强
- 游戏评分系统
- 本地收藏功能

### 第三版（社区功能）
- 用户账户系统
- 评论功能
- 收藏与历史记录云同步
- 游戏推荐算法

### 第四版（运营与变现）
- 多语言支持扩展
- 数据分析工具集成
- 广告接入
- 热门游戏推广位

## 验收标准

1. 网站能够正常展示游戏列表和分类
2. 成功嵌入外部游戏iframe并正常运行
3. 语言切换功能正常工作（默认英文，可切换中文）
4. 管理员能够添加、编辑和删除游戏
5. 网站在移动端和桌面端都能良好展示
6. 成功部署到Cloudflare Pages并通过aistone.org域名访问 