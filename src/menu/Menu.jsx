import React, { useState, useEffect } from "react";
import './Menu.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FormGroup, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import axios from 'axios';
import Promociones from "../promociones/Promociones";
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';

import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';


const cld = new Cloudinary({ cloud: { cloudName: 'dng82zchm' } });

function Menu(props) {

    const {empresa,setEmpresa}=props;

    const baseUrlEmpresa="http://localhost/proyecto2Api/controller/empresaController.php";
    const baseUrlCupon="http://localhost/proyecto2Api/controller/cuponController.php";
    const baseUrlCategoria="http://localhost/proyecto2Api/controller/categoriasController.php";
    const baseUrlCuponImage="http://localhost/proyecto2Api/controller/imageController.php";

    const [update,setUpdate] = useState(false);
    const [modalInsertar, setModalInsertar]= useState(false);
    const [modalEditar, setModalEditar]= useState(false);
    const [modalImage, setModalImage]= useState(false);
    const [modalEliminar, setModalEliminar]= useState(false);
    const [data, setData]=useState([]);
    const [categorias, setCategoria]=useState([]);
    const [openPromociones,setOpenPromociones] = useState(false);

    const [cupon, setCupon] = useState({
        "id":0,
        "empresa_id":empresa.id,
        "nombre":"",
        "ubicacion":"",
        "activo":true,
        "fecha_creacion":"",
        "fecha_expira":"",
        "fecha_inicio":"",
        "categoria_id":"",
        "img":"",
        "precio":0,
    });

    const salirSeccion=()=>{
      setEmpresa({
        "id":0,
        "cedula":"",
        "direccion":"",
        "clave_temporal":0,
        "activo":false,
        "fechaCreacion":"",
        "nombre":"",
        "telefono":"",
        "newpass":"",
        "login":false

    })
    }

    const [empresaUpdate, setEmpresaUpdate] = useState({
      "id":0,
      
     
      "clave_temporal":0,
      "activo":false,
      "login":false,
      "cedula":empresa.cedula,
      "direccion":empresa.direccion,
      "fechaCreacion":empresa.fechaCreacion,
      "nombre":empresa.nombre,
      "telefono":empresa.telefono,
      "newpass":empresa.newpass,

  })

    /*----------imagen------------- */
    const [imageUrl, setImageUrl] = useState(null);
    
    const[image,setImage]=useState("");
   
    
      const [transformedImage, setTransformedImage] = useState("");
      const [error, setError] = useState(null);
    
      const uploadImage = async (e) => {
        const files = e.target.files;
        const data = new FormData();
        data.append("file", files[0]);
        data.append("upload_preset", "images"); // Asegúrate de que "images" coincide con el nombre del preset que creaste
    
        try {
          const res = await fetch(
            "https://api.cloudinary.com/v1_1/dng82zchm/image/upload",
            {
              method: "POST",
              body: data,
            }
          );
    
          if (!res.ok) {
            const errorData = await res.json();
            setError(`Error: ${errorData.error.message}`);
            throw new Error(`Error: ${errorData.error.message}`);
          }
    
          const file = await res.json();
          setImage(file.secure_url);
    
        
        } catch (error) {
          console.error('Error uploading the image:', error);
        }
      };

    const peticionPostImage=async()=>{

      console.log(cupon)

      var f = new FormData();
      f.append("id", cupon.id);
      f.append("url",image);

      f.append("METHOD", "POST");

  
      await axios.post(baseUrlCuponImage, f)
      .then(response=>{
        //setData(data.concat(response.data));
        console.log(response)
        
        abrirCerrarModalImage();
        //peticionGet();

      }).catch(error=>{
        console.log(error);
      })
    }

    /*---------------------------------- */

    const abrirCerrarModalInsertar=()=>{
        setModalInsertar(!modalInsertar);
      }
    
      const abrirCerrarModalEditar=()=>{
        setModalEditar(!modalEditar);
      }
    
      const abrirCerrarModalEliminar=()=>{
        setModalEliminar(!modalEliminar);
      }

      const abrirCerrarModalImage=()=>{
        setModalImage(!modalImage);
      }

      const OpenPromociones=(cupon)=>{ 
        setCupon(cupon);
        setOpenPromociones(!openPromociones);
      }
    

    const onOpenUpdate=()=>{
        setUpdate(!update);
    }


    const handleChange = e => {
        const { name, value } = e.target;
        setEmpresaUpdate(prevState => ({
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



 
    const onChangeEmpresaData = async () => {
        try {
        
          console.log(empresaUpdate.fechaCreacion)
          const fechaFormateada = new Date(empresaUpdate.fechaCreacion).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        console.log(fechaFormateada)
         

            var f = new FormData();
            
            
        
            // Agregar los valores de los campos de texto al FormData
            f.append("cedula", empresaUpdate.cedula);
            f.append("direccion", empresaUpdate.direccion);
            f.append("fecha_creacion", fechaFormateada);
            f.append("nombre", empresaUpdate.nombre);
            f.append("telefono", empresaUpdate.telefono);
            f.append("contraseña", empresaUpdate.newpass);
            f.append("temporal", false);
            f.append("empresa", true);
            f.append("METHOD", "PUT");

          
            const response = await axios.post(baseUrlEmpresa, f, {params: {id: empresa.id}});

            setUpdate(!update)
           
            

            if(response.data.error){
              alert(response.data.error);

              setEmpresaUpdate(prevState => ({
                ...prevState,
                "cedula":empresa.cedula,
                "direccion":empresa.direccion,
                "fechaCreacion":empresa.fechaCreacion,
                "nombre":empresa.nombre,
                "telefono":empresa.telefono,
                "newpass":empresa.newpass,
                
            }));

            }else{
              alert("Cambios Realizados con exito")
            }
            

            /*console.log(response.data);
            console.log(empresa);*/
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
        f.append("ubicacion", cupon.ubicacion);
        f.append("fecha_expira", cupon.fecha_expira);
        f.append("activo", cupon.activo ?0:1);
        f.append("precio", cupon.precio); 
        f.append("categoria", cupon.categoria_id);
        f.append("fecha_inicio", cupon.fecha_inicio);


        f.append("METHOD", "POST");

    
        await axios.post(baseUrlCupon, f)
        .then(response=>{
          //setData(data.concat(response.data));
          console.log(response);
          
          
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
        f.append("ubicacion", cupon.ubicacion);
        f.append("fecha_expira", cupon.fecha_expira); 
        f.append("activo", cupon.activo ?0:1);
        f.append("precio", cupon.precio);
        f.append("categoria", cupon.categoria_id);
        f.append("fecha_inicio", cupon.fecha_inicio);
        f.append("METHOD", "PUT");
        
        await axios.post(baseUrlCupon, f, {params: {id: cupon.id}})
        .then(response=>{

          peticionGet()
      
          abrirCerrarModalEditar();

          

        }).catch(error=>{
          alert(error)
          
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


      const peticionGetCategoria=async()=>{
        await axios.get(baseUrlCategoria)
        .then(response=>{
          //console.log(response.data);
          setCategoria(response.data);
        }).catch(error=>{
          console.log(error);
        })
      }

      const getCategoriaNombre = (id) => {
       // console.log(categorias);

        const categoria = categorias.find(cat =>  cat.id === id);
        return categoria ? categoria.categoria : 'Categoría no encontrada';
      };


      const seleccionarCupon=(cupon,caso)=>{
        setCupon(cupon);
        (caso==="Editar")?
         abrirCerrarModalEditar():
        abrirCerrarModalEliminar()
    
       
      }

      const seleccionarCuponImagen=(cupon)=>{
        setCupon(cupon);
        getImageCupon(cupon.id);
        abrirCerrarModalImage()
    
       
      }

      const getImageCupon=async(id)=>{
        await axios.get(`${baseUrlCuponImage}?id=${id}`)
        .then(response=>{
          const firstCuponUrl = response.data[0]?.urlImg || "";

          setCupon(prevState => ({
            ...prevState,
            "img": firstCuponUrl,
        }));
        }).catch(error=>{
          console.log(error);
        })
      }


  

      useEffect(()=>{
        peticionGet();
        peticionGetCategoria();
      },[])
    

  



    return(
    <div>
        <div className="content">
                <Modal isOpen={update}>
                    <ModalHeader>Modificar Datos Empresa</ModalHeader>
                    <ModalBody>
                    <div className="form-group">
                           <label>Cédula: </label>
                            <br />
                            <input type="text" className="form-control" name="cedula" value={empresaUpdate.cedula} onChange={handleChange} />
                            <br />
                            <label>Dirección: </label>
                            <br />
                            <input type="text" className="form-control" name="direccion" value={empresaUpdate.direccion}  onChange={handleChange} />
                            <br />
                            <label>Fecha de Creación: </label>
                            <br />
                            <input type="date" className="form-control" name="fechaCreacion"  value={empresaUpdate.fechaCreacion}  onChange={handleChange} />
                            <br />
                            <label>Nombre: </label>
                            <br />
                            <input type="text" className="form-control" name="nombre"  value={empresaUpdate.nombre} onChange={handleChange} />
                            <br />
                            <label>Teléfono: </label>
                            <br />
                            <input type="text" className="form-control" name="telefono"  value={empresaUpdate.telefono}  onChange={handleChange} />
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
                            <input type="text" className="form-control" name="ubicacion" onChange={handleChangeCupon} />
                            <br />
                            <label> Precio </label>
                            <br />
                            <input type="number"className="form-control"name="precio"step="0.01"min="0"onChange={handleChangeCupon}/>
                            <br />
                            <br />
                            <label>Fecha Finalizacion </label>
                            <br />
                            <input type="date" className="form-control" name="fecha_expira" onChange={handleChangeCupon} />
                            <br />
                            <label>Fecha Inicio </label>
                            <br />
                            <input type="date" className="form-control" name="fecha_inicio" onChange={handleChangeCupon} />
                            <br />
                            <br />
                                  <label>Categoría: </label>
                                  <br />
                                  <select className="form-control" name="categoria_id"onChange={handleChangeCupon} value={cupon.categoria_id}
                                  >
                                    <option value="">Seleccione una categoría</option>{categorias.map((categoria) => (
                                      <option key={categoria.id} value={categoria.id}>
                                        {categoria.categoria}
                                      </option>
                                    ))}
                                  </select>
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
                            <input type="text" className="form-control" name="nombre"  value={cupon.nombre} onChange={handleChangeCupon} />
                            <br />
                            <label>Descripcion: </label>
                            <br />
                            <input type="text" className="form-control" name="ubicacion"   value={cupon.ubicacion} onChange={handleChangeCupon} />
                            <br />
                            <br />
                            <label>Fecha Finalizacion </label>
                            <br />
                            <input type="date" className="form-control" name="fecha_expira" onChange={handleChangeCupon} />
                            <br />
                            <label> Precio </label>
                            <br />
                            <input type="number"className="form-control"name="precio"step="0.01"min="0"onChange={handleChangeCupon}/>
                            <br />
                            <label>Fecha Inicio </label>
                            <br />
                            <input type="date" className="form-control" name="fecha_inicio" onChange={handleChangeCupon} />
                            <br />

                            <br />
                                  <label>Categoría: </label>
                                  <br />
                                  <select className="form-control" name="categoria_id"onChange={handleChangeCupon} value={cupon.categoria_id}
                                  >
                                    <option value="">Seleccione una categoría</option>{categorias.map((categoria) => (
                                      <option key={categoria.id} value={categoria.id}>
                                        {categoria.categoria}
                                      </option>
                                    ))}
                                  </select>
                           <p>Cupon esta {parseInt(cupon.activo)===0 ? "Activo" : "No activo"}</p>
                            <button className="session-btn" onClick={()=>handleChangeCuponCheck()}>Cambiar Estado</button>
                           
                           
                            <br />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-primary" onClick={()=>peticionPut()}>Insertar</button>{"   "}
                        <button className="btn btn-danger" onClick={()=>abrirCerrarModalEditar()}>Cancelar</button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={modalImage}>
                    <ModalHeader>Imagen cupon</ModalHeader>
                    <ModalBody>
                    <div>
                    <label>Imagen </label>
                    {cupon.img ? (
                            <img src={cupon.img} alt="Imagen del cupón" style={{ maxWidth: "100%", height: "auto" }} />) : (<p>No hay imagen disponible para este cupón</p> )}<br />
                          <FormGroup>
                               <input type="file" name="file" placeholder="subir imagen" onChange={uploadImage} ></input>
                            </FormGroup>
                      </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-primary" onClick={()=>peticionPostImage()}>Insertar</button>{"   "}
                        <button className="btn btn-danger" onClick={()=>abrirCerrarModalImage()}>Cancelar</button>
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
  
        { !openPromociones &&<div >
          <div className="content">
            <div className="insert-btn" >
                <button className="session-btn" onClick={()=>abrirCerrarModalInsertar()}>Insertar</button>
            </div>
                <div className="close-btn">
                    <button className="session-btn" onClick={()=>onOpenUpdate()} >Modificar Empresa</button>
                    <button className="session-btn" onClick={salirSeccion}>Salir</button>
                </div>

          </div>
                <table className="table table-striped">
                    <thead>
                        <tr>
                        <th>Nombre</th>
                        <th>Ubicacion</th>
                        <th>Creacion</th>
                        <th>Precio</th>
                        <th>Expira</th>
                        <th>Inicio</th>
                        <th>Categoria</th>
                        <th>Activo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(cupon=>(
                        <tr key={cupon.id}>
                            <td>{cupon.nombre}</td>
                            <td>{cupon.ubicacion}</td>
                            <td>{cupon.fecha_creacion}</td>
                            <td>{cupon.precio}</td>
                            <td>{new Date(cupon.fecha_expira) < new Date() ? 'Vencida' : cupon.fecha_expira}</td>
                            <td>{cupon.fecha_inicio}</td>
                            <td>{getCategoriaNombre(cupon.categoria)}</td>
                            <td>{parseInt(cupon.activo) === 0 ?"Activo" : "No activo"}</td>
                        <td>
                        <button className="btn btn-primary" onClick={()=>seleccionarCupon(cupon, "Desabilitar")}>{parseInt(cupon.activo) === 0 ?"Desactivar" : "Activar"}</button> {"  "}
                        <button className="btn btn-danger"  onClick={()=>seleccionarCupon(cupon, "Editar")} >Editar</button>{"  "}
                        <button className="btn btn-danger"  onClick={()=>seleccionarCuponImagen(cupon)} >Imagen</button>{"  "}
                        <button className="btn btn-primary"  onClick={()=>OpenPromociones(cupon)} >Promociones</button>
                        </td>
                        </tr>
                        ))}
                    </tbody> 
                </table>
                </div>}
                {openPromociones && 

                        <div >
                            <Promociones cupon={cupon} setCupon={setCupon}  openPromociones={openPromociones} setOpenPromociones= {setOpenPromociones}></Promociones>
                        </div>
                
                  }
    
    </div>   

        
        


        




    )
}

export default Menu;