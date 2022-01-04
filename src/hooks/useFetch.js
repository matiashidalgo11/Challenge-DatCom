import { useState, useEffect } from "react";

export const useFetch = (url) => {

    //Se crea un estado de la data que se va a obtener en la peticion fetch
    const [data, setData]= useState(null);
    //Se crea otro estado donde se van a alamacenar los errores si la peticion no se puede realizar.
    const [error, setError] = useState(null);
    //Se crea un estado donde de tipo boolean para saber si todavia no se te termino de realizar la peticion 
    const [loading, setLoading] = useState(false);


    //Se realiza la peticion a la api adentro del useEffect
    useEffect(() => {

        //Se crea un AbortController, si la peticion tarda mucho en cargar esta se va a encargar de cancelar
        const abortController = new AbortController();
        const signal = abortController.signal;


        const fetchData = async () => {

            //Se cambia el estado de loading para avisar que se esta comenzando a ejecutar la peticion 
            setLoading(true);

            try{

                //Se realiza la peticion de fetch adentro de un catch para capturar errores.
                const res = await fetch(url);
                
                if(!res.ok){
                    let err = new Error("Error en la peticion fetch");
                    err.status = res.status || "00";
                    err.statusText = res.statusText || "Ocurrio un error";
                    throw err;
                }

                //se convierte la respuesta en json
                const json = await res.json();

                //si no se aborto la peticion entonces se puede actualizar la variable de estado data
                if(!signal.aborted){
                    setData(json);
                    setError(null);
                }

            }catch(error){

                //El error no es del tipo abort
                if(!signal.aborted){
                    setData(null);
                    setError(error);
                }
            }finally{

                //Se actualiza el loading a false. 
                if(!signal.aborted){

                    setLoading(false)

                }
            }

        }

        //Funcion donde se va a ejecutar la peticion
        fetchData();

        //Una vez que termine se ejecuta el abort para terminar la peticion.
        return () => abortController.abort();

    },[url]);
    //El use effect se ejecuta cuando la variable url cambie.

    return {data, error, loading};

}
