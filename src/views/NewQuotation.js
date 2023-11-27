import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ButtonPrimary } from "../components/button/ButtonPrimary";
import { ButtonState } from "../components/button/ButtonState";

import Images from "../config/Images";
import {
  JiraASSESS,
  JiraEXEC,
  getDetailQuotationAll,
  getDetailQuotationAllRol,
  getHoursResource,
  getMonthsAll,
  getQuotationOne,
  getResourcesAll,
  getRoleAll,
  getStatusResource,
  getWeekOfYear,
  getYearsAll,
  postAddQuotationDetailRol,
  postAddResource,
  postupdateHeaderInformation,
  sendEmail,
} from "../services/cotizacionService";
import { convertCurrencyToNumber3 } from "../services/ValidInput";
import { ViewCotizacionDisabled } from "../components/Forms/ViewCotizacionDisabled";
import { ConvertDate } from "../services/Fecha";
import { HeaderQuotation } from "../components/header/HeaderQuotation";
//import { EnviarEmail } from "../services/Email";

let campoID = 0;

export const NewQuotation = ({ callback }) => {
  //let StateDetail = "FCAST";
  const navigate = useNavigate();
  let { id_quotation } = useParams();
  //console.log('---id', id_quotation);

  const [disableButton, setDisableButton] = useState(true);
  const [disbaledCheck, setDisbaledCheck] = useState(false);
  const [validUrl, setValidUrl] = useState(false);
  const [cabecera, setCabecera] = useState({});
  const [detalle, setDetalle] = useState([
    {
      id_resource_allocation: -1,
      id_quotation: Number(id_quotation),
      //id_resource: 0,
      role: "",
      //year: 0,
      //month: 0,
      //week: 0,
      effort: 0,
      days: 0.0,
      //state: StateDetail,
      effort_approved: 0,
    },
  ]);

  const [role, setRole] = useState();

  const [validacionHoras, setValidacionHoras] = useState([[]]);

  useEffect(() => {
    if (id_quotation) {
      getQuotationOne(id_quotation).then(({ data }) => {
        //console.log('data--One', data)
        data[0] = { ...data[0], id_orderOr: data[0]?.id_order };
        setCabecera(data[0]);
      });
      getDetailQuotationAllRol(id_quotation).then(({ data }) => {
        //console.log("data Detalle--", data);

        data?.map((det, index) => {
          det.backupEffortState = det.state;
          det.backupEffort = convertCurrencyToNumber3(det.effort);
          det.effort = convertCurrencyToNumber3(det.effort);
        });
        data.id_resource_allocation = -1;

        setDetalle(data);
      });
    }
  }, []);

  const handleChangeDetalle = (event, index) => {
    let campos = [...detalle];
    campos[index][event.target.name] = event.target.value;

    if (
      event.target.name === "effort" ||
      event.target.name === "effort_approved"
    ) {
      campos[index][event.target.name] = Number(event.target.value);
    }

    if (event.target.name === "effort") {
      let dias = event.target.value / 8;
      campos[index].days = Number(dias.toFixed(2));

      //console.log("Dias", campos[index].days);
    }

    if (event.target.name === "effort") {
      //console.log('---', event.target.value)
      //console.log("entro aqui")
      if (event.target.value === "") {
        //console.log("OnChange---", event.target.value);

        //campos[index].effort = Number(0);
        campos[index].effort = event.target.value;
      } else {
        //console.log("On-----", event.target.value);
        campos[index].effort = convertCurrencyToNumber3(event.target.value);
        //campos[index].effort = event.target.value;
      }
    }

    if (event.target.name === "effort_approved") {
      //console.log('---', event.target.value)
      //console.log("entro aqui")
      if (event.target.value === "") {
        //console.log("OnChange---", event.target.backupEffort);

        campos[index].effort_approved = event.target.value;
      } else
        campos[index].effort_approved = convertCurrencyToNumber3(
          event.target.value
        );
    }

    setDetalle(campos);
  };

  const handleChangeCabecera = (event) => {
    //console.log("Cabecera", event.target.name, event.target.checked);
    if (event.target.name == "statusCheck" || event.target.name == "id_order") {
      var validar = true;
      if (event.target.checked) {
        if (cabecera?.id_order !== null && cabecera?.id_order !== "") {
          validar = true;
          //console.log("Entro, es igual", cabecera?.id_order);
        } else {
          validar = false;
        }
      } else {
        if (cabecera?.id_order !== null && cabecera?.id_order !== "") {
          validar = false;
          //console.log("Entro, es igual", cabecera?.id_order);
        } else {
          validar = false;
        }
      }
      console.log("Validación", !validar);
      setDisableButton(!validar);
    }

    setCabecera({ ...cabecera, [event.target.name]: event.target.value });
  };

  const addInputs = (e) => {
    //e.preventDefault();
    campoID = campoID + 1;

    setDetalle([
      ...detalle,
      {
        id_resource_allocation: campoID,
        id_quotation: cabecera?.id_quotation,
        //id_resource: 0,
        role: "",
        //year: 0,
        //month: 0,
        //week: 0,
        backupEffort: 0,
        effort: 0,
        days: 0.0,
        //state: StateDetail,
        effort_approved: 0,
      },
    ]);
    //setWeeks([...weeks, []]);
  };

  const handleRemoveDetail = (position) => {
    //console.log(detalle, position)
    setDetalle([...detalle.filter((_, index) => index !== position)]);
    //setWeeks([...weeks.filter((_, index) => index !== position)]);
  };

  useEffect(() => {
    try {
      getRoleAll().then(({ data }) => {
        //console.log('------', data);
        setRole(data);
      });
    } catch (error) {
      alert(error);
    }
  }, []);

  const onSubmit = async () => {
    try {
      setDisableButton(true);
      //console.log("Dataaa", cabecera);

      if (cabecera.statusCheck) {
        let data = cabecera;
        data.total_effort = sumaEffort;
        data.total_effort_approved = summaEffortApproved;

        console.log("Datos Enviados: ", data);
        postupdateHeaderInformation(data).then(async ({ data }) => {
          alert(data.message);
          //setValidacionHoras([[]]);
          setDisableButton(false);
          navigate("/cotizacion-v1.5");
        });
      } else {
        let data = cabecera;
        data.total_effort = sumaEffort;
        data.total_effort_approved = summaEffortApproved;
        data.Campos = detalle;
        data.status = "STMD";
        console.log("Datos Enviados: ", data);
        postAddQuotationDetailRol(data).then(async ({ data }) => {
          console.log("Res BD", data);
          var Jira;

          if (data.data.project_type == "ASSESS") {
            const dataAss = await JiraASSESS(data.data);
            console.log(dataAss.data.message);
            Jira = dataAss.data.message;
          } else if (data.data.project_type == "EXEC") {
            const dataEx = await JiraEXEC(data.data);
            console.log(dataEx.data.message);
            Jira = dataEx.data.message;
          } else {
            Jira = "";
          }

          //Funcion enviar email
          let dataEmail = cabecera;
          dataEmail.total_effort = sumaEffort;
          dataEmail.Campos = detalle;

          const emailSend = await sendEmail(dataEmail);
          console.log(emailSend.data.message);
          Jira = Jira + "\n" + emailSend.data.message;

          //Callback
          if (callback) callback();
          //limpiar cajas, cerrar modal y avisar que fue añadido con exito

          Jira = Jira + "\n" + data.message;
          alert(Jira);
          //setValidacionHoras([[]]);
          setDisableButton(false);
          navigate("/cotizacion-v1.5");
        });
      }
    } catch (error) {
      console.log("----", error);
    }
  };

  // Suma de la Horas
  var sum = 0.0;
  var sum_effort_approved = 0.0;

  detalle.map(({ effort, effort_approved }) => {
    sum = sum + Number(effort);
    sum_effort_approved = sum_effort_approved + Number(effort_approved);

    return [sum, sum_effort_approved];
  });

  let sumaEffort = sum.toFixed(0);
  let summaEffortApproved = sum_effort_approved.toFixed(0);

  //valicacion de campos
  useEffect(() => {
    //var validarStateCheck = true;
    var validar = true;

    detalle?.map((det, index) => {
      //console.log('Detalle', index, det)
      if (!(det?.role !== "" && det?.effort !== 0)) {
        validar = false;
        //console.log("Entro, es igual", det?.effort_approved);
      }

      if (!(det?.effort !== "")) {
        validar = false;
      }
    });

    if (detalle.length === 0) {
      validar = false;
      //validarStateCheck = false;
    }

    //console.log("Validación",!validar);
    setDisableButton(!validar);
  }, [detalle]);

  /*useEffect(() => {
    var validar = true;
    //console.log("Id order",cabecera?.id_order)
    if (!(cabecera?.id_order !== null && cabecera?.id_order !== "")) {
      validar = false;
      //console.log("Entro, es igual", cabecera?.id_order);
    }

    //console.log("Validación",!validar);
    setDisableButton(!validar);
  }, [cabecera]);*/

  return (
    <>
      <div className="AppSecond">
        <div className="containerViewMin">
          <div className="headerContent">
            <div className="containerHeaderButtons">
              <div className="navTitleContainer">
                <button
                  className="button_close"
                  onClick={() => navigate("/cotizacion-v1.5")}
                >
                  {<img src={Images.PAGELEFT} width={20} alt="icon"></img>}
                </button>
                <div className="spaceRow10" />
                <h1 className="h1Style">Ver cotización</h1>
              </div>
              <div className="containerButtonRight">
                <ButtonState State={cabecera?.status} />
              </div>
            </div>
            {/* <div className="spaceVer15" /> */}
            <div className="containerFormulario">
              {/* <ViewCotizacionDisabled cabecera={cabecera} /> */}

              <HeaderQuotation
                cabecera={cabecera}
                handleChangeCabecera={handleChangeCabecera}
              />
            </div>

            {/* <div style={{ height: '15px' }}></div> */}

            {/* <div className="spaceVer10" /> */}
            <h1 className="h2Style">Recursos</h1>
            <p className="Description">
              Este es el primer paso en el proceso de registro de la cotización
              en nuestra aplicación{" "}
            </p>
            <p className="Description">
              Ingresa el Rol y las horas estimadas a continuación:{" "}
            </p>
          </div>
          <div className="spaceVer5" />
          <div className="containerTitleRecurso">
            <div className="rowContainerTitle">
              {/* <h1 className="h3StyleBold">Nombre del recurso</h1> */}
              <h1 className="h3StyleBold">Rol</h1>
              <div className="dateContainer">
                {/* <h1 className="h3StyleBold inputDate">Año</h1>
                <h1 className="h3StyleBold inputDate">Mes</h1> */}
                <h1 className="h3StyleBold inputHours">Horas_estimadas</h1>
                <h1 className="h3StyleBold inputHours">Horas_SOW_aprobadas</h1>
              </div>
              {/* <h1 className="h3StyleBold">Estado</h1> */}
            </div>
          </div>
          <div className="spaceVer15" />

          <div className="detailContainer">
            {detalle.map((det, i) => (
              <div
                key={det.id_resource_allocation}
                className="columnaContainer"
              >
                <div className="rowContainer">
                  <select
                    name="role"
                    className="inputCell inputRole"
                    value={det?.role || ""}
                    onChange={(e) => handleChangeDetalle(e, i)}
                    required
                  >
                    <option value="" disabled hidden>
                      Rol
                    </option>
                    {role?.map(({ role, id_role }) => (
                      <option key={id_role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>

                  <div className="dateContainer">
                    <input
                      name="effort"
                      className="inputCell inputHours"
                      type="number"
                      placeholder="Effort"
                      value={det?.effort}
                      onChange={(e) => {
                        handleChangeDetalle(e, i);
                      }}
                    ></input>

                    <input
                      name="effort_approved"
                      className="inputCell inputHours"
                      type="number"
                      placeholder="effort_approved"
                      value={det?.effort_approved}
                      disabled
                      onChange={(e) => {
                        handleChangeDetalle(e, i);
                      }}
                    ></input>
                  </div>

                  <button
                    className="buttonRemoveRow"
                    onClick={() => {
                      handleRemoveDetail(i);
                    }}
                  >
                    -
                  </button>
                </div>

                <></>
              </div>
            ))}

            <div className="AddInputContainer">
              <button className="buttonAddForm" onClick={addInputs}>
                Clic aquí para añadir un nuevo campo
              </button>
            </div>
          </div>
          <div className="spaceVer15" />
          <hr className="lineFilter" />
          <div className="footerButtons">
            <div className="sectionOne">
              {
              (cabecera?.id_orderOr !== null && cabecera?.id_orderOr !== undefined && cabecera?.id_orderOr !== "") ? (
                
                <>
                {console.log("--------",cabecera?.id_orderOr)} 
                </>
              ) : (
                <>
                {console.log("--------",cabecera?.id_order)}
                 <label className="labelInputCheck">
                    <input
                      disabled={disbaledCheck}
                      className="checkbookInput"
                      type="checkbox"
                      name="statusCheck"
                      //onClick={(e) => handleChangeCabecera(e)}
                      onChange={(e) => handleChangeCabecera(e)}
                      //value={cabecera.statusCheck}
                    />
                    Guardar solo Número de Orden
                  </label>
                </>
              )}

              <ButtonPrimary
                Style={{ width: "100%" }}
                Disabled={disableButton}
                Nombre={"Guardar"}
                OnClick={onSubmit}
              />
            </div>
            <div className="sectionTwo">
              <p className="Effort">Total hrs estimadas: {sumaEffort} </p>
              <p className="Effort">
                Total hrs SOW aprobadas: {summaEffortApproved}{" "}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
