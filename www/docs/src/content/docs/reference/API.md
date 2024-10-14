---
title: API Reference 📚
description: Explore the essential classes and methods of the Abi framework. This reference guide provides an overview of the core API, including how to configure, route, serve, and make HTTP requests using Abi. Perfect for developers looking to build versatile cross-platform applications with Node, Bun, or Deno.
---

## Introduction 🚀

Abi.js is a lightweight and versatile TypeScript framework designed
to be used across Node, Bun, and Deno environments.
It allows you to build web applications, manage HTTP routes,
and make HTTP requests in a simple and intuitive manner.
This section of the documentation serves as a reference
for the available APIs in Abi.

## Abi.js Class 🏗️

The `Abi.js` class is the main class of the framework, combining routing, the server, and the HTTP client into one entity.

### Methods

- **`get(path: string, handler?: (params: any) => any): this`**
  - Defines a GET route for the application.
  - **Parameters**:
    - `path`: The route to associate.
    - `handler`: Function to be called when the route is accessed.
  - **Example**:

    ```typescript
    const abi = new Abi();
    abi.get('', 'Welcome to Abi.js!');
    abi.get(':name', (name: string) => `Hello ${name}!`);
    ```

- **`serve(): void`**
  - Starts the HTTP server and begins listening for requests on the defined routes.
  - **Example**:

    ```typescript
    abi.serve();
    ```

- **`static get(input: string | Request, options?: RequestInit): Promise<Response>`**
  - Makes an HTTP GET request using the internal client.
  - **Parameters**:
    - `input`: The URL or `Request` object.
    - `options`: Additional options for the request.
  - **Example**:

    ```typescript
    const response = await Abi.get('https://api.example.com/data');
    ```

## Router Class 🛣️

The `Router` class handles the routes defined for the application.

### Methods

- **`get(path: string, handler?: (params: any) => any): void`**
  - Defines a GET route for the router.
  - **Example**:

    ```typescript
    const router = new Router();
    router.get('/about', () => 'About Us');
    ```

## Server Class 🖥️

The `Server` class is responsible for serving the routes defined by the router.

### Methods

- **`serve(port?: number): void`**
  - Starts the server on the specified port.
  - **Example**:

    ```typescript
    const server = new Server(router);
    server.serve(3000);
    ```

## Client Class 🌐

The `Client` class is used to make HTTP requests.

### Methods

- **`static get(input: string | Request, options?: RequestInit): Promise<Response>`**
  - Makes an HTTP GET request.
  - **Example**:

    ```typescript
    const response = await Client.get('https://api.example.com/data');
    ```

## Abi.js Configuration ⚙️

Abi.js can be configured using the `defineConfig` method.

### Types

- **`AbiConfig`**: Partial or undefined configuration type.
- **`Config`**: Complete configuration type with all parameters.
- **`defaultConfig`**: The default configuration used by Abi.

### Methods

- **`defineConfig(config: AbiConfig): Config`**
  - Defines the configuration for Abi by merging default values with those provided.
  - **Example**:

    ```typescript
    import { defineConfig } from 'abi.js/config';

    const config = defineConfig({
        rootDirectory: '/my/custom/path',
    });
    ```

## Conclusion 🎯

This section is a starting point for exploring Abi's features.
As development progresses, this reference will be expanded
to provide complete details on each available feature and method.
