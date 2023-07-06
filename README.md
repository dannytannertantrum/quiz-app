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

3. **Create an isolated Python environment and activate it -** Run the following commands from your terminal in the `project` directory:

```
python3 -m venv .venv
source .venv/bin/activate
(.venv) $ docker-compose up -d --build
```

Your app should now be live at [http://127.0.0.1:8004](http://127.0.0.1:8004)!
