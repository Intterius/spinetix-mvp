import { Box } from "@mui/material";
import Draggable from "react-draggable";

const DragElement = ({ children, x, y }) => {
	return (
		<Draggable
			handle=".handle"
			axis="both"
			defaultPosition={{ x: x || 0, y: y || 0 }}
			bounds="parent"
			grid={[25, 25]}
			scale={1}
		>
			<Box
				sx={{
					position: "absolute",
					top: "50%",
					transform: "translateY(-50%)",
					zIndex: 1000,
					cursor: "grab",
					"&:active": {
						cursor: "grabbing",
					},
				}}
			>
				<Box
					className="handle"
					sx={{
						cursor: "grab",
						"&:active": {
							cursor: "grabbing",
						},
					}}
				>
					{children}
				</Box>
			</Box>
		</Draggable>
	);
};

export default DragElement;
