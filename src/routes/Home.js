import Swit from "components/Swit";
import { dbService } from "fbase";
import React, { useEffect, useState } from "react";
import SwitFactory from "components/SwitFactory";

const Home = ({ userObj }) => {
	const [swits, setSwits] = useState([]);

	useEffect(() => {
		dbService.collection("swits").onSnapshot((snapshot) => {
			const switArray = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setSwits(switArray);
		});
	}, []);

	return (
		<div className="container">
			<SwitFactory userObj={userObj} />
			<div style={{ marginTop: 30 }}>
				{swits.map((swit) => (
					<Swit
						key={swit.id}
						switObj={swit}
						isOwner={swit.creatorId === userObj.uid}
					/>
				))}
			</div>
		</div>
	);
};
export default Home;
