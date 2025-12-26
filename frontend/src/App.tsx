import { useState, useEffect } from "react";
import Todo from "./components/Todo";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import { Todo as TodoType } from "./types/todo";
import ImportExport from "./components/ImportExport";
import { exportToText, parseImportedText } from "./utils/fileUtils";

const FILTER_MAP = {
  All: () => true,
  Active: (task: TodoType) => !task.completed,
  Completed: (task: TodoType) => task.completed,
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

function App() {
  const [tasks, setTasks] = useState<TodoType[]>([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchTasks();
  }, []);

  // 获取任务
  async function fetchTasks() {
    try {
      const response = await fetch("http://localhost:8075/todo/all");
      if (response.ok) {
        const tasks = await response.json();
        setTasks(tasks);
      } else {
        const errorText = await response.text();
        console.error("获取任务失败:", errorText);
      }
    } catch (error) {
      console.error("获取任务失败:", error);
    }
  }

  // 添加任务
  async function addTask(name: string) {
    try {
      const response = await fetch("http://localhost:8075/todo/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, completed: false }),
      });
      if (response.ok) {
        const newTask = await response.json();
        setTasks([...tasks, newTask]);
      } else {
        const errorText = await response.text();
        console.error("添加任务失败:", errorText);
      }
    } catch (error) {
      console.error("添加任务失败:", error);
    }
  }

  // 切换任务的完成状态
  async function toggleTaskCompleted(id: number) {
    const task = tasks.find((task) => task.id === id);
    if (!task) return;

    try {
      const response = await fetch(`http://localhost:8075/todo/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          completed: !task.completed,
        }),
      });

      if (response.ok) {
        const updatedTasks = tasks.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        );
        setTasks(updatedTasks);
      } else {
        const errorText = await response.text();
        console.error("更新任务失败:", errorText);
      }
    } catch (error) {
      console.error("更新任务失败:", error);
    }
  }

  // 删除任务
  async function deleteTask(id: number) {
    try {
      const response = await fetch(`http://localhost:8075/todo/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        const remainingTasks = tasks.filter((task) => task.id !== id);
        setTasks(remainingTasks);
      } else {
        const errorText = await response.text();
        console.error("删除任务失败:", errorText);
      }
    } catch (error) {
      console.error("删除任务失败:", error);
    }
  }
  //let arr1 = Number[]

  // 编辑任务
  async function editTask(id: number, newName: string) {
    try {
      const response = await fetch(`http://localhost:8075/todo/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, name: newName }),
      });

      if (response.ok) {
        const updatedTasks = tasks.map((task) =>
          task.id === id ? { ...task, name: newName } : task
        );
        setTasks(updatedTasks);
      } else {
        const errorText = await response.text();
        console.error("编辑任务失败:", errorText);
      }
    } catch (error) {
      console.error("编辑任务失败:", error);
    }
  }

  // 导出任务
  async function exportTasks() {
    try {
      const textContent = exportToText(tasks); // 获取任务列表
      const blob = new Blob([textContent], {
        type: "text/plain;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `todo-list-${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a); // 删除临时元素
      URL.revokeObjectURL(url); // 释放内存
    } catch (error) {
      console.error("导出任务失败:", error);
    }
  }

  // 导入任务
  async function importTasks(file: File) {
    try {
      const text = await file.text(); // 读取文件内容
      const importedTasks = parseImportedText(text); // 解析文本为任务列表

      const response = await fetch("http://localhost:8075/todo/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(importedTasks),
      });

      if (response.ok) {
        await fetchTasks(); // 导入成功后重新加载任务列表
      } else {
        const errorText = await response.text();
        console.error("导入任务失败:", errorText);
      }
    } catch (error) {
      console.error("导入任务失败:", error);
      throw error; // 重新抛出错误，让 ImportExport 组件可以捕获并显示
    }
  }

  const taskList = tasks
    .filter(FILTER_MAP[filter as keyof typeof FILTER_MAP])
    .map((task) => (
      <Todo
        key={task.id}
        {...task}
        toggleTaskCompleted={toggleTaskCompleted}
        deleteTask={deleteTask}
        editTask={editTask}
      />
    ));

  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      <Form addTask={addTask} />
      <ImportExport onExport={exportTasks} onImport={importTasks} />
      <div className="filters btn-group stack-exception">
        {FILTER_NAMES.map((name) => (
          <FilterButton
            key={name}
            name={name}
            isPressed={name === filter}
            setFilter={setFilter}
          />
        ))}
      </div>
      <h2 id="list-heading">
        {taskList.length} {taskList.length === 1 ? "task" : "tasks"} remaining
      </h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {taskList}
      </ul>
    </div>
  );
}

export default App;
