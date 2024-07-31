from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.neuroglancer import Neuroglancer

from app.volume_server import copy_to_volume

neuroglancer_instance = Neuroglancer()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Visit https://0.0.0.0:8001/docs to see the API documentation and test the endpoints


@app.get("/")
async def read_root():
    return {"result": "Neuroglancer Plugin backend is working!"}


@app.get("/neuroglancer-url")
async def neuroglancer_url():
    return {"url": neuroglancer_instance.get_url()}


@app.get("/get-neuroglancer-state")
async def get_neuroglancer_state():
    return {"state": neuroglancer_instance.get_state()}


@app.post("/set-neuroglancer-state")
async def set_neuroglancer_state(state: dict):
    neuroglancer_instance.set_state(state)


@app.post("/copy-to-volume")
async def copy_to_volume_call(file_path: str):
    # Copy a file from an absolute path on the host file system
    # to the plugin folder in the volume ("/volume/PLUGIN_NAME/")
    # sourcePath: absolute path of the file on the host file system
    # targetPath: relative path of the file in the plugin folder in the volume
    files = [
        {"sourcePath": file_path, "targetPath": "./"},
    ]

    await copy_to_volume(files)

    return {"result": "File copied to volume!"}
