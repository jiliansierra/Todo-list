import { useState, useEffect } from 'react';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  const API_URL = 'http://localhost:5000/api/todos';

  // 1. Fetch all tasks when the component loads
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching data from backend:', error);
    }
  };

  // 2. Send a new task to the database
  const addTodo = async () => {
    if (!newTodo.trim()) return;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTodo }),
      });
      const savedTodo = await response.json();
      
      // Update UI state with the item returned from PostgreSQL
      setTodos([savedTodo, ...todos]);
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  // 3. Toggle a task complete/incomplete
  const toggleTodo = async (id, currentStatus) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_completed: !currentStatus }),
      });
      const updatedTodo = await response.json();

      setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  // 4. Delete a task from the database
  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 flex justify-center">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 h-fit border border-gray-100">
        
        <h1 className="text-4xl font-black text-gray-800 mb-8 text-center tracking-tight">
          TaskFlow
        </h1>

        {/* Input Form */}
        <div className="flex gap-3 mb-8">
          <input
            type="text"
            placeholder="Add a new task..."
            className="flex-1 px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-lg"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          />
          <button 
            onClick={addTodo}
            className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-md"
          >
            Add
          </button>
        </div>

        {/* Dynamic Task List */}
        <div className="space-y-3">
          {todos.map(todo => (
            <div 
              key={todo.id} 
              className="group flex items-center justify-between p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={todo.is_completed}
                  onChange={() => toggleTodo(todo.id, todo.is_completed)}
                  className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                />
                <span className={`text-lg font-medium transition-colors ${
                  todo.is_completed ? 'line-through text-gray-400' : 'text-gray-700'
                }`}>
                  {todo.title}
                </span>
              </div>
              
              <button 
                onClick={() => deleteTodo(todo.id)}
                className="opacity-0 group-hover:opacity-100 text-sm font-semibold px-4 py-2 text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition-all"
              >
                Delete
              </button>
            </div>
          ))}
          
          {todos.length === 0 && (
            <p className="text-center text-gray-400 py-6">No tasks left! Rest up.</p>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;