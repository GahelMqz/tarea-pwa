import { useEffect, useState } from 'react'
import AddIcon from './assets/icons/AddIcon'
import DeleteIcon from './assets/icons/DeleteIcon'
import SplashScreen from './components/SplashScreen';


function App() {
  //Mostrar splash screen
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);


  const [input, setInput] = useState('')
  const [tasks, setTasks] = useState(() => {
    try {
      const stored = localStorage.getItem('tasks')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  // Cargar tareas desde localStorage
  useEffect(() => {
    const stored = localStorage.getItem('tasks')
    if (stored) setTasks(JSON.parse(stored))
  }, [])

  // Guardar tareas en localStorage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  const addTask = () => {
    if (!input.trim()) return
    const newTask = { id: Date.now(), text: input.trim() }
    setTasks(prev => [...prev, newTask])
    setInput('')
  }

  const deleteTask = id => {
    setTasks(prev => prev.filter(task => task.id !== id))
  }

  return (
    <>
      {isLoading ? <SplashScreen /> : <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md transition-all duration-300">
          <h1 className="text-3xl font-semibold mb-6 text-center text-slate-800 tracking-tight">
            Control de tareas
          </h1>

          <div className="flex gap-3 mb-6 ">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Agregar una tarea..."
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  addTask(); // o cualquier función que quieras ejecutar
                }
              }}
            />
            <button
              onClick={addTask}
              className="bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
              aria-label="Agregar tarea"
            >
              <AddIcon />
            </button>
          </div>

          {tasks.length === 0 ? (
            <div className="text-center text-slate-500 italic py-4">
              Organiza tus pendientes
            </div>
          ) : (
            <ul className="space-y-3">
              {tasks.slice().reverse().map(task => (
                <li
                  key={task.id}
                  className="flex justify-between items-center bg-slate-50 px-4 py-3 rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  <span className="text-slate-700">{task.text}</span>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-500 hover:text-red-700 focus:outline-none transition-colors"
                    aria-label="Eliminar tarea"
                  >
                    <DeleteIcon />
                  </button>
                </li>
              ))}
            </ul>
          )}


        </div>
      </div>}

    </>




  )
}

export default App