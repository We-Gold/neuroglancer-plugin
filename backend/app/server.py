from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.neuroglancer import Neuroglancer
from app.helpers import combine_unknown_folder
from app.volume_server import copy_to_host

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


@app.post("/save-neuroglancer-screenshot")
async def save_neuroglancer_screenshot(directory_path: str):
    filename = neuroglancer_instance.take_screenshot()

    if filename is not None and isinstance(filename, str):
        # Make sure the directory path ends with a "/" or "\" character
        file_path = combine_unknown_folder(directory_path, filename)

        # Copy the screenshot to the plugin folder in the volume
        files = [
            {"sourcePath": file_path, "targetPath": "./"},
        ]

        await copy_to_host(files)
    else:
        return {"error": "Failed to save screenshot."}
