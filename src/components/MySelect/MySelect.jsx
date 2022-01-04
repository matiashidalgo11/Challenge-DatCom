import react, { useRef, useState } from "react";
import { useEffect } from "react/cjs/react.development";
import classes from './MySelect.module.css'


/**
 *  Componente en el cual recibe por props:
 *  
 *  @param {object} initialValue no es obligatoria, sirve para que el select comience seleccionado ese valor, si es que se encuentra en las opciones.
 *  @param {function} onChange una funcion en la cual recibe como parametro un objeto con dos campos Value y Label
 *  @param {Array} options un arreglo de objetos, donde dichos objetos que se encuentran en el array tienen solo los campos Value y Label
 *  @param {object} target el objeto que va a ser referencia al valor seleccionado del select  
 *  
 */
export default function MySelect({initialValue, onChange, options, target}){


    //Se crea un estado en donde va a referenciar al valor seleccionado por el select
    const [valuePred, setValuePred] = useState((inOptions(options,initialValue))?initialValue:{value:"", label:""});

    const select = useRef();

    const handleChange = (e) => {

        //Se filtra la lista de options para obtener el objeto seleccionado
        const optionSelect = options.find(option => option.value === e.target.value);

        //Luego se actualiza los estados
        setValuePred(optionSelect);
        onChange(optionSelect);
    };

    //este useEffect se ejecutara solo una vez luego de renderizarce el componente, se usa en este caso para poder setear el estado principal 'target'. Dependiendo de ciertas circunstancias
    useEffect(() =>{


            //se pone un condicional para ver si el target esta null, y el initialValue coincide con algun valor del arreglo de options
            if(target === null && initialValue !== undefined && options.some((option) => option.value === initialValue.value)){
                onChange(initialValue);
            }
            //si initialValue es undefined se actualiza el target con el valor selecionado por defecto del select
            else{
                onChange(options.find(option => option.value === select.current.value));
            }

    },[])


    return (

            <select id="select" className={classes.Select} value={(valuePred.value)} onChange={handleChange} disabled={(options.length > 1)?false:true} ref={select}>

                {options.map((dato, index) => {return <option key={index} value={dato.value} label={dato.label}/>})}

            </select>

    )

    //Funcion auxiliar que busca en el array de opciones, si se encuentra la opcion. Devuelve un boolean.
    function inOptions(options, option){

        let content = false;

        content = options.some(opt => opt.value === option.value);

        return content;
    }

    
}