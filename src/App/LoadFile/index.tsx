/* eslint-disable no-mixed-spaces-and-tabs */
import styles from "./styles.module.css"

import { DirectoryData, FileSystemNode } from ".."

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
					{Object.values(directoryData.data.nodes).map((node) => (
						<Node node={node} loadJSON={loadJSON} />
					))}
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

function Node({
	node,
	loadJSON,
}: {
	node: FileSystemNode
	loadJSON: (file: string) => void
}): JSX.Element {
	const isFolder = node.children !== undefined
	const isEmpty =
		node.children !== undefined && Object.keys(node.children).length === 0

	const isJSON = node.name.endsWith(".json")

	return (isFolder && !isEmpty) || isJSON ? (
		<div
			className={`poppins-light ${
				isFolder ? styles.folder : styles.file
			}`}
			onClick={isFolder ? () => {} : () => loadJSON(node.path)}
		>
			<div>{node.name}</div>
			<hr className={styles.hr} />
			<div style={{ paddingLeft: "2rem" }}>
				{isFolder
					? Object.values(node.children!).map((child) => (
							<Node node={child} loadJSON={loadJSON} />
					  ))
					: null}
			</div>
		</div>
	) : (
		<></>
	)
}

export default LoadFile

