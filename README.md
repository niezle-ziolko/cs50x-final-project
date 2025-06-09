# CS50x Project 5 - Final Project

## Distinctiveness and Complexity
**Enigma** stands out as a unique project due to its focus on privacy-first note sharing, built entirely with modern web technologies such as **Cloudflare Workers**, **GraphQL**, and **JWT-based encryption**. Unlike typical note-sharing applications, **Enigma** introduces advanced features that let users limit how many times a note can be viewed (1–5 times) and optionally protect it with a password. Users can also supply their email to receive a notification once the note self-destructs.

At the core of **Enigma** is the **zero-knowledge model**: even administrators cannot access the contents of a note, thanks to the use of encrypted JSON Web Tokens (JWTs). This ensures a high level of data confidentiality.

The application was built using Next.js for the frontend, **Cloudflare Workers** for the backend, and D1 as the embedded SQL database. All communication between client and server happens over GraphQL, using `@apollo/client` and `@apollo/server`. Tailwind CSS was used to create a clean, responsive UI.

**Key technical challenges** I overcame included:
  - Implementing JWT-based encrypted note payloads that work serverlessly.
  - Setting up a GraphQL API inside Cloudflare Workers that communicates securely with D1.
  - Handling rate-limited view counters with automatic deletion.
  - Sending transactional emails through Brevo's SMTP API via Workers.
  - Ensuring security and scalability, even without traditional backend servers.

These complexities, combined with the privacy-first approach and modern stack, make **Enigma** a distinctive, technically challenging, and relevant project.

## File Descriptions
```
  cs50-final-project/
  ├── .eslintrc.json
  ├── .gitignore
  ├── jsconfig.json
  ├── LICENSE
  ├── next.config.mjs
  ├── open-next.config.ts
  ├── package.json
  ├── pnpm-lock.yaml
  ├── postcss.config.mjs
  ├── wrangler.jsonc                    # A file containing settings for the Cloudflare Workers service such as environment variables.
  ├── .vscode/
  │   └── settings.json
  ├── database/
  │   └── schema.sql
  ├── public/                           # Public files
  │   ├── _headers
  │   ├── _redirects
  │   └── logo.svg
  └── src/                              # Source files
      ├── lib/                          # Folder with files that add additional features to the application
      │   └── env.js                    # Script to load all environment variables in the application frontend
      └── app/                          # Main application folder
          ├── favicon.ico               # Favicon icon
          ├── layout.js                 # Layout file
          ├── not-found.js              # Not found page
          ├── page.js                   # Main page
          ├── utils.js                  # Utils frontend file
          ├── api/                      # A folder to create a backend for the application.
          │   ├── Sf19GHAdWc/
          │   │   └── route.js
          │   └── utils/
          │       ├── headers.js
          │       ├── resolvers.js
          │       ├── schema.js
          │       └── utils.js
          ├── client/
          │   ├── client.js
          │   ├── mutation.js
          │   └── query.js
          ├── components/
          │   ├── copy.jsx
          │   ├── footer.jsx
          │   ├── form.jsx
          │   ├── header.jsx
          │   ├── info.jsx
          │   ├── loader.jsx
          │   ├── message.jsx
          │   └── buttons/
          │        └── theme-button.jsx
          ├── context/
          │   └── theme-context.jsx
          ├── created/
          │   └── page.jsx
          ├── notate/
          │   └── page.jsx
          └── notate/
              └── page.jsx
```

---

## Key Features
- **Secure Notes with Expiry**
  Users can create notes that self-destruct after a configurable number of views (1–5). This functionality is enforced by Cloudflare D1 and validated via the GraphQL API.

- **Password Protection (Optional)**
  Notes can be optionally protected by a password. The decryption happens client-side using information embedded in the token.

- **Email Notifications via Brevo**
  When an email is provided, Enigma will notify the user once the note is deleted (after the last view).

- **JWT Encryption for Privacy**
  Each note is encoded as an encrypted JWT. All sensitive data is stored encrypted, even within the database. Only the client with the correct token can decrypt and view it.

- **GraphQL API on Cloudflare Workers**
  All data operations (create, fetch, delete) are handled via a secure GraphQL API using @apollo/server.

- **Modern Frontend with Tailwind CSS + Next.js**
  The UI is built with modern design principles using Tailwind for speed and responsiveness.

- **Authentication with Cloudflare Turnstile**
  Integrating forms with Cloudflare's Turnstile service to combat bot traffic to the site. The main advantage of the service is that it throws out a one-time token, which is then sent with an `Authentication: Bearer 0.5kIm-qV3p...` header in order for the `bearerHeader` function to authenticate the user to perform GraphQL queries.

## Demo
Demo site available on: https://enigma.niezle-ziolko.workers.dev

## Example Workflow
1. **Create a Note**
  - Visit homepage
  - Fill in note content
  - Optionally set view limit (1–5), password, or email
  - Click **Create note** button

2. **Receive a Link**
  - After creation, you’ll get a link like: `https://enigma.niezle-ziolko.workers.dev/notate?=eyJhbGciOi...`
  - Accessing a Note
  - Open the link
  - If password-protected, enter the password
  - View the note (each view reduces the counter)

3. **Note Expiry**
  - After max views, note is deleted from the D1 database
  - If email was provided, a notification is sent

## Technologies Used
  - **Frontend**
    - Next.js (React-based framework)
    - Tailwind CSS
    - Apollo Client

  - **Backend**
    - Cloudflare Workers
    - GraphQL with Apollo Server
    - Cloudflare D1 (SQLite-based edge database)

  - **Other**
    - JWT (for encrypted token generation)
    - Brevo (formerly Sendinblue) for transactional email
    - Cloudflare Turnstile for Authorization user

---

## GraphQL Operations
Below are the core GraphQL operations used in the Enigma app to manage encrypted notes:
  - Create note:
    ```graphql
    mutation CreateMessage($message: String!, $password: String, $email: String, $display: Int!) {
      createMessage(message: $message, password: $password, email: $email, display: $display) {
        id
      }
    }
    ```

  - Delete note:
    ```graphql
    mutation DeleteMessage($id: ID!) {
      deleteMessage(id: $id) {
        message
      }
    }
    ```

  - Verify password:
    ```graphql
    mutation VerifyPassword($id: String!, $password: String!) {
      verifyPassword(id: $id, password: $password) {
        message
      }
    }
    ```

  - Get message:
    ```graphql
    query GetMessage($id: ID!) {
      getMessage(id: $id) {
        message
      }
    }
    ```

## Dependencies

To run the application, make sure you have the following dependencies installed:
  ```json
  "@apollo/client": "^3.13.8",
	"@apollo/server": "^4.12.2",
	"@as-integrations/cloudflare-workers": "^1.1.1",
	"@graphql-tools/schema": "^10.0.23",
	"@opennextjs/cloudflare": "^1.2.1",
	"graphql": "^16.11.0",
	"jose": "^6.0.11",
	"next": "15.3.3",
	"react": "^19.1.0",
	"react-dom": "^19.1.0",
	"uuid": "^11.1.0"
  ```

To install all dependencies, run:
  ```sh
  pnpm install
  ```

---

## Development & Deployment

### Create databases for Cloudflare D1
Create local development databases for Cloudflare D1:
  ```sh
  pnpm db --local
  ```

Create production databases in the Cloudflare dashboard:
  ```sh
  pnpm db --remote
  ```

### Running the Application in Development Mode
To start the application in development mode, run the following commands:
  ```sh
  pnpm dev
  ```

### Building and Previewing the Application
To build the application in production mode, use:
  ```sh
  pnpm prod
  ```

To preview the production build locally, run:
  ```sh
  pnpm preview
  ```

### Deploying to the Server
To deploy the application, use the command:
  ```sh
  pnpm deploy
  ```