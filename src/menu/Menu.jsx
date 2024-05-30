import { useState, useEffect } from "react";
import './Menu.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import axios from 'axios';

function Menu(props) {

    const {empresa,setEmpresa}=props;

    const baseUrlEmpresa="http://localhost/proyecto2Api/";
    const baseUrlCupon="http://localhost/proyecto2Api/cupon.php";

    const [update,setUpdate] = useState(false);
    const [modalInsertar, setModalInsertar]= useState(false);
    const [modalEditar, setModalEditar]= useState(false);
  const [modalEliminar, setModalEliminar]= useState(false);
  const [data, setData]=useState([]);


   


    const [cupon, setCupon] = useState({
        "id":0,
        "empresa_id":empresa.id,
        "nombre":"",
        "descripcion":"",
        "activo":true,
        "fecha_creacion":"",
        "fecha_expira":""


    
    });

    const abrirCerrarModalInsertar=()=>{
        setModalInsertar(!modalInsertar);
      }
    
      const abrirCerrarModalEditar=()=>{
        setModalEditar(!modalEditar);
      }
    
      const abrirCerrarModalEliminar=()=>{
        setModalEliminar(!modalEliminar);
      }
    

    const onOpenUpdate=()=>{
        setUpdate(!update);
    }


    const handleChange = e => {
        const { name, value } = e.target;
        setEmpresa(prevState => ({
            ...prevState,
            [name]: value
        }));
        console.log(empresa);
    };

    const handleChangeCupon = e => {
        const { name, value } = e.target;
        setCupon(prevState => ({
            ...prevState,
            [name]: value
        }));
        console.log(empresa);
    };

    const handleChangeCuponCheck = () => {
        
        setCupon(prevState => ({
            ...prevState,
            "activo":!cupon.activo,

            
        }));
        console.log(cupon);
    };


    const handleChangeCuponCheckUpdate = () => {
        
      setCupon(prevState => ({
          ...prevState,
          "activo":parseInt(cupon.activo)===0?1:0,

          
      }));
      console.log(cupon);
  };



    const onChangeEmpresaData = async () => {
        try {

            var f = new FormData();
        
            // Agregar los valores de los campos de texto al FormData
            f.append("cedula", empresa.cedula);
            f.append("direccion", empresa.direccion);
            f.append("fecha_creacion",empresa.fechaCreacion);
            f.append("nombre", empresa.nombre);
            f.append("telefono", empresa.telefono);
            f.append("contraseña", empresa.newpass);
            f.append("temporal", false);
            f.append("empresa", true);
            f.append("METHOD", "PUT");

          
            const response = await axios.post(baseUrlEmpresa, f, {params: {id: empresa.id}});

            setUpdate(!update)
    
            console.log(response.data);
            console.log(empresa);
        } catch (error) {
            console.log(error);
        }
    }

    const peticionPost=async()=>{

        console.log(cupon)

        var f = new FormData();
        f.append("id", cupon.id);
        f.append("empresa_id",cupon.empresa_id);
        f.append("nombre",cupon.nombre );
        f.append("descripcion", cupon.descripcion);
        f.append("fecha_expira", cupon.fecha_expira);
        f.append("activo", cupon.activo ?0:1);
       

        f.append("METHOD", "POST");

    
        await axios.post(baseUrlCupon, f)
        .then(response=>{
          //setData(data.concat(response.data));
          console.log(response)
          
          abrirCerrarModalInsertar();
          peticionGet();

        }).catch(error=>{
          console.log(error);
        })
      }



      const peticionPut=async()=>{
        var f = new FormData();
        f.append("id", cupon.id);
        f.append("empresa_id",cupon.empresa_id);
        f.append("nombre",cupon.nombre );
        f.append("descripcion", cupon.descripcion);
        f.append("fecha_expira", cupon.fecha_expira);
        f.append("activo", cupon.activo ?0:1);
       
        f.append("METHOD", "PUT");
        
        await axios.post(baseUrlCupon, f, {params: {id: cupon.id}})
        .then(response=>{

          peticionGet()
      
          abrirCerrarModalEditar();

        }).catch(error=>{
          console.log(error);
        })
      }
      /*------------------------------------------- */

    
    
      
      const peticionDelete = async () => {
        setCupon(prevCupon => {
          const newActivo = parseInt(prevCupon.activo) === 0 ? 1 : 0;
          var f = new FormData();
          f.append("METHOD", "DELETE");
          f.append("activo", newActivo);
          // Otros campos...
      
          axios.post(baseUrlCupon, f, { params: { id: prevCupon.id } })
            .then(response => {
              console.log(response);
              peticionGet();
              abrirCerrarModalEliminar();
            })
            .catch(error => {
              console.log(error);
            });
      
          return { ...prevCupon, activo: newActivo };
        });
      };
      

      const peticionGet=async()=>{
        await axios.get(`${baseUrlCupon}?id=${empresa.id}`)
        .then(response=>{
          setData(response.data);
        }).catch(error=>{
          console.log(error);
        })
      }



      const seleccionarCupon=(cupon,caso)=>{
        setCupon(cupon);
        (caso==="Editar")?
         abrirCerrarModalEditar():
        abrirCerrarModalEliminar()
    
       
      }

      useEffect(()=>{
        peticionGet();
      },[])
    

  



    return(
    <div>

        <div className="content">

                <div className="insert-btn" >
               
                <button className="session-btn" onClick={()=>abrirCerrarModalInsertar()}>Insertar</button>

                </div>
                <div className="close-btn">


                    <button className="session-btn" onClick={()=>onOpenUpdate()} >Modificar Empresa</button>
                    <button className="session-btn" >Salir</button>



                </div>


              


                <Modal isOpen={update}>
                    <ModalHeader>Modificar Datos Empresa</ModalHeader>
                    <ModalBody>
                    <div className="form-group">
                            <label>Cédula: </label>
                            <br />
                            <input type="text" className="form-control" name="cedula" onChange={handleChange} />
                            <br />
                            <label>Dirección: </label>
                            <br />
                            <input type="text" className="form-control" name="direccion" onChange={handleChange} />
                            <br />
                            <label>Fecha de Creación: </label>
                            <br />
                            <input type="text" className="form-control" name="fechaCreacion" onChange={handleChange} />
                            <br />
                            <label>Nombre: </label>
                            <br />
                            <input type="text" className="form-control" name="nombre" onChange={handleChange} />
                            <br />
                            <label>Teléfono: </label>
                            <br />
                            <input type="text" className="form-control" name="telefono" onChange={handleChange} />
                            <br />
                            <label>Nueva Contraseña: </label>
                            <br />
                            <input type="text" className="form-control" name="newpass" onChange={handleChange} />
                            <br />
                    </div>
                    </ModalBody>
                    <ModalFooter>
                    <button className="btn btn-primary" onClick={(e) => onChangeEmpresaData(e)}>Enviar</button>{"   "}
                    <button className="session-btn" onClick={e => onOpenUpdate(e)} >Cancelar</button>
                        
                    </ModalFooter>
                </Modal>


                <Modal isOpen={modalInsertar}>
                    <ModalHeader>Insertar cupon</ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                        <label>Nombre: </label>
                            <br />
                            <input type="text" className="form-control" name="nombre" onChange={handleChangeCupon} />
                            <br />
                            <label>Descripcion: </label>
                            <br />
                            <input type="text" className="form-control" name="descripcion" onChange={handleChangeCupon} />
                            <br />

                            <input type="date" className="form-control" name="fecha_expira" onChange={handleChangeCupon} />
                            <br />
                            <p>Cupon esta {cupon.activo ? "Activo" : "No activo"}</p>
                            <button className="session-btn" onClick={()=>handleChangeCuponCheck()}>Cambiar Estado</button>
                           
                           
                            <br />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-primary" onClick={()=>peticionPost()}>Insertar</button>{"   "}
                        <button className="btn btn-danger" onClick={()=>abrirCerrarModalInsertar()}>Cancelar</button>
                    </ModalFooter>
                </Modal>


                <Modal isOpen={modalEditar}>
                    <ModalHeader>Editar cupon</ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                        <label>Nombre: </label>
                            <br />
                            <input type="text" className="form-control" name="nombre" value={cupon.nombre} onChange={handleChangeCupon} />
                            <br />
                            <label>Descripcion: </label>
                            <br />
                            <input type="text" className="form-control" name="descripcion" value={cupon.descripcion} onChange={handleChangeCupon} />
                            <br />
                            <label>Fecha Finalizacion </label>
                            <br />
                            <input type="date" className="form-control" name="fecha_expira" value={cupon.fecha_expira} onChange={handleChangeCupon} />
                            <br />
                            <p>Cupon esta {parseInt(cupon.activo)===0 ? "Activo" : "No activo"}</p>
                            <button className="session-btn" onClick={()=>handleChangeCuponCheckUpdate()}>Cambiar Estado</button>
                           
                           
                            <br />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-primary" onClick={()=>peticionPut()}>Insertar</button>{"   "}
                        <button className="btn btn-danger" onClick={()=>abrirCerrarModalEditar()}>Cancelar</button>
                    </ModalFooter>
                </Modal>




                <Modal isOpen={modalEliminar}>
                            <ModalBody>
                            ¿Estás seguro que deseas eliminar el Framework {cupon && cupon.nombre}?
                            </ModalBody>
                            <ModalFooter>
                            <button className="btn btn-danger" onClick={()=>peticionDelete()}>
                                Sí
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={()=>abrirCerrarModalEliminar()}
                            >
                                No
                            </button>
                            </ModalFooter>
                </Modal>








        </div>
    
    
        <div>
                <table className="table table-striped">
                    <thead>
                        <tr>
                        <th>Nombre</th>
                        <th>Descripcion</th>
                        <th>Creacion</th>
                        <th>Expira</th>
                        <th>Activo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(cupon=>(
                        <tr key={cupon.id}>
                            <td>{cupon.nombre}</td>
                            <td>{cupon.descripcion}</td>
                            <td>{cupon.fecha_creacion}</td>
                            <td>{new Date(cupon.fecha_expira) < new Date() ? 'Vencida' : cupon.fecha_expira}</td>
                            <td>{parseInt(cupon.activo) === 0 ?"Activo" : "No activo"}</td>
                        <td>
                        <button className="btn btn-primary" onClick={()=>seleccionarCupon(cupon, "Desabilitar")}>{parseInt(cupon.activo) === 0 ?"Desactivar" : "Activar"}</button> {"  "}
                        <button className="btn btn-danger"  onClick={()=>seleccionarCupon(cupon, "Editar")} >Editar</button>
                        </td>
                        </tr>
                        ))}


                    </tbody> 

                </table>


                </div>
    
    
    
    
    </div>   

        
        


        




    )
}

export default Menu;