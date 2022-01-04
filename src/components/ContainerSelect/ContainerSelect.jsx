import { useState } from 'react';
import classes from './ContainerSelect.module.css';

//components
import MySelect from '../MySelect/MySelect';

//hook
import { useFetch } from '../../hooks/useFetch';

//url api Randomuser
const url = "https://randomuser.me/api/";
const endPoint = "?inc=gender,name,nat,email,id&results=10";
const endPointUnResultado = "?inc=gender,name,nat,email,id&results=1"

//url api jsonplaceholder
const urlJsonPlace = "https://jsonplaceholder.typicode.com/users/1/todos";

function ContainerSelect() {

    //se crea el useFetch que basicamente lo que hace es la peticion a la api y devuelve 3 varaibles de estado
    //se utiliza en este caso la api de randomuser
    const {data, error, loading} = useFetch(`${url}${endPoint}`);


    /* const {data, error, loading} = useFetch(`${urlJsonPlace}`); */


    //se crea el state target. Donde luego se lo va a pasar al componente de select
    const [target, setTarget ] = useState(null);


    if(!data) return null;

    if (error) {
        return (
            <p>
                {`Error ${error.status}: ${error.statusText}`}
            </p>
        );
      }

    //luego de verificar que la data no sea null, se pasa todo los datos a un typeOptions donde son objetos que tienen dos campos value y label
    //En la funcion hay que especificarle los nombres de los campos que queremos utilizar como Value y como Label
    const options = toOptionsType(data.results,'email', 'email');

    //Esta funcion va a ser la que se va a enviar por props a el componente MySelect, donde recibe un objeto que contienen solo value y label. Adentro de dicha funcion se actualiza target
    function onChange(obj){
        setTarget(obj);
    }


    return (
    
        <div className={classes.ContainerMain}>

            {loading && <h2>Cargando</h2>}
            
            {loading === false & data !== null && 
                <MySelect initialValue={{value:"matias", label:"matias hidalgo"}} onChange={onChange} options={options} target={target}/>
            }
            

            <div className={classes.ContainerDataView}>
                {target !== null && <p className={classes.DataView}>{JSON.stringify(searchSelect(data.results,target,'email'))}</p>}
            </div>

        </div>
    );
}


//funcion que recibe un array de objetos, en este caso se le pasa el result de la peticion, ademas del nombre del campo que se va a utilizar en value y label
function toOptionsType(data, nameValue, nameLabel){

    const options = data.map((obj) => {

        return({value: obj[nameValue].toString(), label: obj[nameLabel].toString()});
    })
    
    return options
}

//Funcion que recibe toda la data que se trajo de la api, el option que proviene del campo seleccionado por el select y el nameParameter que va a ser el campo en el cual se va a comparar el value
function searchSelect(data, option, nameParameter){

    let dato = {}

    dato = data.find((dat) => {
        if(dat[nameParameter].toString() === option.value) return dat;
    });

    return dato;
}

export default ContainerSelect;
