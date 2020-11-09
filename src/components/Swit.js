import { dbService, storageService } from "fbase";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Swit = ({ switObj, isOwner }) => {
	const [editing, setEditing] = useState(false);
	const [newSwit, setNewSwit] = useState(switObj.text);

	const onDeleteClick = async () => {
		const ok = window.confirm("Are you sure you want to delete this swit?");
		console.log(ok);
		if (ok) {
			await dbService.doc(`swits/${switObj.id}`).delete();
			await storageService.refFromURL(switObj.attachmentUrl).delete();
		}
	};

	const toggleEditing = () => setEditing((prev) => !prev);
	const onSubmit = async (event) => {
		event.preventDefault();
		await dbService.doc(`swits/${switObj.id}`).update({
			text: newSwit,
		});
		setEditing(false);
	};
	const onChange = (event) => {
		const {
			target: { value },
		} = event;
		setNewSwit(value);
	};
	return (
		<div className="swit">
			{editing ? (
				<>
					<form onSubmit={onSubmit} className="container switEdit">
						<input
							onChange={onChange}
							type="text"
							placeholder="Edit your swit"
							value={newSwit}
							autoFocus
							required
							className="formInput"
						/>
						<input type="submit" value="Update Swit" className="formBtn" />
					</form>
					<span onClick={toggleEditing} className="formBtn cancelBtn">
						Cancel
					</span>
				</>
			) : (
				<>
					<h4>{switObj.text}</h4>
					{switObj.attachmentUrl && (
						<img src={switObj.attachmentUrl} alt="swit img" />
					)}
					{isOwner && (
						<div className="swit__actions">
							<span onClick={onDeleteClick}>
								<FontAwesomeIcon icon={faTrash} />
							</span>
							<span onClick={toggleEditing}>
								<FontAwesomeIcon icon={faPencilAlt} />
							</span>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default Swit;
