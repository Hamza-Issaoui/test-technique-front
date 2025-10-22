Voici les étapes à suivre pour exécuter l'application :

1- Clonez le dépôt avec la commande:  git clone https://github.com/Hamza-Issaoui/test-technique-front.git   

2- Installez les dépendances avec la commande:  npm install  

3- Démarrez le serveur avec la commande:  npm start  

4- Structure du Projet

front/
├── src/
│   ├── app/                 # Application source code
│   ├── assets/             # Static assets (images, fonts, etc.)
│   ├── environment/        # Environment configuration files
│   ├── favicon.ico         # Website favicon
│   ├── index.html          # Main HTML template
│   ├── main.ts            # Application entry point
│   └── styles.css         # Global styles
├── .editorconfig          # Editor configuration
├── .gitignore            # Git ignore rules
├── angular.json          # Angular CLI configuration
├── package.json          # NPM dependencies and scripts
├── package-lock.json     # NPM lock file
├── README.md             # Project documentation
├── tsconfig.app.json     # TypeScript configuration for app
├── tsconfig.json         # TypeScript root configuration
└── tsconfig.spec.json    # TypeScript configuration for tests

⚙️ Choix techniques

Angular 16 : framework moderne pour SPA.

RxJS : gestion des flux asynchrones.

Angular Material & Tailwind : interface professionnelle et responsive.

Services & Interceptors : centralisation des appels API et gestion de l’authentification.

Socket.IO client : réception des notifications en temps réel.

🔑 Fonctionnalités principales

Gestion des utilisateurs : création, lecture, mise à jour, suppression.

Authentification avec JWT et refresh token.

Gestion des articles et des commentaires imbriqués.

Notifications en temps réel pour commentaires et réponses.

Interface responsive et dynamique avec Angular.