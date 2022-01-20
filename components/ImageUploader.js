import { useState } from "react"
import Loader from "./Loading"

import { auth, storage, uploadBytesResumable } from "../lib/firebase"
import { ref, getDownloadURL } from "firebase/storage"

export default function ImageUploader() {
	const [uploading, setUploading] = useState(false)
	const [progress, setProgress] = useState(0)
	const [downloadURL, setDownloadURL] = useState(null)

	const uploadFile = (e) => {
		// Gets the file
		const file = Array.from(e.target.files)[0]
		const extension = file.type.split("/")[1]

		// Reference to storage bucket location
		const imgRef = ref(
			storage,
			`uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`
		)
		setUploading(true)

		// Starts the upload
		const uploadTask = uploadBytesResumable(imgRef, file).then((url) => {
			getDownloadURL(imgRef).then((url) => {
				setDownloadURL(url)
				setUploading(false)
			})
		})

		// Listens to updates to upload task
		// uploadTask.on("state_changed", (snapshot) => {
		// 	const pct = (
		// 		(snapshot.bytesTransferred / snapshot.totalBytes) *
		// 		100
		// 	).toFixed(0)
		// })

		// getDownloadURL(imgRef).then((url) => {
		// })
	}

	return (
		<div className="box">
			<Loader show={uploading} />
			{uploading && <h3>{progress}%</h3>}
			{!uploading && (
				<>
					<label htmlFor="file-uploader" className="btn">
						Upload File
						<input
							type="file"
							onChange={uploadFile}
							id="file-uploader"
							accept="image/x-png,image/gif,image/jpeg"
						/>
					</label>
				</>
			)}
			{downloadURL && (
				<code className="upload-snippet">{`![alt](${downloadURL})`}</code>
			)}
		</div>
	)
}
