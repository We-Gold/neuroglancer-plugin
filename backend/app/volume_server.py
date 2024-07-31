import requests

from app.constants import PLUGIN_NAME, VOLUME_SERVER_URL


async def copy_to_volume(files):
    data = {
        "volumeName": "ouroboros-volume",
        "pluginFolderName": PLUGIN_NAME,
        "files": files,
    }

    return await request_volume_server("copy-to-volume", data)


async def copy_to_host(files):
    data = {
        "volumeName": "ouroboros-volume",
        "pluginFolderName": PLUGIN_NAME,
        "files": files,
    }

    return await request_volume_server("copy-to-host", data)


async def clear_plugin_folder():
    data = {
        "volumeName": "ouroboros-volume",
        "pluginFolderName": PLUGIN_NAME,
    }

    return await request_volume_server("clear-plugin-folder", data)


async def request_volume_server(path, data):
    url = f"{VOLUME_SERVER_URL}/{path}"
    try:
        result = requests.post(
            url,
            headers={"Content-Type": "application/json"},
            json=data,
        )
        if not result.ok:
            return False, result.text
        else:
            return True, ""
    except Exception as error:
        return False, str(error)
