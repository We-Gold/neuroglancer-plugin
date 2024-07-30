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
    def __init__(self):
        self.config = CustomNeuroglancerArgs()

        neuroglancer.cli.handle_server_arguments(self.config)

        self.viewer = neuroglancer.Viewer()

        with self.viewer.txn() as s:
            s.layers["image"] = neuroglancer.ImageLayer(
                source="precomputed://gs://neuroglancer-public-data/flyem_fib-25/image"
            )

        self.latest_state = {}
        self.state_handled = False

        self.viewer.actions.add("export-json", lambda s: self.save_state(s))

        with self.viewer.config_state.txn() as s:
            s.input_event_bindings.viewer["control+keys"] = "export-json"

    def get_url(self):
        return f"http://{self.config.bind_address}:{self.config.bind_port}/v/{self.viewer.token}/"

    def get_state(self):
        return self.viewer.state.to_json()

    def save_state(self, state):
        self.latest_state = state
        self.state_handled = False
