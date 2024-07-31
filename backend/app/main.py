from app.server import app
from app.constants import DOCKER_HOST, DOCKER_PORT


def run_server():
    import uvicorn

    uvicorn.run(app, host=DOCKER_HOST, port=DOCKER_PORT)


if __name__ == "__main__":
    run_server()
