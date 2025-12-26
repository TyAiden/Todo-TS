package org.example.todo.service;

import org.example.todo.domain.TodoList;

import java.util.List;
import java.util.Optional;

public interface TodoService {

    TodoList addTodo(String name, Boolean completed);

    Optional<TodoList> updateTodo(Integer id, String name, Boolean completed);

    boolean deleteTodo(Integer id);

    List<TodoList> getAllTodos();

    void importTodos(List<TodoList> todos);
}
