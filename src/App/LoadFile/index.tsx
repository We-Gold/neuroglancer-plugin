import styles from "./styles.module.css"

import { DirectoryData } from ".."

function LoadFile({
	directoryData,
	loadJSON,
}: {
	directoryData: DirectoryData | null
	loadJSON: (file: string) => void
}): JSX.Element {
	const directoryDataExists =
		directoryData !== null && directoryData.data.directoryPath !== null

	return (
		<>
			<div className="poppins-black" style={{ fontSize: "1.75rem" }}>
				LOAD JSON
			</div>
			{directoryDataExists ? (
				<div style={{ width: "100%" }}>
					{directoryData.data.files.map(
						(file, index) =>
							file.endsWith(".json") && (
								<div
									key={index}
									className={`poppins-light ${styles.file}`}
									onClick={() => loadJSON(file)}
								>
									<div>{file}</div>
									<hr className={styles.hr} />
								</div>
							)
					)}
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

export default LoadFile

