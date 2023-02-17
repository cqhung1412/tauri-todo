import React, { useState, useEffect, useRef } from "react";
import { listen } from "@tauri-apps/api/event";
import Sentiment from "sentiment";
import "bootstrap/dist/css/bootstrap.min.css";

const sentiment = new Sentiment();

type Todo = {
  task: string;
  sentiment: Sentiment.AnalysisResult;
};

const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    listen("new-todo", () => {
      inputRef.current?.focus();
    })
  }, [])

  const handleChange = (e: any) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const sentimentResut = sentiment.analyze(input);
    const todo = {
      task: input,
      sentiment: sentimentResut,
    };
    setTodos([...todos, todo]);
    setInput("");
  };

  const getSentimentString = (score: number) => {
    if (score > 0) {
      return "positive";
    } else if (score < 0) {
      return "negative";
    } else {
      return "neutral";
    }
  };

  return (
    <div className="container mt-5 mx-auto">
      <h1>Sentiment-Do</h1>
      <h4>The to-do app with sentiment analysis</h4>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="todo-input">New Todo</label>
          <input
            type="text"
            className="form-control"
            id="todo-input"
            value={input}
            onChange={handleChange}
            ref={inputRef}
          />
        </div>
        <button type="submit" className="w-100 mt-2 btn btn-primary">
          Add Todo
        </button>
      </form>
      <ul className="list-group mt-3">
        {todos.map((todo, index) => (
          <li
            key={index}
            className={`list-group-item d-flex justify-content-between align-items-center ${
              todo.sentiment.score > 0
                ? "bg-success text-white"
                : todo.sentiment.score < 0
                ? "bg-danger text-white"
                : ""
            }`}
          >
            {todo.task}
            <span
              className={`badge badge-pill ${
                todo.sentiment.score == 0 ? "bg-secondary" : ""
              }`}
            >
              {getSentimentString(todo.sentiment.score)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
