import styles from "./styles.module.css"

import { DirectoryData } from ".."
import { useState } from "react"

function SaveFile({
	directoryData,
	saveJSON,
}: {
	directoryData: DirectoryData | null
	saveJSON: (file: string) => void
}): JSX.Element {
	const [fileName, setFileName] = useState<string>("neuroglancer.json")

	const directoryDataExists =
		directoryData !== null && directoryData.data.directoryPath !== null

	return (
		<>
			<div className="poppins-black" style={{ fontSize: "1.75rem" }}>
				SAVE JSON
			</div>
			{directoryDataExists ? (
				<div className={styles.container} style={{ width: "100%" }}>
					<label
						htmlFor="fileName"
						className={`poppins-light ${styles.label}`}
					>
						File Name{" "}
					</label>
					<input
						type="text"
						name="fileName"
						id="fileName"
						value={fileName}
						onChange={(e) => setFileName(e.target.value)}
						className={`poppins-light ${styles.input}`}
					/>
					<button
						className={`poppins-light ${styles.saveButton}`}
						onClick={() => saveJSON(fileName)}
					>
						SAVE
					</button>
				</div>
			) : (
				<div>
					<div
						className="poppins-regular"
						style={{ fontSize: "1rem" }}
					>
						File &gt; Open Folder
					</div>
				</div>
			)}
		</>
	)
}

export default SaveFile

