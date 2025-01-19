"use client";
import React, { useState } from 'react';
import Navbar from "@/components/navbar";
export default function TermsOfService() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleColumn = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
        <Navbar toggleColumn={toggleColumn} isOpen={isOpen} />
      <header className="bg-gray-200 text-black py-6">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Politique de Confidentialit&eacute;</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">1. Utilisation de Mux pour la Gestion Vid&eacute;o</h2>
          <p>
            Remp Mp4 utilise les services de <strong>Mux</strong>, une plateforme professionnelle de gestion et de diffusion vid&eacute;o, pour vous offrir une exp&eacute;rience fluide et de qualit&eacute;. Cependant :
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Nous collectons uniquement les informations n&eacute;cessaires à la diffusion des vid&eacute;os.</li>
            <li>Aucun profilage d&eacute;taill&eacute; ou traçage des comportements n&apos;est r&eacute;alis&eacute;.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">2. Recommandations Vid&eacute;o</h2>
          <p>
            Contrairement à d&apos;autres services, nous n&apos;utilisons pas vos donn&eacute;es pour proposer des recommandations sophistiqu&eacute;es.
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>
              Les suggestions de vid&eacute;os sont <strong>al&eacute;atoires</strong> ou bas&eacute;es sur des critères simples (vid&eacute;os r&eacute;cemment ajout&eacute;es, plus populaires).
            </li>
            <li>
              Cette approche garantit une exp&eacute;rience plus priv&eacute;e, bien que les recommandations soient moins personnalis&eacute;es.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">3. Publicit&eacute;s Non Cibl&eacute;es</h2>
          <p>
            Remp Mp4 affiche des publicit&eacute;s pour financer ses services. Ces publicit&eacute;s sont :
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>
              <strong>Non cibl&eacute;es</strong> : elles ne sont pas bas&eacute;es sur vos donn&eacute;es personnelles (historique, pr&eacute;f&eacute;rences, etc.).
            </li>
            <li>
              <strong>Al&eacute;atoires</strong> : elles sont s&eacute;lectionn&eacute;es de manière g&eacute;n&eacute;rique, sans suivi ou profilage utilisateur.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">4. Collecte et Protection des Donn&eacute;es</h2>
          <p>
            Remp Mp4 s&apos;engage à prot&eacute;ger vos donn&eacute;es personnelles en appliquant les principes suivants :
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>
              <strong>Collecte minimale :</strong> seules les informations strictement n&eacute;cessaires (par exemple, votre e-mail) sont demand&eacute;es.
            </li>
            <li>
              <strong>Aucune vente de donn&eacute;es :</strong> vos informations personnelles ne seront jamais partag&eacute;es ou vendues à des tiers.
            </li>
            <li>
              <strong>S&eacute;curisation des donn&eacute;es :</strong> nous utilisons des protocoles avanc&eacute;s pour garantir la confidentialit&eacute; et l’int&eacute;grit&eacute; de vos informations.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">5. Votre Contrôle et Vos Droits</h2>
          <p>
            Vous disposez d’un contrôle total sur vos donn&eacute;es personnelles :
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Vous pouvez supprimer vos informations personnelles ou votre compte à tout moment via votre espace utilisateur.</li>
            <li>
              Nous n&apos;enregistrons aucun historique de vos vid&eacute;os regard&eacute;es, sauf si vous choisissez de le faire manuellement.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">6. Une Plateforme Transparente</h2>
          <p>
            Chez Remp Mp4, nous privil&eacute;gions une exp&eacute;rience simple et respectueuse de votre vie priv&eacute;e. Contrairement à d&apos;autres services, nous n&apos;utilisons pas vos donn&eacute;es pour am&eacute;liorer nos algorithmes au d&eacute;triment de votre vie priv&eacute;e.
          </p>
        </section>
      </main>

      <footer className="bg-gray-100 py-6">
        <div className="max-w-4xl mx-auto text-center text-gray-600">
          <p>© 2025 Remp Mp4. Tous droits r&eacute;serv&eacute;s.</p>
        </div>
      </footer>
    </div>
  );
}
