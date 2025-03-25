import React from "react";
import Image from "next/image";
import "../globals.css";
import Link from "next/link";


export default function Index() {
  return ( 
    <div>
        <main className="m-auto px-5 py-4 cor_background text-center min-vh-100 main-container">
        <section className="pt-5">
          <h1>Andressa e Vinícius</h1>
          <h2>19/04 às 16h</h2>
          <h2>Local: xyxyxyx</h2>
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
            Estamos montando nosso lar com muito amor e carinho,
            e seria incrível compartilhar esse momento com você!
            Sua presença é o nosso maior presente, mas, se quiser nos ajudar
            a tornar esse sonho realidade, criamos uma lista com sugestões de presentes.
          </p>
          <p>
            Fique à vontade para escolher a opção que mais tem a ver com você
            e com o que precisamos. Agradecemos de coração por fazer parte desse
            novo capítulo da nossa vida!
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
