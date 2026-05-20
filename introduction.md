# Java OOP Quiz 项目说明

这是一个用于学习和练习 Java 面向对象编程基础知识的交互式测验项目。项目当前由两个独立目录组成：

- `backend/`：Node.js + Express 后端，负责提供题库 API。
- `frontend/`：React + Vite 前端，负责页面展示、答题交互、随机出题、即时反馈和结果复盘。

项目页面标题和核心定位来自前端源码中的英文原文：

```jsx
<h1>Java OOP Quiz</h1>
<p>Learn Object-Oriented Programming step by step</p>
```

## 当前项目状态

项目目前是一个小型全栈 Web 应用，已经具备可运行的基础功能：

- 前端启动后自动请求 `/api/questions` 加载所有题目。
- 后端固定监听 `http://localhost:3001`。
- 前端 Vite 开发服务器固定使用 `http://localhost:3000`。
- Vite 通过代理把前端的 `/api` 请求转发到后端：

```js
server: {
  port: 3000,
  proxy: {
    '/api': 'http://127.0.0.1:3001'
  }
}
```

题库当前写死在 `backend/data/questions.js` 中，不依赖数据库。当前共有 15 道选择题，覆盖主题包括：

- Classes & Objects
- Encapsulation
- Inheritance
- Constructors
- Keywords
- Polymorphism
- Abstraction

题目结构示例：

```js
{
  id: 1,
  topic: "Classes & Objects",
  question: "What is a Class in Java?",
  options: [
    "An instance of an object",
    "A blueprint for creating objects",
    "A tool to delete files",
    "A type of number"
  ],
  correctIndex: 1,
  explanation: "A class is like a blueprint — for example, a car design. Objects are the actual things built from it, like a real car."
}
```

这里 `correctIndex` 表示正确答案在 `options` 数组中的下标。比如上例中 `correctIndex: 1` 对应 `"A blueprint for creating objects"`。

## 技术栈

### 后端

后端包信息中的英文描述是：

```json
"description": "Backend for Java OOP Quiz"
```

使用的主要依赖：

- `express`：创建 HTTP API 服务。
- `cors`：允许跨源请求。
- `nodemon`：开发环境自动重启服务。

后端启动脚本：

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

### 前端

前端包信息中的英文描述是：

```json
"description": "Frontend for Java OOP Quiz"
```

使用的主要依赖：

- `react`
- `react-dom`
- `vite`
- `@vitejs/plugin-react`

前端启动脚本：

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

## 目录结构

```text
.
├── backend/
│   ├── data/
│   │   └── questions.js
│   ├── package.json
│   ├── package-lock.json
│   ├── pnpm-lock.yaml
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProgressBar.jsx
│   │   │   ├── Question.jsx
│   │   │   └── Results.jsx
│   │   ├── App.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── pnpm-lock.yaml
│   ├── pnpm-workspace.yaml
│   └── vite.config.js
├── .gitignore
├── README.md
└── start.sh
```

注意：`backend/` 和 `frontend/` 目录里同时存在 `package-lock.json` 和 `pnpm-lock.yaml`。这表示项目历史上可能混用过 npm 和 pnpm。为了避免依赖树不一致，建议团队统一选择一种包管理器。

## 后端说明

后端入口是 `backend/server.js`。

核心代码：

```js
const express = require('express');
const cors = require('cors');
const questions = require('./data/questions');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
```

这段代码完成三件事：

- 引入 Express 和 CORS。
- 从 `./data/questions` 读取本地题库。
- 固定使用 `3001` 端口。

### API 接口

#### `GET /api/questions`

返回全部题目。

源码：

```js
app.get('/api/questions', (req, res) => {
  res.json(questions);
});
```

#### `GET /api/questions/:id`

按题目 ID 返回单道题。若没有找到，返回 404。

源码：

```js
app.get('/api/questions/:id', (req, res) => {
  const q = questions.find(q => q.id === parseInt(req.params.id));
  if (!q) return res.status(404).json({ error: 'Question not found' });
  res.json(q);
});
```

#### `POST /api/quiz/submit`

提交用户作答并由后端计算分数，适合 Assignment 6 使用 JMeter 做性能测试。

请求体示例：

```json
{
  "responses": [
    {
      "questionId": 1,
      "selectedOption": "A blueprint for creating objects"
    },
    {
      "questionId": 2,
      "selectedOption": null
    }
  ]
}
```

返回内容包含 `score`、`total`、`answeredCount`、`skippedCount` 和每题 review 结果。这里提交的是选项文本 `selectedOption`，不是选项下标，因为前端会随机打乱选项顺序。

### 数据来源

题库文件 `backend/data/questions.js` 导出一个数组：

```js
module.exports = questions;
```

当前没有数据库、管理员后台、题目新增接口或持久化用户成绩的功能。所有题目都需要直接改这个文件，quiz submit API 只返回本次评分结果，不保存历史记录。

## 前端说明

前端入口是 `frontend/src/main.jsx`：

```jsx
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

主应用逻辑在 `frontend/src/App.jsx`。

### 页面阶段

前端把页面分成三个阶段：

```js
const PHASE = { START: 'start', QUIZ: 'quiz', RESULTS: 'results' };
```

- `start`：开始页。
- `quiz`：答题页。
- `results`：结果页。

### 加载题目

应用加载时会请求后端：

```js
const res = await fetch('/api/questions');
if (!res.ok) throw new Error('Failed to load questions');
const data = await res.json();
rawQuestions.current = data;
setQuestions(data);
```

如果请求失败，页面会显示英文错误提示：

```js
setError('Could not load questions. Please make sure the server is running.');
```

这说明前端强依赖后端服务。如果只启动前端、不启动后端，页面无法加载题目。

### 随机题目和随机选项

项目不只是随机题目顺序，也会随机每道题的选项顺序：

```js
function prepareQuestions(raw) {
  return shuffle(raw).map(q => {
    const tagged = q.options.map((opt, i) => ({ opt, correct: i === q.correctIndex }));
    const shuffled = shuffle(tagged);
    return {
      ...q,
      options: shuffled.map(x => x.opt),
      correctIndex: shuffled.findIndex(x => x.correct),
    };
  });
}
```

这段代码的关键点是先把每个选项标记成 `{ opt, correct }`，洗牌后再重新计算 `correctIndex`。这样可以避免选项顺序被打乱后正确答案下标失效。

### 答题流程

用户点击开始按钮后：

```js
function startQuiz() {
  setQuestions(prepareQuestions(rawQuestions.current));
  setCurrentIndex(0);
  setAnswers([]);
  setAnswered(null);
  setPhase(PHASE.QUIZ);
}
```

用户选择答案时：

```js
function handleAnswer(optionIndex) {
  setAnswered(optionIndex);
}
```

点击下一题时：

```js
function handleNext() {
  const newAnswers = [...answers, answered];
  if (currentIndex + 1 >= questions.length) {
    setAnswers(newAnswers);
    setPhase(PHASE.RESULTS);
  } else {
    setAnswers(newAnswers);
    setCurrentIndex(currentIndex + 1);
    setAnswered(null);
  }
}
```

也就是说，答案只有在点击 `Next Question` 或 `Finish Quiz` 时才会正式写入 `answers`。

### 单题组件

单题展示组件是 `frontend/src/components/Question.jsx`。

组件会根据是否答对给选项添加不同 class：

```js
function getOptionClass(i) {
  if (!isAnswered) return '';
  if (i === correctIndex) return answered === i ? 'correct' : 'revealed';
  if (i === answered && answered !== correctIndex) return 'wrong';
  return '';
}
```

答题后会立即显示反馈：

```jsx
{answered === correctIndex
  ? <><span aria-hidden="true">✅</span> Correct! Well done!</>
  : <><span aria-hidden="true">❌</span> Not quite — the correct answer is {LETTERS[correctIndex]}.</>
}
```

### 进度条组件

进度条组件是 `frontend/src/components/ProgressBar.jsx`。

进度计算逻辑：

```js
const percent = Math.round((current / total) * 100);
```

它同时设置了无障碍属性：

```jsx
role="progressbar"
aria-valuenow={current}
aria-valuemin={1}
aria-valuemax={total}
```

### 结果页组件

结果页组件是 `frontend/src/components/Results.jsx`。

分数计算逻辑：

```js
const score = answers.filter((a, i) => a === questions[i].correctIndex).length;
const total = questions.length;
```

结果等级分为三档：

```js
if (pct >= 0.8) return 'great';
if (pct >= 0.5) return 'good';
return 'keep-going';
```

英文反馈文案包括：

```js
return 'Excellent work! You have a strong understanding of Java OOP.';
return 'Good effort! Review the questions you missed and try again.';
return 'Keep going! Practice makes perfect — try the quiz again.';
```

结果页还会列出每一道题，并在答错时显示：

```jsx
Your answer: {LETTERS[answers[i]]} — Correct: {LETTERS[q.correctIndex]}
```

## 样式与交互

样式集中在 `frontend/src/App.css`。当前 UI 特点：

- 页面主体使用卡片布局。
- 顶部固定文字大小工具栏。
- 支持 `XS`、`SM`、`MD`、`LG`、`XL`、`XXL` 六档文字大小。
- 正确答案使用绿色，错误答案使用红色。
- 结果页根据分数使用绿色、黄色、红色三种状态。
- 移动端通过 media query 调整卡片 padding、标题字号和按钮布局。

字体大小切换由 `App.jsx` 控制：

```js
root.classList.remove('font-xs', 'font-sm', 'font-md', 'font-lg', 'font-xl', 'font-xxl');
root.classList.add(`font-${fontSize}`);
```

对应 CSS：

```css
:root.font-xs { font-size: 14px; }
:root.font-sm { font-size: 16px; }
:root.font-md { font-size: 18px; }
:root.font-lg { font-size: 20px; }
:root.font-xl { font-size: 24px; }
:root.font-xxl { font-size: 28px; }
```

## 如何运行

请先确认本机已安装 Node.js。

### 方式一：分别启动

安装并启动后端：

```bash
cd backend
npm install
npm start
```

后端运行地址：

```text
http://localhost:3001
```

安装并启动前端：

```bash
cd frontend
npm install
npm run dev
```

前端运行地址：

```text
http://localhost:3000
```

浏览器打开：

```text
http://localhost:3000
```

### 方式二：使用 start.sh

根目录提供了 `start.sh`：

```bash
#!/bin/bash
echo "Starting Java OOP Quiz..."

# Start backend
cd backend && node server.js &
BACKEND_PID=$!
echo "Backend running at http://localhost:3001 (PID $BACKEND_PID)"

# Start frontend
cd ../frontend && npm run dev &
FRONTEND_PID=$!
echo "Frontend running at http://localhost:3000 (PID $FRONTEND_PID)"
```

运行：

```bash
./start.sh
```

注意：这个脚本假设依赖已经安装完成，而且它是 Bash 脚本。在 Windows PowerShell 中需要使用 Git Bash、WSL 或其他 Bash 环境运行。

## 如何构建前端

```bash
cd frontend
npm run build
```

构建产物默认输出到：

```text
frontend/dist/
```

本地预览构建结果：

```bash
cd frontend
npm run preview
```

## 如何新增题目

修改 `backend/data/questions.js`，在 `questions` 数组中添加新对象即可。

必须包含以下字段：

- `id`：题目唯一编号。
- `topic`：题目分类。
- `question`：题干。
- `options`：选项数组，当前前端按 A、B、C、D 展示，建议保持 4 个选项。
- `correctIndex`：正确选项的数组下标，从 0 开始。
- `explanation`：答题后的解释。

示例：

```js
{
  id: 16,
  topic: "Interfaces",
  question: "Which keyword is used to define an interface in Java?",
  options: ["interface", "class", "extends", "package"],
  correctIndex: 0,
  explanation: "The 'interface' keyword is used to define an interface in Java."
}
```

## 当前限制和注意事项

1. 没有数据库  
   所有题目都保存在 `backend/data/questions.js`，重启服务不会丢题，但不能通过页面动态增删改题。

2. 没有用户系统  
   项目不保存用户身份、历史成绩或学习进度。

3. 没有自动化测试代码  
   当前仓库没有单元测试、集成测试或端到端测试配置。Assignment 6 的性能测试文件建议放在 `src/test/resources/performancetest`。

4. 没有生产部署配置  
   当前只有开发服务器配置，没有 Dockerfile、CI/CD、云部署脚本或生产环境反向代理配置。

5. API 没有分页或过滤  
   `/api/questions` 一次返回全部题目。当前 15 道题没有性能问题，但题库增大后可能需要分页、分类过滤或按主题加载。

6. 端口是硬编码的  
   后端固定 `3001`，前端固定 `3000`。如果端口被占用，需要手动修改 `backend/server.js` 和 `frontend/vite.config.js`。

7. 包管理器需要统一  
   前后端目录都有 npm 和 pnpm 的 lock 文件。团队接手后建议明确使用 npm 或 pnpm 中的一种。

## 适合后续改进的方向

- 把题库从 JS 文件迁移到 JSON、SQLite、MongoDB 或其他数据库。
- 增加按主题选择测验，例如只练习 `Inheritance` 或 `Polymorphism`。
- 增加错题本和历史成绩。
- 增加管理员题库管理页面。
- 增加测试，例如后端 API 测试和前端组件测试。
- 增加环境变量，例如 `PORT`、`API_BASE_URL`。
- 增加部署配置，例如 Docker 或 GitHub Actions。
- 统一 UI 文案语言。目前页面文案主要是英文，README 是中文说明。

## 新接手者快速理解

如果你刚接手这个项目，可以按这个顺序阅读：

1. 先看 `backend/data/questions.js`，理解题库数据结构。
2. 再看 `backend/server.js`，理解后端 API：返回题目、按 ID 返回单题、提交 quiz 答案并评分。
3. 再看 `frontend/src/App.jsx`，理解主状态、页面阶段和答题流程。
4. 再看 `frontend/src/components/Question.jsx`，理解即时反馈和正确答案展示。
5. 再看 `frontend/src/components/Results.jsx`，理解成绩计算和复盘展示。
6. 最后看 `frontend/src/App.css`，理解页面样式、响应式布局和文字大小控制。

项目当前的核心逻辑非常集中，主要业务复杂度在前端的答题状态管理和题目选项随机化上。后端目前只是轻量 API 层。
