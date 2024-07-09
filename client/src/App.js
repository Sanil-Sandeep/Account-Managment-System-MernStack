import logo from './logo.svg';
import '../src/App.css';
import { MdClose } from "react-icons/md";
import { useEffect, useState } from 'react';
import axios from "axios"
import FormTable from './components/FormTable';

axios.defaults.baseURL = "http://localhost:8080/"

function App() {
  const [addSection,setAddSection] = useState(false)
  const [editSection,setEditSection] = useState(false)
  const [formData,setFormData] = useState({
    name : "",
    email : "",
    mobile : "",
  })

  const [formDataEdit,setFormDataEdit] = useState({
    name : "",
    email : "",
    mobile : "",
    _id : ""
  })

  const [dataList,setDataList] = useState([])

  const handleOnChange = (e)=>{
    const{value,name} = e.target
    setFormData((preve)=>{
       return{
        ...preve,
        [name] : value
       }
    })
  } 


  //create account
  const handleSubmit = async(e)=>{
     e.preventDefault()
     const data = await axios.post("/create",formData)
     console.log(data)
     if(data.data.success){
      setAddSection(false) 
      alert(data.data.message)
      getFetchData() 
      setFormData({
        name :"",
        email :"",
        mobile :""
      })
     }

  } 
  

  //display data
  const getFetchData = async()=>{
    const data = await axios.get("/")
    console.log(data)
    if(data.data.success){
      setDataList(data.data.data)
      
    }
  }
useEffect(()=>{
  getFetchData() 
},[])




//delete data
const handleDelete = async(id)=>{
  const data = await axios.delete("/delete/"+id)
  
  if(data.data.success){
    getFetchData() 
    alert(data.data.message)
  }
}




//update data
const handleUpdate = async(e)=>{
  e.preventDefault()
  const data = await axios.put("/update",formDataEdit)
  if(data.data.success){
    getFetchData() 
    alert(data.data.message)
    setEditSection(false)
  }
}
const handleEditOnChange = async(e)=>{
  const{value,name} = e.target
  setFormDataEdit((preve)=>{
     return{
      ...preve,
      [name] : value
     }
  })
}
const handleEdit = (el)=>{
   setFormDataEdit(el)
   setEditSection(true)
}




  return (
    <>
      <div className="container">
        <button className="btn btn-add" onClick={()=>setAddSection(true)}>ADD</button>

        {
          addSection && (
            <FormTable
            handleSubmit = {handleSubmit}
            handleOnChange = {handleOnChange}
            handleclose = {()=>setAddSection(false)}
            rest={formData}
            />
          )
        }

        {
          editSection && (
            <FormTable
            handleSubmit = {handleUpdate}
            handleOnChange = {handleEditOnChange}
            handleclose = {()=>setEditSection(false)}
            rest={formDataEdit}
            />
          )
        }


        <div className='tableContainer'>
          <table>
            <thead>
              <tr>
                <th>UID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Moblie</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              { dataList[0] ? (
                dataList.map((el)=>{
                  console.log(el)
                  return(
                    <tr>
                      <td>{el.customId}</td>
                      <td>{el.name}</td>
                      <td>{el.email}</td>
                      <td>{el.mobile}</td>
                      <td>
                      <button className='btn btn-edit' onClick={()=>handleEdit(el)}>Edit</button>
                      <button className='btn btn-delete' onClick={()=>handleDelete(el._id)}>Delete</button>
                      </td>
                    </tr>
                  )
                }))
                 : (
                  <p style={{textAlign : "center"}}>No data</p>
                 )
              }
            </tbody>
          </table>
        </div>

        


       </div> 
    </>
  );
}

export default App;
