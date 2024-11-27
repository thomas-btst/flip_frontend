# **Flip Skateshop Frontend**

Flip Skateshop Frontend is a frontend application written in **Typescript** with the **React** framework.
This project uses [Flip Skateshop Backend](https://etulab.univ-amu.fr/b22008241/flip_backend) API.

## **Table of Contents**

1. [Technologies Used](#technologies-used)
2. [Architecture](#architecture)
3. [Getting Started](#getting-started)
4. [Usage](#usage)
5. [Contributing](#contributing)
6. [Author](#author)
7. [License](#license)

## **Technologies Used**

- **Language**: [Typescript](https://www.typescriptlang.org/)
- **Framework**: [React](https://fr.react.dev/)
- **Dependency Management**: [NPM](https://www.npmjs.com/)
- **Build Tool**: [Vite](https://vite.dev/)
- **CSS Framework**: [TailwindCSS](https://tailwindcss.com/)
- **Http client**: [Axios](https://axios-http.com/fr/docs/intro)
- **Others**:
    - [React Router](https://reactrouter.com/) for routing in the React application
    - [Tanstack Query](https://tanstack.com/query/latest) for state management

## **Architecture**

The project follows a feature-based architecture within the src directory :
- **main.tsx**: React application entrypoint.
- **App.tsx** : Application root file wich contains React Routes logic.
- **api/** : Contains API service files such as API Routes, DTOs (Data Transfer Objects) and Mappers.
- **assets/** : Contains images, and other static assets.
- **components/** : Contains reusable React components.
- **config/** : Stores configuration files.
- **contexts/** : Regroups React application contexts.
- **features/** : Contains components and logic for specific features.
- **hooks/** : Contains reusable React hooks.
- **pages/** : Stores components that correspond to app routes.
- **utils/** : Regroups utility function or helpers shared across the application.

## **Getting started**

### Requirements

For building and running the application you need :

- **[NodeJS](https://nodejs.org/fr/download/package-manager)** 22 installed
- **[Flip Skateshop Backend](https://etulab.univ-amu.fr/b22008241/flip_backend)**

### Steps

1. Clone the project :
``` bash
git clone git@etulab.univ-amu.fr:b22008241/flip_frontend.git
cd flip_frontend
```
2. Install dependencies with NPM :
``` bash
npm install
```
3. Launch [Flip Skateshop Backend](https://etulab.univ-amu.fr/b22008241/flip_backend)
4. Start the application with NPM :
``` bash
npm run dev
```

## **Usage**

#### Run Locally
``` bash
npm run dev
```
#### Run code quality tool
``` bash
npm run lint
```

## Contributing

Before pushing your code, follow these steps to ensure your changes are valid :

1. **Build the project** Make sure the project can build successfully
``` bash
npm run build
```
2. **Run code quality tool** verify that your code respects typescript standards
``` bash
npm run lint
```
3. **Push Your Changes** You can now push your changes safely
``` bash
git add .
git commit
git push
```

## Author

**Name** : Thomas BATISTA  
**Institution** : IUT of Arles  
**Role** : Student developper  
**Program** : BUT Informatique  
**Contact** : thomas.batista@etu.univ-amu.fr  

## License

This project is developed as part of my formation.  
It is used for educational purposes only and is not intended for commercial use.