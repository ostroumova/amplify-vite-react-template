import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    const subscription = client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });

    return () => subscription.unsubscribe();
  }, []);

  function createTodo() {
    const content = window.prompt("Todo content");
    if (content) {
      client.models.Todo.create({ content, isDone: false });
    }
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id });
  }

  function toggleTodo(id: string, isDone: boolean) {
    client.models.Todo.update({ id, isDone: !isDone });
  }

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>{user?.signInDetails?.loginId}'s todos</h1>
          <button className="button" onClick={createTodo}>
            + new
          </button>
          <ul>
            {todos.map((todo) => (
              <li className="todo-container" key={todo.id}>
                <input
                  type="checkbox"
                  checked={todo.isDone ?? false}
                  onChange={() => toggleTodo(todo.id, todo.isDone ?? false)}
                />
                <span className="todo">{todo.content}</span>
                <button
                  className="button button--delete"
                  onClick={() => deleteTodo(todo.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <div>
            🥳 App successfully hosted. Try creating a new todo.
            <br />
            <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
              Review next step of this tutorial.
            </a>
          </div>
          <button className="button" onClick={signOut}>
            Sign out
          </button>
        </main>
      )}
    </Authenticator>
  );
}

export default App;
