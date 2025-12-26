package org.example.todo.domain;

import lombok.Data;


@Data
public class TodoList {
    private Integer id;
    private String name;
    private Boolean completed;
    private String createdAt;

    @Override
    public String toString() {
        return "TodoList{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", completed=" + completed +
                ", createdAt='" + createdAt + '\'' +
                '}';
    }



}
