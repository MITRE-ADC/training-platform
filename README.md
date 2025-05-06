# WebGoat Training Platform

## Please read through this whole document before starting the application!

## Tech Stack

We are using React + Next.js, with a PostgreSQL database. The package manager is pnpm.

## Docker

There are two containers:

- webgoat
- postgres_db

The containers are run by staying in the root directory (/training-platform) and running

```
docker compose -f docker-compose.yml up -d
```

NOTE: The “-d” is used to run the container in detached mode, and is optional.

## Packages

The package manager is pnpm. Install all the dependencies using

```
pnpm install
```

This application is supported on Next.js version 14.2.18. This can be checked by running:

```
npx next --version
```

## Environment Variables

You will need to add a `.env` file in the project root directory (`/training-platform`).
Here is an example of what should be in the `.env` file:

```
NEXT_PUBLIC_DOMAIN=http://localhost:3000/
ADMIN_USER_EMAIL="admin@mitre.com"
ADMIN_PASSWORD="changed" # This is the admin password for the application

PG_HOST=localhost
PG_PORT=5432
PG_USER=mitre_admin
PG_PASSWORD=changeme # This is the password for the PostgreSQL user
PG_DATABASE=mitre_db
```

If any of these are not present, the application might crash.

## Changing the Admin Credentials

The admin credentials (admin email and password) must be changed in two places:

- `ADMIN_USER_EMAIL`, `ADMIN_PASSWORD` in `.env`
- The values corresponding to `email`, `pass` in the last line of `create_tables.sql`.

## Running the Application

To start the application in production mode, run

```
pnpm build
pnpm start
```

At this point, the application is started.

To start the application in development mode, run

```
pnpm dev
```

To navigate to the application, go to `http://localhost:3000` in your browser.

### IMPORTANT NOTE:

As the admin, before allowing other users to register their accounts, you must create a dummy user account of your own, log into it, and click the reload button IN THE USER ACCOUNT (not the reload button on the admin dashboard). This is what allows the application to import WebGoat’s courses. This action only needs to be taken once, as once the platform has imported the course information from WebGoat, it does not need to be done again. Once the courses are imported, the admin can begin assigning tasks.

## Further Information About the Platform

In both the User and Admin dashboards, the info button can be clicked to get further information about how to complete and assign tasks and adjust their due dates.

##Accessing the Database
To access and query the database itself, run the following commands:

```
docker exec -it postgres_db /bin/bash
psql -U mitre_admin mitre_db
```

- “postgres_db” can be replaced by whatever the name of the database is in docker-compose.yml
- “mitre_admin” and “mitre_db” can be replaced by whatever is in “PG_USER” and “PG_DATABASE” are in the .env file.
  Then regular SQL queries can be made, such as `select * from users;`

## Restarting the Application

To restart the application and wipe all data, run the following three commands from the root directory (/training-platform):

```
docker compose -f docker-compose.yml down
rm -rf postgres_data
docker compose -f docker-compose.yml up -d
```

## Advisories/Warnings

1. Do not sign in multiple times in the same browser at the same time. If you must, open an incognito tab or a guest browsing tab.
2. If WebGoat’s Docker container is stopped or shut down and restarted, all information in it will be deleted. This includes all WebGoat user accounts and course progress. Since the WebGoat credentials auto-generation process and WebGoat auto-account-creation process are tied into the process of creating user accounts on the MITRE Training Platform, this means it will be extremely difficult to keep the same user accounts and re-create the WebGoat accounts. In that case, it will be simpler to just wipe the entire database, and re-enrolling all members, which will automatically create new WebGoat accounts. The good thing is, no actual information is stored in the Training Platform, so there will be no data loss apart from WebGoat assignment progress.
