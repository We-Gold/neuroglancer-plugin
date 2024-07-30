import { useEffect, useState } from "react"
import styles from "./styles.module.css"

// NOTE: Change the PORT to the port of the server from the backend
// The app's server is running on port 8000, so use a different port
// that is not being used by the app or any other plugins
const PORT = 8001

const REFRESH_INTERVAL = 1000

function TemplatePage(): JSX.Element {
	const [connected, setConnected] = useState<boolean>(false)
	const [ngViewerURL, setNgViewerURL] = useState<string | null>(null)
	const [fetching, setFetching] = useState<boolean>(false)

	useEffect(() => {
		const runFetch = () => {
			fetch(`http://localhost:${PORT}/`)
				.then((res) => res.text())
				.then(() => setConnected(true))
				.catch(() => setTimeout(runFetch, REFRESH_INTERVAL))
		}

		if (connected === false) {
			runFetch()
		}
	}, [connected])

	useEffect(() => {
		if (connected === true && ngViewerURL === null && !fetching) {
			// Fetch the path to the Neuroglancer viewer
			fetch(`http://localhost:${PORT}/neuroglancer-url`)
				.then((res) => res.json())
				.then(({ url }) => setNgViewerURL(url))
				.catch(console.error)

			setFetching(true)
		}
	}, [connected, ngViewerURL, fetching])

	useEffect(() => {
		const registerMessage = {
			type: "register-plugin",
			data: {
				pluginName: "neuroglancer-plugin",
			},
		}

		// Register the plugin with the main app
		// Doing so allows the main app to send messages to the plugin,
		// which it primarily uses to send directory information (i.e. the open folder in the main app)
		parent.postMessage(registerMessage, "*")

		// Listen for messages from the main app
		// See iframe.tsx and iframe-message-schema.ts in the main app for more information
		// You can use this to get directory information from the main app,
		// to read file contents, or to save file contents through the main app
		const listener = (event: MessageEvent) => {
			console.log(event.data)
		}

		window.addEventListener("message", listener)

		return () => {
			window.removeEventListener("message", listener)
		}
	}, [])

	return (
		<>
			{connected ? (
				ngViewerURL ? (
					<iframe
						src={ngViewerURL}
						className={styles.viewer}
						title="Neuroglancer Viewer"
					/>
				) : (
					<p className={styles.centeredText}>
						Loading Neuroglancer viewer...
					</p>
				)
			) : (
				<p className={styles.centeredText}>Connecting to server...</p>
			)}
		</>
	)
}

export default TemplatePage

