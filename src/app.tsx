import { component$, useSignal } from "@builder.io/qwik";

import "./app.css";
import veloxLogo from "./assets/velox.svg";

export const App = component$(() => {
  const count = useSignal(0);

  return (
    <>
      <div>
        <a href="https://velox-sh.github.io" target="_blank" rel="noreferrer">
          <img src={veloxLogo} class="logo" alt="Velox logo" />
        </a>
      </div>
      <h1>Velox</h1>
      <p>Vlang + TypeScript<br/>(with Vite and Qwik)</p>
      <div class="card">
        <button type="button" onClick$={() => count.value++}>
          count is {count.value}
        </button>
      </div>
      <p class="read-the-docs">Click on the Velox logo to learn more</p>
    </>
  );
});
