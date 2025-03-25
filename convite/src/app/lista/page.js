"use client";
import "../globals.css";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Mensagem from "./mensagem.js";

export default function Lista() {
    const [presentes, setPresentes] = useState([]);
    const [selecionados, setSelecionados] = useState([]);
    const [nomes, setNomes] = useState([""]);
    const [showModal, setShowModal] = useState(false);
    const inputRef = useRef(null);
    const [loading, setLoading] = useState(true); 
    const [mensagem, setMensagem] = useState("");
    const [cor, setCor] = useState("success"); 

    const BASE_URL = "https://convite-festa-back.vercel.app";

    const normalizeString = (str) => {
        return str
          .normalize("NFD") // Separa caracteres acentuados em base + acento
          .replace(/[\u0300-\u036f]/g, "") // Remove os acentos
          .replace(/ç/g, "c") // Substitui 'ç' por 'c'
          .toLowerCase(); 
    };

    const fecharMensagem = () => {
        setMensagem("");
      };

    useEffect(() => {
        axios.get(`${BASE_URL}/presentes-lista`)
            .then(response => {
                setPresentes(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Erro ao buscar presentes:", error);
                setLoading(false);
            });
    }, []);

    const confirmarPresenteEConvidado = async () => {
        try {
            const nomesNormalizados = nomes.map(nome => normalizeString(nome)).filter(nome => nome.trim() !== "");

            const convidadoResponse = await axios.get(`${BASE_URL}/convidados`, {
                params: { nomes: nomesNormalizados }
            });
    
            let convidadoIds = convidadoResponse.data?.ids || [];
    
            if (convidadoIds.length === 0) {
                const criarConvidadoResponse = await cadastrarConvidado();
                convidadoIds = [criarConvidadoResponse.data.convidadoId];
            }
    
            for (const presente of selecionados) {
                await axios.put(`${BASE_URL}/presentes/${presente.presenteId}`, {
                    convidadoId: convidadoIds
                });
            }
    
            setShowModal(false);
            setMensagem("Convidado(s) e presente(s) confirmado(s) com sucesso!");
            setCor("success");
        } catch(error) {
            setMensagem(error.response?.data?.error || "Erro ao confirmar presença.");
            setCor("danger");
        } finally {
            setTimeout(() => {
                window.location.reload();
            }, 8000);
        }
    };

    const adicionarNome = () => {  
        if(nomes[nomes.length - 1].trim() !== ""){
        setNomes([...nomes, ""]);
        }else {
            setMensagem("Preencha um nome antes de adicionar outro.");
            setCor("danger");
        }
      };
    
        const atualizarNome = (index, nome) => {
        const novosNomes = [...nomes];
        novosNomes[index] = nome;
        setNomes(novosNomes);
    }

    const selecionarItem = (item) => {
        setSelecionados((prev) =>
          prev.includes(item) ? prev.filter((p) => p !== item) : [...prev, item]
        );
    };
    

    const cadastrarConvidado = async () => {
        try{
            const nomesFiltrados = nomes.filter(nome => nome.trim() !== "");
            if(nomesFiltrados.length === 0){
                setMensagem("Insira um nome válido.");
                setCor("danger");
                return;
            }
            const res = await axios.post(`${BASE_URL}/convidados`,  {convidado: nomesFiltrados}, {
            headers: {
                'Content-Type': 'application/json'
            }
            });

            return res;
            
        }catch(error){
            setMensagem("Erro ao enviar convidado.");
            setCor("danger");
        }
    }

    const abrirModal = () => {
        if(nomes.length === 1 && nomes[0] === "") {
            setMensagem("Digite ao menos um nome.");
            setCor("danger");
            inputRef.current.focus();
            return;
        }
        setShowModal(true);
      }
    
    const fecharModal = () => {
        setShowModal(false);
    };

  return (
    <div>
        <main className="px-5 py-2 m-auto cor_background text-center main-container">
        {loading ? ( 
            <div className="loading-container d-flex justify-content-center align-items-center position-absolute start-50 translate-middle w-sm-100 vh-sm-100 bg-warning border border-dark rounded shadow" style={{top: '10%'}}>
                <p className="display-4 fw-bold text-dark text-uppercase">Carregando...</p>
            </div>
            ) : (
            <>
            <section className="mt-5">
            <h2>Confirme sua presença adicionando seus nomes:</h2>
                <form className="form-inline" encType="multipart/form-data">
                <div className="form-group m-auto main-container d-flex flex-column">
                    {nomes.map((nome, index) => (
                    <div key={index} className="d-flex align-items-center mb-2">
                    <input type="text" className="form-control me-2" ref={inputRef} placeholder="Digite um nome aqui:" value={nome} onChange={(e) => atualizarNome(index, e.target.value)}/>
                    {index === nomes.length - 1 && ( 
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => adicionarNome()}>
                        Adicionar
                    </button>
                    )}
                    </div>
                    ))}
                </div>
                </form>
                <p>Digitou todos os nomes?</p>
            </section>

            <section className="mt-2">
                <p>Vamos para a lista de presentes:</p>
                <Image src="/gift.svg" alt="gift" width={50} height={50} className="mb-2" />
                <p>Escolha entre os itens abaixo:</p>
            </section>

            <section>
                {presentes
                    .filter((presente) => presente.quantidade > 0)
                    .map((presente) => (
                    <div key={presente.presenteId} className="form-check d-flex text-start gap-2">
                        <input className="form-check-input" type="checkbox" id={presente.presenteId} onChange={() => selecionarItem(presente)}/>
                        <label className="form-check-label" htmlFor={presente.presenteId}>
                            {presente.nomePresente}
                        </label>
                    </div>

                ))}
                <button type="submit" className="btn btn-success" onClick={abrirModal}>Confirmar</button>
            </section>

            <section>
                {showModal && (
                <div className="modal fade show" id="modalConfirma" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{display: 'block'}}>
                    <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Confirmar nome(s) e presente(s):</h5>
                        </div>
                        <div className="modal-body">
                            {nomes.map((nome, index) => <p className="mb-0 mt-0" key={index}>{nome}</p>)}
                            <div className="text-start">
                                <p className="mt-4 text-left">Você selecionou:</p>
                                
                                    {selecionados
                                        .sort((a, b) => {
                                            if (a.nomePresente === "PIX") return 1;
                                            if (b.nomePresente === "PIX") return -1;
                                            return 0;
                                        })
                                        .map((presente) => (
                                            <div key={presente.id} className="d-flex flex-column">
                                                {presente.nomePresente === "PIX" ? (
                                                    <>
                                                        <li key={presente.id} className="mt-0 mb-0">{presente.nomePresente}</li>
                                                            <p key={presente.id} className="mt-0 mb-0" style={{marginLeft: '35px'}}>Chave PIX (celular): 21991696308</p>
                                                            <p className="mt-2" style={{marginLeft: '35px'}}><Image
                                                                src="/qrcodepix.jpg"
                                                                alt="Pix"
                                                                width={200}
                                                                height={200}
                                                            /></p>
                                                    </>
                                                ) : (
                                                    <li key={presente.id} className="mt-0 mb-0">{presente.nomePresente}</li>
                                                )}
                                            </div>
                                        ))}
                               
                            </div>
                        </div>
                        <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={fecharModal}>Fechar</button>
                        <Link href="#">
                            <button type="button" className="btn btn-primary" onClick={() => confirmarPresenteEConvidado()}>Enviar</button>
                        </Link>
                        </div>
                    </div>
                    </div>
                </div>
                )}
            </section>
            </>
            )}
            <Mensagem mensagem={mensagem} cor={cor} fecharMensagem={fecharMensagem} />
        </main>
    </div>
  )
}