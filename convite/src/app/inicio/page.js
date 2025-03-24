import React, {useState} from "react";
import Image from "next/image";
import "../globals.css";
import axios from "axios";
import Link from "next/link";


export default function Index() {
  return ( 
    <div>
        <main className="m-auto px-5 py-4 cor_background text-center min-vh-100 main-container">
        <section className="pt-5">
          <h1>Andressa e Vinícius!</h1>
        </section>

        <section>
          <Image
            src="/cha-de-casa-nova.png"
            alt="Chá de casa nova"
            width={300}
            height={300}
          />
        </section>

        <section>
          <p>
            Olá! Seja bem-vindo ao nosso chá de casa nova! Agradecemos a sua
            presença e o seu carinho. Estamos muito felizes em compartilhar este
            momento com vocês!
          </p>
          <p>
            Estamos montando nossa casa com muito amor e carinho, e é muito
            especial poder contar com a ajuda de vocês para tornar esse sonho
            realidade.
          </p>
          <p>
            Para facilitar a escolha dos presentes, criamos uma lista com
            sugestões de presentes. Fique à vontade para escolher o presente que
            mais combina com você. Agradecemos de coração!
          </p>
        </section>

        <section className="pb-5">
          <Link href="/lista">
            <button className="btn btn-primary">Iniciar</button>
          </Link>
        </section>
      </main>
    </div>
  );
}
