import { useState, useRef } from "react";
import './Login.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import axios from 'axios';
import Menu from "../menu/Menu";


function Login(props) {
   
    const baseUrl="http://localhost/proyecto2Api/controller/empresaController.php";
    const nameRef = useRef(null);
    const passRef = useRef(null);
    
    const [empresa, setEmpresa] = useState({
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

    });


    
   
    const onLogin = async (e) => {
        e.preventDefault();
    
        // Crear una instancia de FormData
        var f = new FormData();
        
        // Agregar los valores de los campos de texto al FormData
        f.append("correo", nameRef.current.value);
        f.append("contraseña", passRef.current.value);
        f.append("login", true);
    
        try {
          const response = await axios.post(baseUrl, f);
          console.log(response.data);

          setEmpresa(prevState => ({
            ...prevState,
            "login":response.data.message,
            "id":response.data.idEmpresa,
            "clave_temporal":parseInt(response.data.claveTemporal),

            "cedula":response.data.cedula,
            "direccion":response.data.direccion,
            
            "fechaCreacion":response.data.fechaCreacion,
            "nombre":response.data.nombre,
            "telefono":response.data.telefono,
            
        }));

        console.log(empresa)

          
          
        } catch (error) {
          console.log(error);
        }
      };



      const handleChange = e => {
        const { name, value } = e.target;
        setEmpresa(prevState => ({
            ...prevState,
            [name]: value
        }));
        console.log(empresa);
    };

    const onChangeEmpresaData = async () => {
        try {
            console.log(empresa);
            // Crear un objeto con los datos de la empresa a actualizar

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

          
           // const response = await axios.post('http://localhost/index.php', f);
            const response = await axios.post(baseUrl, f, {params: {id: empresa.id}});

            setEmpresa(prevState => ({
                ...prevState,
                "clave_temporal":0
                
            }));
    
            console.log(response.data);
            console.log(empresa);
        } catch (error) {
            console.log(error);
        }
    }
    
    


      
    

    
    

    return (

    <div>
       {!empresa.login && <div>
            <h3>Login Empresa</h3>

           
                <div className="login-main">
                    <h3>Ingresar</h3>
                        <div className="field-group-login">
                            <label htmlFor="name">Usuario</label>
                            <input ref={nameRef} type="text" name="name" id="name"/>

                            <label htmlFor="pass">Contraseña</label>
                             <input ref={passRef} type="password" name="pass" id="pass"/>
                         </div>
                        <button className="main-btn" onClick={e => onLogin(e)}>Entrar</button>

                    
               </div>
            
               </div>}

               


               <Modal isOpen={empresa.clave_temporal===1}>
                    <ModalHeader>Primer inicio cambiar datos OBLIGATORIO</ModalHeader>
                    <ModalBody>
                    <div className="form-group">
                            <label>Cédula: </label>
                            <br />
                            <input type="text" className="form-control" name="cedula" value={empresa.cedula} onChange={handleChange} />
                            <br />
                            <label>Dirección: </label>
                            <br />
                            <input type="text" className="form-control" name="direccion" value={empresa.direccion}  onChange={handleChange} />
                            <br />
                            <label>Fecha de Creación: </label>
                            <br />
                            <input type="date" className="form-control" name="fechaCreacion"  value={empresa.fechaCreacion}  onChange={handleChange} />
                            <br />
                            <label>Nombre: </label>
                            <br />
                            <input type="text" className="form-control" name="nombre"  value={empresa.nombre} onChange={handleChange} />
                            <br />
                            <label>Teléfono: </label>
                            <br />
                            <input type="text" className="form-control" name="telefono"  value={empresa.telefono}  onChange={handleChange} />
                            <br />
                            <label>Nueva Contraseña: </label>
                            <br />
                            <input type="text" className="form-control" name="newpass" onChange={handleChange} />
                            <br />
                    </div>
                    </ModalBody>
                    <ModalFooter>
                    <button className="btn btn-primary" onClick={(e) => onChangeEmpresaData(e)}>Enviar</button>{"   "}
                        
                    </ModalFooter>
                </Modal>

            {empresa.login && 

                <div >
                    <Menu empresa={empresa} setEmpresa={setEmpresa}></Menu>
                </div>
                
                            
            }

</div>
           

       
    )
}

export default Login;