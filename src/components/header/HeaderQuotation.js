import React from "react";
import { ConvertDate } from "../../services/Fecha";
import { TextInputLabel } from "../textInput/TextInputLabel";

export const HeaderQuotation = ({ cabecera, handleChangeCabecera }) => {
  //console.log(cabecera?.id_order, cabecera?.status);
  
  return (
    <div>
      <div className="quotePrimeData">
        <div className="halfWidth">
          { (cabecera?.id_orderOr !== null && cabecera?.id_orderOr !== undefined && cabecera?.id_orderOr !== "") ? (
            <>
              <h2 className="NumberCotizacion">
                ID order: {cabecera?.id_order}
              </h2>
            </>
          ) : (
            <>
              <TextInputLabel
                Name="id_order"
                Required={true}
                //LabelInput={"Número de orden"}
                Placeholder={"Número de orden"}
                OnChange={(e) => handleChangeCabecera(e)}
                Value={cabecera?.id_order}
              />
            </>
          )}
        </div>
        <div className="halfWidth">
          <h2 className="FechaCreacion">
            Código Jira(Businnes): {cabecera?.project_code}{" "}
          </h2>
        </div>
        <div className="halfWidth">
          {cabecera?.date !== undefined ? (
            <>
              <p className="FechaCreacion">
                Creado(AA-MM-DD): {ConvertDate(cabecera?.date)}{" "}
              </p>
            </>
          ) : (
            <> </>
          )}
        </div>
      </div>

      <div className="containerDatos">
        <div className="Responsable">
          <p className="Title">Responsable</p>
          <p className="Description">{cabecera?.responsible}</p>
        </div>
        <div className="Responsable">
          <p className="Title">Tipo de proyecto</p>
          <p className="Description">{cabecera?.project_type}</p>
        </div>
        <div className="Responsable">
          <p className="Title">Cliente</p>
          <p className="Description">{cabecera?.client}</p>
        </div>
        {/* <div className='Responsable'>
                    <p className='Title'>Horas</p>
                    <p className='Description'>{(cabecera?.total_effort)}</p>
                </div> */}
      </div>
    </div>
  );
};
