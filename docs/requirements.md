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

## 部署最佳实践

为避免部署过程中可能遇到的问题，特总结以下最佳实践和注意事项：

### 项目初始化

1. **使用官方工具创建项目**
   - 使用`npx create-next-app`初始化项目，确保基础配置正确
   - 选择正确的选项：TypeScript、ESLint、Tailwind CSS等
   - 不要手动修改核心配置文件，除非明确知道改动的影响

2. **依赖包管理**
   - 确保`package.json`中不包含不存在的或废弃的依赖包
   - 定期更新依赖包以避免安全问题
   - 避免使用非官方或维护不活跃的依赖包

3. **配置文件正确性**
   - Next.js配置使用`next.config.js`或`next.config.mjs`，不要使用`.ts`格式
   - Tailwind配置需包含正确的`content`路径设置
   - PostCSS配置使用标准格式：`{ plugins: { tailwindcss: {}, autoprefixer: {} } }`

### TypeScript配置

1. **合理的类型检查级别**
   - 项目初期考虑使用较宽松的设置：`"strict": false`
   - 随着项目成熟可逐步增加严格度
   - 始终为函数添加明确的返回类型注解，特别是异步函数

2. **类型定义完整性**
   - 确保所有组件和函数都有适当的类型定义
   - 避免过度使用`any`类型
   - 对第三方库缺少类型定义的情况，添加自定义声明文件

### 构建与部署流程

1. **本地验证**
   - 每次提交前在本地运行完整构建：`npm run build`
   - 修复所有编译错误和TypeScript错误
   - 测试生产环境构建结果

2. **Cloudflare Pages特定配置**
   - 使用正确的构建命令：`npm run build`
   - 设置输出目录为：`.next`
   - 添加环境变量：`NODE_VERSION=18.x`或更高版本
   - 考虑添加`wrangler.toml`文件进行更精细的控制

3. **渐进式问题解决**
   - 解决一个问题后检查是否引入了新问题
   - 采用小步迭代的方式解决问题，而不是大规模修改
   - 保持提交历史清晰，每次提交解决一个具体问题

### 常见问题及解决方案

1. **依赖问题**
   - 症状：`npm ERR! code ETARGET`或找不到模块错误
   - 解决：检查`package.json`中的依赖是否存在或版本是否正确

2. **配置文件格式错误**
   - 症状：`Error: Configuring Next.js via 'next.config.ts' is not supported`
   - 解决：将配置文件转换为`.js`或`.mjs`格式

3. **TypeScript类型错误**
   - 症状：`implicitly has return type 'any'`或类型不匹配错误
   - 解决：添加明确的类型注解，或放宽TypeScript配置

4. **Tailwind CSS问题**
   - 症状：`The content option in your Tailwind CSS configuration is missing or empty`
   - 解决：在`tailwind.config.js`中正确配置内容路径

5. **i18n国际化问题**
   - 症状：翻译函数返回类型错误
   - 解决：确保翻译函数返回的是字符串类型，并添加类型保护

通过遵循以上最佳实践，可以显著减少部署过程中遇到的问题，提高开发效率和代码质量 