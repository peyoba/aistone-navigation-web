# Stone Games - 游戏导航网站

Stone Games是一个简单的游戏导航网站，通过iframe方式嵌入各种网页游戏，为用户提供便捷的游戏发现和体验平台。

## 功能特点

- 游戏分类浏览
- iframe无缝嵌入游戏
- 多语言支持（英文/中文）
- 响应式设计（适配移动端和桌面端）
- 管理员后台（游戏管理）

## 技术栈

- Next.js
- React
- TypeScript
- Tailwind CSS
- i18next（国际化）

## 开发环境设置

1. 克隆仓库
```bash
git clone https://github.com/peyoba/aistone-navigation-web.git
cd aistone-navigation-web
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 在浏览器中访问 [http://localhost:3000](http://localhost:3000)

## 项目结构

```
/app                  # Next.js App目录
  /components         # React组件
    /games           # 游戏相关组件
    /layout          # 布局组件
    /ui              # 通用UI组件
  /data              # 数据文件
  /utils             # 工具函数
/public               # 静态资源
  /images            # 图片资源
  /locales           # 国际化翻译文件
/docs                 # 项目文档
```

## 部署

本项目配置为部署在Cloudflare Pages上：

1. 推送代码到GitHub仓库
2. 在Cloudflare Pages控制台中创建新项目
3. 连接GitHub仓库
4. 配置构建设置:
   - 构建命令: `npm run build`
   - 输出目录: `.next`
5. 添加自定义域名: aistone.org

## 管理员账号

- 用户名: admin
- 密码: admin123

## 许可

本项目基于MIT许可 