package org.example.todo.controller;

import org.example.todo.domain.TodoList;
import org.example.todo.exception.TodoException;
import org.example.todo.service.TodoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping(path="/todo")
public class TodoController {
    private static final Logger logger = LoggerFactory.getLogger(TodoController.class);

    @Autowired
    private TodoService todoService;

    @GetMapping("/all")
    public ResponseEntity<List<TodoList>> getAllTodos() {
        try {
            logger.info("Fetching all todos");
            return ResponseEntity.ok(todoService.getAllTodos());
        } catch (Exception e) {
            logger.error("Error fetching todos: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/add")
    public ResponseEntity<TodoList> addTodo(@RequestBody Map<String, Object> request) {
        try {
            String name = (String) request.get("name");
            Boolean completed = (Boolean) request.get("completed");
            logger.info("Adding new todo: name={}, completed={}", name, completed);
            return ResponseEntity.ok(todoService.addTodo(name, completed));
        } catch (TodoException e) {
            logger.error("Error adding todo: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Unexpected error adding todo: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/update")
    public ResponseEntity<TodoList> updateTodo(@RequestBody Map<String, Object> request) {
        try {
            Integer id = (Integer) request.get("id");
            String name = (String) request.getOrDefault("name", null);
            Boolean completed = (Boolean) request.getOrDefault("completed", null);
            logger.info("Updating todo: id={}, name={}, completed={}", id, name, completed);
            return ResponseEntity.ok(todoService.updateTodo(id, name, completed)
                    .orElseThrow(() -> new TodoException("Task not found")));
        } catch (TodoException e) {
            logger.error("Error updating todo: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Unexpected error updating todo: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/delete")
    public ResponseEntity<String> deleteTodo(@RequestBody Map<String, Integer> request) {
        try {
            Integer id = request.get("id");
            logger.info("Deleting todo: id={}", id);
            if (todoService.deleteTodo(id)) {
                return ResponseEntity.ok("Task deleted successfully");
            }
            return ResponseEntity.badRequest().body("Failed to delete task");
        } catch (TodoException e) {
            logger.error("Error deleting todo: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            logger.error("Unexpected error deleting todo: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while deleting the task");
        }
    }

    @PostMapping("/import")
    public ResponseEntity<String> importTodos(@RequestBody List<TodoList> todos) {
        try {
            logger.info("Importing {} todos", todos.size());
            todoService.importTodos(todos);
            return ResponseEntity.ok("Tasks imported successfully");
        } catch (TodoException e) {
            logger.error("Error importing todos: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            logger.error("Unexpected error importing todos: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while importing tasks");
        }
    }

    @GetMapping("/export")
    public ResponseEntity<List<TodoList>> exportTodos() {
        try {
            logger.info("Exporting all todos");
            List<TodoList> todos = todoService.getAllTodos();
            return ResponseEntity.ok(todos);
        } catch (Exception e) {
            logger.error("Error exporting todos: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
