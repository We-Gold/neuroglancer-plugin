import { useEffect, useState } from "react"
import styles from "./styles.module.css"
import Menu from "./Menu"
import Modal from "./Modal"
import LoadFile from "./LoadFile"
import SaveFile from "./SaveFile"

// NOTE: Change the PORT to the port of the server from the backend
// The app's server is running on port 8000, so use a different port
// that is not being used by the app or any other plugins
const PORT = 8001

const REFRESH_INTERVAL = 1000

export type DirectoryData = {
	type: string
	data: {
		directoryPath: string | null
		directoryName: string | null
		files: string[]
		isFolder: boolean[]
	}
}

function TemplatePage(): JSX.Element {
	const [connected, setConnected] = useState<boolean>(false)
	const [ngViewerURL, setNgViewerURL] = useState<string | null>(null)
	const [fetchingNGURL, setFetchingNGURL] = useState<boolean>(false)

	const [directoryData, setDirectoryData] = useState<DirectoryData | null>(
		null
	)

	const [showMenu, setShowMenu] = useState<boolean>(false)

	const [showModal, setShowModal] = useState<boolean>(false)
	const [form, setForm] = useState<string>("")

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
		if (connected === true && ngViewerURL === null && !fetchingNGURL) {
			// Fetch the path to the Neuroglancer viewer
			fetch(`http://localhost:${PORT}/neuroglancer-url`)
				.then((res) => res.json())
				.then(({ url }) => setNgViewerURL(url))
				.catch(console.error)

			setFetchingNGURL(true)
		}
	}, [connected, ngViewerURL, fetchingNGURL])

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
		const listener = (event: MessageEvent) => {
			const result = event.data

			switch (result.type) {
				case "send-directory-contents":
					setDirectoryData(result)
					break
				case "read-file-response":
					// Use fetch to send the contents to the server,
					// with the contents as the body of the request
					fetch(`http://localhost:${PORT}/set-neuroglancer-state`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: result.data.contents, // `result.data.contents` is the contents of the file (a json string)
					}).catch(console.error)

					break

				default:
					break
			}
		}

		window.addEventListener("message", listener)

		return () => {
			window.removeEventListener("message", listener)
		}
	}, [])

	const onUpload = () => {
		setShowMenu(false)
		setShowModal(true)
		setForm("upload")
	}

	const onDownload = () => {
		setShowMenu(false)
		setShowModal(true)
		setForm("download")
	}

	const loadJSON = (file: string) => {
		if (!directoryData || !directoryData.data.directoryPath) return

		const message: {
			type: string
			data: {
				folder: string
				fileName: string
			}
		} = {
			type: "read-file",
			data: {
				folder: directoryData.data.directoryPath,
				fileName: file,
			},
		}

		parent.postMessage(message, "*")
	}

	const saveJSON = async (file: string) => {
		if (!directoryData || !directoryData.data.directoryPath) return

		let state = null

		// Get the neuroglancer state
		try {
			const result = await fetch(
				`http://localhost:${PORT}/get-neuroglancer-state`
			).then((res) => res.json())

			state = result.state
		} catch (error) {
			console.error(error)
			return
		}

		// Write the neuroglancer state to the file
		const message: {
			type: string
			data: {
				folder: string
				fileName: string
				contents: string
			}
		} = {
			type: "save-file",
			data: {
				folder: directoryData.data.directoryPath,
				fileName: file,
				contents: JSON.stringify(state, null, 4),
			},
		}

		parent.postMessage(message, "*")

		// Hide the modal to indicate that the file has been saved
		setShowModal(false)
	}

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
			<Menu
				showMenu={showMenu}
				setShowMenu={setShowMenu}
				onUpload={onUpload}
				onDownload={onDownload}
			/>
			<Modal show={showModal} setShow={setShowModal}>
				{form === "upload" ? (
					<LoadFile
						directoryData={directoryData}
						loadJSON={loadJSON}
					/>
				) : form === "download" ? (
					<SaveFile
						directoryData={directoryData}
						saveJSON={saveJSON}
					/>
				) : null}
			</Modal>
		</>
	)
}

export default TemplatePage

