from app.server import app

DOCKER_HOST = "0.0.0.0"
DOCKER_PORT = 8000


def run_server():
    import uvicorn

    uvicorn.run(app, host=DOCKER_HOST, port=DOCKER_PORT)


if __name__ == "__main__":
    run_server()
