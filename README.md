# quiz-app

This is a [FastAPI](https://fastapi.tiangolo.com/) app. We'll eventually use Docker/Docker Compose and other tools, but one thing at a time 😊

## Getting Started

To work within an isolated Python environment, activate a virtual environment first. From your terminal in the `project` directory:

```
python3 -m venv .venv
source .venv/bin/activate
(.venv) $ pip install -r requirements.txt
```

After your virtual environment is running, run this command from the `project` directory to start the application:

```
(.venv) $ uvicorn app.main:app --reload
```

Your app should now by live at [http://127.0.0.1:8000](http://127.0.0.1:8000)!
