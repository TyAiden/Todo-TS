import { Todo } from "../types/todo";

/**
 * 将任务列表导出为文本格式
 * @param tasks 要导出的任务列表
 * @returns 格式化的文本字符串
 */
export const exportToText = (tasks: Todo[]): string => {
  try {
    let textContent = `任务列表 - 导出时间：${new Date().toLocaleString()}\n`;
    textContent += `总任务数：${tasks.length}\n`;
    textContent += `已完成任务数：${
      tasks.filter((task) => task.completed).length
    }\n`;
    textContent += "----------------------------------------\n\n";

    tasks.forEach((task, index) => {
      textContent += `${index + 1}. ${task.name}\n`;
      textContent += `   状态：${task.completed ? "已完成" : "未完成"}\n`;
      textContent += `   创建时间：${
        task.createdAt ? new Date(task.createdAt).toLocaleString() : "未知"
      }\n`;
      textContent += "----------------------------------------\n";
    });

    return textContent;
  } catch (error) {
    throw new Error(error + "导出任务时发生错误：任务数据格式不正确");
  }
};

/**
 * 解析导入的文本内容为任务列表
 * @param textContent 要解析的文本内容
 * @returns 任务列表
 * @throws 如果文件格式无效则抛出错误
 */
export const parseImportedText = (textContent: string): Todo[] => {
  try {
    if (!textContent.trim()) {
      throw new Error("导入的文件内容为空");
    }

    const tasks: Todo[] = [];
    const lines = textContent.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // 跳过空行
      if (!line) continue;

      // 解析任务名称（移除序号和点）
      const taskName = line.replace(/^\d+\.\s*/, "").trim();

      if (taskName) {
        tasks.push({
          id: tasks.length + 1,
          name: taskName,
          completed: false, // 默认未完成
        });
      }
    }

    if (tasks.length === 0) {
      throw new Error("没有找到有效的任务");
    }

    return tasks;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("解析导入文件时发生错误");
  }
};

/**
 * 验证文件大小是否在允许范围内
 * @param file 要验证的文件
 * @returns boolean
 * @throws 如果文件大小超出限制则抛出错误
 */
export const validateFileSize = (file: File): boolean => {
  const maxSize = 1024 * 1024; // 1MB
  if (file.size > maxSize) {
    throw new Error(
      `文件大小超出限制：最大允许 1MB，当前文件大小 ${(
        file.size / 1024
      ).toFixed(2)}KB`
    );
  }
  return true;
};

/**
 * 验证文件类型
 * @param file 要验证的文件
 * @returns boolean
 * @throws 如果文件类型不正确则抛出错误
 */
export const validateFileType = (file: File): boolean => {
  if (!(file.type === "text/plain" || file.name.endsWith(".txt"))) {
    throw new Error("文件类型不正确：请选择 .txt 文本文件");
  }
  return true;
};
