import React from "react";

const Mensagem = ({ mensagem, cor, fecharMensagem }) => {
    if (!mensagem) return null;
  
    return (
      <div className={`alert alert-${cor} mensagemAlertas d-flex justify-content-center align-items-center 
      position-absolute start-50 translate-middle-x w-50 p-4 text-white bg-${cor} border border-light rounded shadow 
      top-0 top-md-50`} style={{ zIndex: 1050 }}>
        <span>{mensagem}</span>
        <button className="btn-close ms-3" onClick={fecharMensagem}></button>
      </div>
    );
  };

/*       className={`d-flex justify-content-center align-items-center position-absolute top-50 start-50 translate-middle w-50 p-4 text-white bg-${cor} border border-light rounded shadow`}
    >
      <p className="fs-4 fw-semibold text-center">{texto}</p> 
      
      <div className={`alert alert-${cor} position-fixed top-0 start-50 translate-middle-x`} style={{ zIndex: 1050 }}>
      */
export default Mensagem;