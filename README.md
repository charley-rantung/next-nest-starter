## Introduction

1. There are 3 packages in this project

- API: as a server / backend service
- WEB: as a client / frontend service
- API-Contracts: as a type and schema contract between API and WEB, this package is used to share types and schema between API and WEB, so that we can avoid duplication of types and schema, and also we can ensure that the types and schema are always in sync between API and WEB.

## HOW TO SETUP

1.  Adjust project information especially project name on
    - apps/api/package.json
    - apps/web/package.json
    - packages/api-contracts/package.json

2.  If you have adjust `packages/api-contracts/package.json`, then do this.
    Go to search tab, search old package name, then replace all with the new one
    for example:

    ```txt
    search: @starter-pack/api-contracts
    replace: @my-project/api-contracts
    ```

3.  Adjust `.env` file on each project
    - apps/api/.env
    - apps/web/.env

    Replace `.env.example` with `.env` and adjust the values according to your needs.

4.  Install dependencies

    ```bash
    pnpm install
    ```

5.  Build `packages/api-contracts`, so that the types and schema can be used by API and WEB

    ```bash
    npm run build
    ```

6.  Run migration to create database tables in `apps/api`

    ```bash
    npx prisma migrate deploy
    ```

7.  Run seed to populate database with dummy data in `apps/api` (create if needed)

    ```bash
    npx prisma db seed
    ```

8.  Build `apps/api` and `apps/web`

    ```bash
     npm run build
    ```

9.  Run each app

    ```bash
    <!-- api -->
    npm run start:prod

    <!-- web -->
    npm start
    ```

## Configure PM2

We can use pm2 as a daemon to run all projects

1. Install pm2

   ```bash
   npm i -g pm2
   ```

2. Adjust `ecosystem.config.js` file if needed

3. Start `ecosystem.config.js` script

   ```bash
   pm2 start ecosystem.config.js
   ```

4. Save current running processes into a dump file

   ```bash
   pm2 save
   ```

   This script will tell the system which apps to restart after reboot

5. Generate and configures a system startup script

   ```bash
   pm2 startup
   ```

   This script will tell the system to reload apps after reboot
