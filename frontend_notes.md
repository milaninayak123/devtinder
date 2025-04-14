we will be using react with vite.
vite is 
in frontend you need a bundler or a build tool thatas builds your application. 
vite is one of many build tools.
we will focus on vite react as we are building a react project.
----
StrictMode is a tool for developers.

It doesn’t affect how your app works — it only helps during development.

It checks for potential problems (like deprecated APIs, unsafe lifecycle methods, etc.).

You can remove it, and the app will still work fine — but it's recommended while developing.
------
React Rendering (Notes)
Rendering means converting React components (JSX) into actual HTML on the screen.

React renders your app inside a specific HTML element (usually <div id="root">).

createRoot(...).render(<App />) mounts the App component into the DOM.

React uses this process to show UI based on your code.

In React 18+, createRoot is the new way to enable advanced features like concurrent rendering.
