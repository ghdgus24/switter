import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const SwitFactory = ({ userObj }) => {
	const [swit, setSwit] = useState("");
	const [attachment, setAttachment] = useState("");
	const onSubmit = async (event) => {
		if (swit === "") {
			return;
		}
		event.preventDefault();
		let attachmentUrl = "";
		if (attachment !== "") {
			const attachmentRef = storageService
				.ref()
				.child(`${userObj.uid}/${uuidv4()}`);
			const response = await attachmentRef.putString(attachment, "data_url");
			attachmentUrl = await response.ref.getDownloadURL();
		}
		const switObj = {
			text: swit,
			createdAt: Date.now(),
			creatorId: userObj.uid,
			attachmentUrl,
		};
		await dbService.collection("swits").add(switObj);
		setSwit("");
		setAttachment("");
	};

	const onChange = (event) => {
		const {
			target: { value },
		} = event;
		setSwit(value);
	};

	const onFileChange = (event) => {
		const {
			target: { files },
		} = event;
		const theFile = files[0];
		const reader = new FileReader();
		reader.onloadend = (finishedEvent) => {
			const {
				currentTarget: { result },
			} = finishedEvent;
			setAttachment(result);
		};
		reader.readAsDataURL(theFile);
	};

	const onClearAttachment = () => setAttachment("");
	return (
		<form onSubmit={onSubmit} className="factoryForm">
			<div className="factoryInput__container">
				<input
					className="factoryInput__input"
					value={swit}
					type="text"
					onChange={onChange}
					placeholder="What's on your mind?"
					maxLength={120}
				/>
				<input type="submit" value="&rarr;" className="factoryInput__arrow" />
			</div>
			<label for="attach-file">
				<span>Add photos</span>
				<FontAwesomeIcon icon={faPlus} />
			</label>
			<input
				id="attach-file"
				type="file"
				accept="image/*"
				onChange={onFileChange}
				style={{ opacity: 0 }}
			/>
			{attachment && (
				<div className="factoryForm__attachment">
					<img
						src={attachment}
						style={{ backgroundImage: attachment }}
						alt="swit img"
					/>
					<div className="factoryForm__clear" onClick={onClearAttachment}>
						<span>Remove</span>
						<FontAwesomeIcon icon={faTimes} />
					</div>
				</div>
			)}
		</form>
	);
};
export default SwitFactory;
