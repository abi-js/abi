import { component$, useSignal } from "@builder.io/qwik";

import "./app.css";
import abiLogo from "./assets/abi.svg";

export const App = component$(() => {
  const count = useSignal(0);

  return (
    <>
      <div>
        <a href="https://abi.deno.dev" target="_blank" rel="noreferrer">
          <img src={abiLogo} class="logo" alt="Velox logo" />
        </a>
      </div>
      <h1>Abi.js</h1>
      <p>TypeScript<br/>(with Vite and Qwik)</p>
      <div class="card">
        <button type="button" onClick$={() => count.value++}>
          count is {count.value}
        </button>
      </div>
      <p class="read-the-docs">Click on the Abi logo to learn more</p>
    </>
  );
});
