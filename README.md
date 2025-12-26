# Todo-TS
一个基于 **React + TypeScript + Vite** 前端与 **Spring Boot + MyBatis + MySQL** 后端的简单待办清单（Todo List）项目。比较基础适合当作前后端分离练习项目，因此 README 也尽量记录清楚整体结构与体验，方便后来者快速上手。

## ✨ 功能特点 | Features
1. **任务管理**：支持创建、编辑、勾选/取消、删除待办事项。前端通过 `fetch` 调用 `/todo` REST 接口完成 CRUD 操作。
2. **多状态筛选**：提供 All / Active / Completed 三种过滤视图，便于聚焦当前任务状态。
3. **导入导出**：可以将任务列表导出为文本文件，或批量导入本地文本数据，方便备份与迁移。
4. **后端校验与日志**：Spring Boot 服务内包含基础的参数校验、异常处理与操作日志，保证操作可追踪。

## 🛠 技术栈 | Tech Stack
- **Frontend**: React 18, TypeScript, Vite, ESLint
- **Backend**: Spring Boot 2.7, MyBatis, Lombok, MySQL Connector
- **Build & Tooling**: npm / Vite for frontend, Maven for backend

## 📁 项目结构 | Project Structure
```
Todo-TS/
├── frontend/          # React + TS 单页应用
│   ├── src/
│   │   ├── components/  # Todo、Form、FilterButton、ImportExport 等组件
│   │   ├── utils/        # 文本导入导出工具
│   │   └── types/        # TypeScript 类型定义
│   └── package.json      # Vite 脚本与依赖
└── backend/           # Spring Boot 服务
    ├── src/main/java/org/example/todo/
    │   ├── controller/   # TodoController 暴露 REST 接口
    │   ├── service/      # 业务逻辑与实现
    │   ├── dao/          # MyBatis Mapper
    │   └── domain/       # TodoList 实体
    ├── src/main/resources/
    │   └── application.yml  # MySQL 连接配置
    └── pom.xml
```

## 🚀 快速开始 | Getting Started
### 1. 准备条件 | Prerequisites
- Node.js ≥ 18 & npm
- JDK 8+ & Maven 3+
- 本地 MySQL 数据库（默认连接：`jdbc:mysql://localhost:3306/todo_list`，用户名 `root`，密码 `123456`）

### 2. 初始化数据库 | Initialize Database
在本地 MySQL 中创建名为 `todo_list` 的数据库，并先建好 `todolist` 表（若尚未提供脚本，可参考下方示例）：
```sql
CREATE TABLE todolist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  completed TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
如需修改数据库连接信息，请同步更新 `backend/src/main/resources/application.yml`。

### 3. 启动后端 | Start Backend
```bash
cd backend
mvn spring-boot:run
```
服务默认运行在 `http://localhost:8075`。

### 4. 启动前端 | Start Frontend
```bash
cd frontend
npm install
npm run dev
```
Vite 开发服务器默认运行在 `http://localhost:5173`，已允许跨域访问后端。

## 📡 API 速览 | API Overview
| Method | Endpoint            | Description            |
|--------|---------------------|------------------------|
| GET    | `/todo/all`         | 获取全部任务列表       |
| POST   | `/todo/add`         | 新增任务               |
| POST   | `/todo/update`      | 编辑任务名称或状态     |
| POST   | `/todo/delete`      | 删除任务               |
| POST   | `/todo/import`      | 批量导入任务           |
| GET    | `/todo/export`      | 导出全部任务（JSON）   |

> 这些接口均使用 JSON 作为请求/响应格式，并由前端通过 `fetch` 直接调用。

## 🧭 开发心得 | Notes for Future Me
- 第一次尝试 React + TypeScript + Vite 的组合，体会到了组件拆分与类型约束带来的开发体验。
- 后端使用 MyBatis 注解版 Mapper，适合入门理解 SQL 与 Java 实体之间的映射关系。
- 导入导出等「锦上添花」的小功能，让项目除了基础 CRUD 外更具备实用性。

感谢阅读，也欢迎提出建议或 Issue，一起进步！
