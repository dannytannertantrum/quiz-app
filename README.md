# quiz-app

A quiz app built with the following tech:

- [FastAPI](https://fastapi.tiangolo.com/)
- [Docker with Docker Compose](https://docs.docker.com/compose/)
- [PostgreSQL](https://www.postgresql.org/)
- [SQLAlchemy](https://docs.sqlalchemy.org/en/20/) with [Alembic](https://alembic.sqlalchemy.org/en/latest/)

## Getting Started

1. **Clone the repo**
2. **Downloads -** Make sure you have the following installed on your machine:

- [Docker Desktop](https://docs.docker.com/get-docker/)
- [Postgres](https://www.postgresql.org/download/)

3. **Create an isolated Python environment and activate it -** Run the following commands from your terminal in the `backend` directory:

```
python3 -m venv .venv
source .venv/bin/activate
(.venv) $ pip3 install -r requirements.txt
(.venv) $ docker-compose up -d --build
```

Now that the app is running, check out the docs and play around with the API endpoints: [http://127.0.0.1:8004/docs](http://127.0.0.1:8004/docs) (though it'll certainly help to run migrations and seed the data first! See below.)

## Database

### Running Database Migrations

We're using [SQLAlchemy](https://docs.sqlalchemy.org/en/20/index.html) as our ORM and [Alembic](https://alembic.sqlalchemy.org/en/latest/) to manage migrations. With the commands above in _Getting Started_, you should have...

- Three containers up and running: `backend`, `db` and `frontend`
  - **NOTE:** You can confirm this by running `docker compose ps`
- Have two empty databases: `dev` and `test`

We manage our `dev` database migrations with alembic. For tests, we bind the models via SQLAlchemy and tables are built before any tests run.

### Migration Commands

- **Upgrade to the latest migration:** `docker compose exec backend alembic upgrade head`
- **Upgrade per migration:** `docker compose exec backend alembic upgrade +1`
- **Downgrade all the way back to nothing:** `docker compose exec backend alembic downgrade base`
- **Downgrade per migrations:** `docker compose exec backend alembic downgrade -1`
- **Get the current version:** `docker compose exec backend alembic current`
- **After creating a new model and you want to autogenerate SQL:** `docker compose exec backend alembic revision --autogenerate -m "Your commit message here"`

### Seeding The Data

With the containers up and running, make sure you are on the latest migration. If you haven't already, run the script above for migrating to the latest version. Once that is taken care of, `cd` into the `./backend/database` directory and run the following command in your terminal:

```
./seed-db.sh
```

Our local database (not test) should have some data we can play around with now.

## Testing

As stated above, the test database is configured via `conftest.py` before any tests run. To run tests, make sure the containers are running and run: `docker compose run -e ENVIRONMENT=test backend python3 -m pytest`
