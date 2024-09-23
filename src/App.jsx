import { useCallback, useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { stringify, v4 as uuidv4 } from 'uuid';

function App() {
  const [todo, setTodo] = useState("")       //input text for todo
  const [todos, setTodos] = useState([])    // An array which hold all our todos
  const [editId, setEditId] = useState(null)
  const [showFinished,setShowFinished]=useState(true)


  const saveToLS = () =>{
    
    localStorage.setItem("todos", JSON.stringify(todos))
  }

  const toggleFinished=(params) => {

    setShowFinished(!showFinished)
    
  }
  


  useEffect(()=>{
       let todos2=JSON.parse(localStorage.getItem("todos"));
       if(todos2){
       setTodos(todos2)
       }
  },[])

  useEffect(()=>{
     saveToLS();
  },[todos])




  const handleSave = useCallback(() => {

    if (editId) {
      const updateEdit = todos.map(item =>

        item.id === editId ? { ...item, todo } : item

      )


      setTodos(updateEdit);
    }
    else {
      setTodos([...todos, { id: uuidv4(), todo, isCompleted: false }])
      setTodo("");
    }

    console.log(todos);
  },[editId,todo,todos]);




  const handleEdit = useCallback((e, id) => {

    let todoEdit = todos.filter(item => item.id === id)

    setTodo(todoEdit[0].todo);

    setEditId(id);
  },[editId,todo,todos]);



  const handleDelete =useCallback((e, id) => {

    let a = confirm("Do you really want to delete??!!")

    if (a) {

      let newtodos = todos.filter(item => {
        return item.id !== id
      })

      setTodos(newtodos);
    }
  },[editId,todo,todos]);




  const handleChange = (e) => {
    setTodo(e.target.value);
  }

  const handleCheckbox = (e) => {
    let id = e.target.name;
    let index = todos.findIndex(i => {
      return i.id === id
    })

    let newtodos = [...todos];
    newtodos[index].isCompleted = !newtodos[index].isCompleted;

    setTodos(newtodos);
  }

  return (
    <>
      <Navbar />

      <div className='container w-3/4 mx-auto my-5 rounded-xl p-5 bg-violet-100 min-h-[80vh]'>

        <div className='addtodo'>
          <h2 className='text-lg font-bold my-5'>Add a Todos</h2>
          <input type="text" className='w-1/2' onChange={handleChange} value={todo} />
          <button onClick={handleSave} disabled={todo.length<=3 || editId!==null && todo ==""} className='bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md  mx-6'>Save</button>
        </div>


         <input onChange={toggleFinished}  type="checkbox" checked={showFinished} /> show finished todos.

        <h2 className='text-lg font-bold'>Your Todos</h2>
        <div className='todos'>

          {todos.length === 0 && <div>No Todos to dispaly</div>}

          {todos.map(item => {


            return (showFinished || !item.isCompleted) &&<div key={item.id} className='todo flex w-1/1 my-2 justify-between'>

              <input name={item.id} onChange={handleCheckbox} type="checkbox" checked={item.isCompleted} />

              <div className={item.isCompleted ? "line-through" : ""}>
                {item.todo}
              </div>
              <div className="button flex h-full">
                <button onClick={(e) => { handleEdit(e, item.id) }} className='bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md  mx-1'><FaEdit /></button>
                <button onClick={(e) => { handleDelete(e, item.id) }} className='bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md  mx-1 '><MdDelete /></button>
              </div>
            </div>

          })}

        </div>

      </div>
    </>
  )
}

export default App
