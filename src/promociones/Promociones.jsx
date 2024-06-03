import { useState, useEffect } from "react";
//import './Menu.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import axios from 'axios';

function Promociones({ cupon, setCupon, openPromociones, setOpenPromociones }) {

  //  const {cupon,setCupon}=props;

    const [data, setData]=useState([]);
    const [modalInsertar, setModalInsertar]= useState(false);
    const [modalModificar, setModalModificar]= useState(false);



    const baseUrlPromociones="http://localhost/proyecto2Api/controller/promocionesController.php";

    const [promocion, setPromocion] = useState({
      "id":0,
      "activo":true,
      "fecha_creacion":"",
      "fecha_expira":"",
      "fecha_inicio":"",
      "descripcion":"",

  });

  const abrirCerrarModalInsertar=()=>{
    setModalInsertar(!modalInsertar);
  }
  const abrirCerrarModalModificar=()=>{
    setModalModificar(!modalModificar);
  }

  const handleChange = e => {
    const { name, value } = e.target;
    setPromocion(prevState => ({
        ...prevState,
        [name]: value
    }));
  }
   


  const handleChangeCuponCheck = () => {
        
    setCupon(prevState => ({
        ...prevState,
        "activo":!promocion.activo,

        
    }));
    console.log(cupon);
};



    const peticionGet=async()=>{

        await axios.get(`${baseUrlPromociones}?id=${cupon.id}`)
        .then(response=>{
          setData(response.data);
        }).catch(error=>{
          console.log(error);
        })
      }

   
      useEffect(()=>{
        setOpenPromociones(true)
        peticionGet();
        //peticionGetCategoria();
      },[])

      const closePromociones=()=>{
        setOpenPromociones(!openPromociones)

        
      }
    


       const seleccionarpromocion=(promocion)=>{
        
        setPromocion(promocion);
        
        abrirCerrarModalModificar();
      
    
       
      }
      const peticionPostPromocion=async()=>{

      

        var f = new FormData();
        f.append("descripcion",promocion.descripcion);
        f.append("fecha_inicio",promocion.fecha_inicio);
        f.append("fecha_expira", promocion.fecha_expira);
        f.append("idCupon", cupon.id);


        f.append("METHOD", "POST");

    
        await axios.post(baseUrlPromociones, f)
        .then(response=>{
          //setData(data.concat(response.data));
          console.log(response)
          
          abrirCerrarModalInsertar();
          peticionGet();

        }).catch(error=>{
          console.log(error);
        })
      }



      const peticionPutPromocion=async()=>{
    
        var f = new FormData();
       
       
    
        f.append("descripcion",promocion.descripcion);
        f.append("fecha_inicio",promocion.fecha_inicio);
        f.append("fecha_expira", promocion.fecha_expira);
        f.append("METHOD", "PUT");
    
        await axios.post(baseUrlPromociones, f, {params: {id: promocion.id}})
        .then(response=>{

          peticionGet()
      
          abrirCerrarModalModificar();

        }).catch(error=>{
          console.log(error);
        })
      }

  



    return(
    <div>

        <div className="content">
    

              
        <div className="insert-btn" >

        <button className="session-btn" onClick={()=>abrirCerrarModalInsertar()}>Insertar Promocion</button>
               
             

               </div>
               <div className="close-btn">

               <button className="session-btn" onClick={closePromociones} >Salir</button>


     



               </div>
               </div>
                <table className="table table-striped">
                    <thead>
                        <tr>
                        <th>Descripcion</th>
                        <th>Fecha inicio</th>
                        <th>Fecha expira</th>
                        


                        </tr>
                    </thead>
                    <tbody>
                        {data.map(promocion=>(
                        <tr key={promocion.id}>
                            <td>{promocion.descripcion}</td>
                            <td>{promocion.fecha_inicio}</td>
                            <td>{new Date(promocion.fecha_expira) < new Date() ? 'Vencida' : promocion.fecha_expira}</td>
                            
                            
                        <td>
                        <button className="btn btn-danger"  onClick={()=>seleccionarpromocion(promocion)} >Editar</button>{"  "}
                        
                        </td>
                        </tr>
                        ))}


                    </tbody> 

                </table>



                <Modal isOpen={modalInsertar}>
                    <ModalHeader>Insertar cupon</ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                      
                            <label>Descripcion: </label>
                            <br />
                            <input type="text" className="form-control" name="descripcion" onChange={handleChange} />
                            <br />
                            
                            <label>Fecha Finalizacion </label>
                            <br />
                            <input type="date" className="form-control" name="fecha_expira" onChange={handleChange} />
                            <br />
                            <label>Fecha Inicio </label>
                            <br />
                            <input type="date" className="form-control" name="fecha_inicio" onChange={handleChange} />
                            <br />


                            
                           
                           
                            <br />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-primary" onClick={()=>peticionPostPromocion()} >Insertar</button>{"   "}
                        <button className="btn btn-danger" onClick={()=>abrirCerrarModalInsertar()}>Cancelar</button>
                    </ModalFooter>
                </Modal>



                <Modal isOpen={modalModificar}>
                    <ModalHeader>Insertar cupon</ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                      
                            <label>Descripcion: </label>
                            <br />
                            <input type="text" className="form-control" name="descripcion" value={promocion.descripcion} onChange={handleChange} />
                            <br />
                            
                            <label>Fecha Finalizacion </label>
                            <br />
                            <input type="date" className="form-control" name="fecha_expira" onChange={handleChange} />
                            <br />
                            <label>Fecha Inicio </label>
                            <br />
                            <input type="date" className="form-control" name="fecha_inicio" onChange={handleChange} />
                            <br />


                          
                           
                           
                            <br />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-primary" onClick={()=>peticionPutPromocion()}>Insertar</button>{"   "}
                        <button className="btn btn-danger" onClick={()=>abrirCerrarModalModificar()}>Cancelar</button>
                    </ModalFooter>
                </Modal>

         </div>

         
    
    
    
    
     

        
        


        




    )
}

export default Promociones;