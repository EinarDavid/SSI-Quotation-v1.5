import React from "react";

export const ButtonState = ({ State }) => {
//console.log('----',State)
  return (
    <>
      {State === "NW" || State === "NEW" ? (
          <>
            <button
              className="stateStyle"
              style={{ background: "var(--bs-warming)" }}
              //onClick={OnClick}
              //disabled={Disabled}
            >
              <p className="stateParrafo">Nuevo</p>
            </button>
          </>
        
      ) : State === "ESTIMADO" || State === "STMD"? (
        <>
        <button
            className="stateStyle"
            style={{ background: "var(--bs-placeholder)" }}
            //onClick={OnClick}
            //disabled={Disabled}
          >
            <p className="stateParrafo">Estimado</p>
          </button>
        </>
      ) : State === "REG" || State === "REGISTERED" || State === "SOW APROBADO" ? (
        <>
          <button
            className="stateStyle"
            style={{ background: "var(--bs-success)" }}
            //onClick={OnClick}
            //disabled={Disabled}
          >
            <p className="stateParrafo">SOW_Aprobado</p>
          </button>
        </>
      ) : State === "CANCEL" ? (
        <>
          <button
            className="stateStyle"
            style={{ background: "var(--bs-danger)" }}
            //onClick={OnClick}
            //disabled={Disabled}
          >
            <p className="stateParrafo">Cancelado</p>
          </button>
        </>
      ) : State === "BLOCKED" ? (
        <>
          <button
            className="stateStyle"
            style={{ background: "var(--bs-success)" }}
            //onClick={OnClick}
            //disabled={Disabled}
          >
            <p className="stateParrafo">SOW_Aprobado222</p>
          </button>
        </>
      ) : (
        <></>
      )}
    </>
  );
};
