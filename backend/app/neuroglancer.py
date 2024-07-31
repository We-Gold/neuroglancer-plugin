from dataclasses import dataclass

import neuroglancer
import neuroglancer.cli


@dataclass
class CustomNeuroglancerArgs:
    bind_port: int = 8002
    bind_address: str = "0.0.0.0"
    static_content_dev_server = None
    static_content_url = None
    debug_server = None


class Neuroglancer:
    def __init__(self, config=CustomNeuroglancerArgs()):
        self.config = config

        neuroglancer.cli.handle_server_arguments(self.config)

        self.viewer = neuroglancer.Viewer()

        with self.viewer.txn() as s:
            s.layers["image"] = neuroglancer.ImageLayer(
                source="precomputed://gs://neuroglancer-public-data/flyem_fib-25/image"
            )

    def get_url(self):
        """
        Get the URL of the Neuroglancer viewer.

        This URL is accessible from the host machine, even when running in a Docker container.

        Returns
        -------
        str
            The URL of the Neuroglancer viewer.
        """

        return f"http://{self.config.bind_address}:{self.config.bind_port}/v/{self.viewer.token}/"

    def get_state(self):
        """
        Get the current state of the Neuroglancer viewer as a JSON-compatible dictionary.

        Returns
        -------
        dict
            The current state of the Neuroglancer viewer.
        """

        return self.viewer.state.to_json()

    def set_state(self, state: dict):
        """
        Set the state of the Neuroglancer viewer.

        Parameters
        ----------
        state : dict
            The state to set the viewer to.
        """

        new_state = neuroglancer.viewer_state.ViewerState(json_data=state)

        self.viewer.set_state(new_state)
