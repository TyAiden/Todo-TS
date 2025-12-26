package org.example.todo.dao;

import org.apache.ibatis.annotations.*;
import org.example.todo.domain.TodoList;

import java.util.List;

@Mapper
public interface TodoMapper {

    // 添加一个新任务
    @Insert("INSERT INTO todolist(name, completed) VALUES(#{name}, #{completed})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int addTodo(TodoList todo);

    // 更新任务
    @Update("UPDATE todolist SET name=#{name}, completed=#{completed} WHERE id=#{id}")
    int updateTodo(TodoList todo);

    // 删除任务
    @Delete("DELETE FROM todolist WHERE id=#{id}")
    int deleteTodo(@Param("id") Integer id);

    // 查询所有任务
    @Select("SELECT * FROM todolist")
    @Results({
            @Result(property = "id", column = "id"),
            @Result(property = "name", column = "name"),
            @Result(property = "completed", column = "completed"),
            @Result(property = "createdAt", column = "created_at")
    })
    List<TodoList> getAllTodos();

    // 根据 ID 查找任务
    @Select("SELECT * FROM todolist WHERE id = #{id}")
    @Results({
            @Result(property = "id", column = "id"),
            @Result(property = "name", column = "name"),
            @Result(property = "completed", column = "completed"),
            @Result(property = "createdAt", column = "created_at")
    })
    TodoList getTodoById(@Param("id") Integer id);

    @Select("SELECT MAX(id) FROM todolist")
    Integer getMaxTodoId();

}
