package org.example.todo.service.impl;

import org.example.todo.dao.TodoMapper;
import org.example.todo.domain.TodoList;
import org.example.todo.exception.TodoException;
import org.example.todo.service.TodoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service  // 标记为Spring的Service类
public class TodoServiceImpl implements TodoService {
    private static final Logger logger = LoggerFactory.getLogger(TodoServiceImpl.class);

    @Autowired
    private TodoMapper todoMapper;

    @Override
    @Transactional
    public TodoList addTodo(String name, Boolean completed) {
        if (name == null || name.trim().isEmpty()) {
            throw new TodoException("Task name cannot be empty");
        }

        TodoList todo = new TodoList();
        todo.setName(name.trim());
        todo.setCompleted(completed != null ? completed : false);

        try {
            int result = todoMapper.addTodo(todo);
            if (result <= 0) {
                throw new TodoException("Failed to add todo");
            }

            TodoList addedTodo = todoMapper.getTodoById(todo.getId());
            logger.info("Added new todo: {}", addedTodo);
            return addedTodo;
        } catch (Exception e) {
            logger.error("Error adding todo: {}", e.getMessage(), e);
            throw new TodoException("Failed to add todo: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public Optional<TodoList> updateTodo(Integer id, String name, Boolean completed) {
        if (id == null) {
            throw new TodoException("Todo ID cannot be null");
        }

        try {
            TodoList todo = todoMapper.getTodoById(id);
            if (todo == null) {
                logger.warn("Todo not found: id={}", id);
                return Optional.empty();
            }

            if (name != null) {
                todo.setName(name.trim());
            }
            if (completed != null) {
                todo.setCompleted(completed);
            }

            int result = todoMapper.updateTodo(todo);
            if (result <= 0) {
                throw new TodoException("Failed to update todo");
            }

            TodoList updatedTodo = todoMapper.getTodoById(id);
            logger.info("Updated todo: {}", updatedTodo);
            return Optional.of(updatedTodo);
        } catch (Exception e) {
            logger.error("Error updating todo: {}", e.getMessage(), e);
            throw new TodoException("Failed to update todo: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public boolean deleteTodo(Integer id) {
        if (id == null) {
            throw new TodoException("Todo ID cannot be null");
        }

        try {
            TodoList todo = todoMapper.getTodoById(id);
            if (todo == null) {
                return false;
            }
            int result = todoMapper.deleteTodo(id);
            logger.info("Deleted todo: id={}, result={}", id, result > 0);
            return result > 0;
        } catch (Exception e) {
            logger.error("Error deleting todo: {}", e.getMessage(), e);
            throw new TodoException("Failed to delete todo: " + e.getMessage());
        }
    }

    @Override
    public List<TodoList> getAllTodos() {
        try {
            List<TodoList> todos = todoMapper.getAllTodos();
            logger.info("Fetched {} todos", todos.size());
            return todos;
        } catch (Exception e) {
            logger.error("Error getting all todos: {}", e.getMessage(), e);
            throw new TodoException("Failed to get todos: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public void importTodos(List<TodoList> todos) {
        if (todos == null || todos.isEmpty()) {
            throw new TodoException("No tasks to import");
        }

        try {
            // 获取当前最大的任务ID
            Integer maxId = todoMapper.getMaxTodoId();
            int currentId = (maxId != null) ? maxId : 0;

            // 导入新任务
            for (TodoList todo : todos) {
                // 设置新的ID
                todo.setId(null); // 让数据库自动生成ID

                // 添加新任务
                TodoList newTodo = addTodo(todo.getName(), todo.getCompleted());

            }
            logger.info("Successfully imported {} todos", todos.size());
        } catch (Exception e) {
            logger.error("Error during import: {}", e.getMessage(), e);
            throw new TodoException("Failed to import tasks: " + e.getMessage());
        }
    }
}
