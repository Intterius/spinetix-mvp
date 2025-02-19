import React, { useState, useEffect, useRef } from "react";
import {
	Typography,
	Box,
	TextField,
	Divider,
	Fade,
	Slide,
	Zoom,
	GlobalStyles,
	Slider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { ChromePicker } from "react-color";
import { FormControl, Select, MenuItem, InputLabel } from "@mui/material";
import QRCode from "react-qr-code";

import DragElement from "./draggable";

interface BusinessHours {
	days: string;
	hours: string;
}

interface StyleType {
	color: string;
	animation: string;
	fontFamily?: string;
	fontSize?: number;
}
interface QrStyleType {
	bgColor: string;
	fgColor: string;
}

const StyledTextField = styled(TextField)({
	"& .MuiInput-root": {
		color: "white",
		fontSize: "inherit",
		fontWeight: "inherit",
		"&:before, &:after": {
			borderBottom: "1px solid rgba(255, 255, 255, 0.5)",
		},
	},
	"& .MuiInput-input": {
		padding: "0px",
	},
});

const HoursScreen = () => {
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
	const [title, setTitle] = useState("HOURS");
	const [isEditingTitle, setIsEditingTitle] = useState(false);
	const [qrUrl, setQrUrl] = useState("https://www.google.com/");
	const [schedule, setSchedule] = useState<BusinessHours[]>([
		{ days: "MONDAY-FRIDAY", hours: "9AM - 5PM" },
		{ days: "SATURDAY", hours: "9AM - 2PM" },
		{ days: "SUNDAY", hours: "CLOSED" },
	]);

	const [editing, setEditing] = useState<{
		index: number;
		field: "days" | "hours" | "qr";
	} | null>(null);

	const [colorEditType, setColorEditType] = useState<
		"title" | "hours" | "days" | "divider" | "background" | "container" | null
	>(null);

	const [styles, setStyles] = useState<{
		title: StyleType;
		hours: StyleType[];
		days: StyleType[];
		qr: QrStyleType;
		divider: Omit<StyleType, "fontFamily" | "fontSize">;
	}>({
		title: {
			color: "#FFFFFF",
			animation: "none",
			fontFamily: "Arial",
			fontSize: 64,
		},
		hours: Array(3).fill({
			color: "#FFFFFF",
			animation: "none",
			fontFamily: "Arial",
			fontSize: 36,
		}),
		days: Array(3).fill({
			color: "#4fd1c5",
			animation: "none",
			fontFamily: "Arial",
			fontSize: 24,
		}),
		divider: { color: "#FFFFFF", animation: "none" },
		qr: { bgColor: "#FFFFFF", fgColor: "#4FD1C5" },
	});

	const handleChangeQrBgColor = (color: string) => {
		setStyles((prev) => ({
			...prev,
			qr: {
				...prev.qr,
				bgColor: color,
			},
		}));
	};

	const handleChangeQrFgColor = (color: string) => {
		setStyles((prev) => ({
			...prev,
			qr: {
				...prev.qr,
				fgColor: color,
			},
		}));
	};

	const [animationDuration, setAnimationDuration] = useState(1000);
	const [backgroundAnimationDuration, setBackgroundAnimationDuration] =
		useState(10000);

	const [backgroundAnimationType, setBackgroundAnimationType] =
		useState("kenBurnsZoomIn");

	const backgroundAnimations = {
		"@keyframes kenBurnsZoomIn": {
			"0%": {
				transform: "scale(1)",
			},
			"100%": {
				transform: "scale(1.3)",
			},
		},
		"@keyframes kenBurnsZoomOut": {
			"0%": {
				transform: "scale(1.3)",
			},
			"100%": {
				transform: "scale(1)",
			},
		},
		"@keyframes kenBurnsRight": {
			"0%": {
				transform: "scale(1.3) translate(-10%, 0)",
			},
			"100%": {
				transform: "scale(1.3) translate(10%, 0)",
			},
		},
		"@keyframes kenBurnsLeft": {
			"0%": {
				transform: "scale(1.3) translate(10%, 0)",
			},
			"100%": {
				transform: "scale(1.3) translate(-10%, 0)",
			},
		},
		"@keyframes kenBurnsUp": {
			"0%": {
				transform: "scale(1.3) translate(0, 10%)",
			},
			"100%": {
				transform: "scale(1.3) translate(0, -10%)",
			},
		},
		"@keyframes kenBurnsDown": {
			"0%": {
				transform: "scale(1.3) translate(0, -10%)",
			},
			"100%": {
				transform: "scale(1.3) translate(0, 10%)",
			},
		},
	};

	const [isEditMode, setIsEditMode] = useState(true);

	// Add a trigger state
	const [animationTrigger, setAnimationTrigger] = useState(false);

	// Add these states
	const [isRecording, setIsRecording] = useState(false);
	const contentRef = useRef<HTMLDivElement>(null);

	// Add new state for custom background image
	const [customBackgroundImage, setCustomBackgroundImage] = useState<
		string | null
	>(null);

	// Add state for file name
	const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

	// Add new state for content width
	const [contentWidth, setContentWidth] = useState(70); // 70 is the default percentage

	// Update the image upload handler
	const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setUploadedFileName(file.name);
			const reader = new FileReader();
			reader.onloadend = () => {
				setCustomBackgroundImage(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	// Modify the useEffect
	useEffect(() => {
		if (!isEditMode) {
			// Disable all editing states
			setIsEditingTitle(false);
			setEditing(null);
			setColorEditType(null);

			// Quick toggle to trigger animation
			setAnimationTrigger(false);
			setTimeout(() => setAnimationTrigger(true), 100);
		} else {
			setAnimationTrigger(false);
		}
	}, [isEditMode]);

	useEffect(() => {
		const updateDimensions = () => {
			const availableWidth = window.innerWidth - 300;
			const height = window.innerHeight;

			if (availableWidth / height > 16 / 9) {
				setDimensions({
					width: height * (16 / 9),
					height: height,
				});
			} else {
				setDimensions({
					width: availableWidth,
					height: availableWidth * (9 / 16),
				});
			}
		};

		updateDimensions();
		window.addEventListener("resize", updateDimensions);
		return () => window.removeEventListener("resize", updateDimensions);
	}, []);

	const handleEdit = (
		index: number,
		field: "days" | "hours",
		value: string
	) => {
		// Add character limit check
		if (value.length > 100) return;

		const newSchedule = [...schedule];
		newSchedule[index] = { ...newSchedule[index], [field]: value };
		setSchedule(newSchedule);
	};

	const scaleFactor = dimensions.width / 1920;
	const fontSizes = {
		title: `${64 * scaleFactor}px`,
		hours: `${36 * scaleFactor}px`,
		days: `${24 * scaleFactor}px`,
	};

	const handleStyleChange = (
		property: "color" | "animation" | "width" | "fontFamily" | "fontSize",
		value: string | number,
		index?: number
	) => {
		if (!colorEditType) return;

		if (colorEditType === "background") {
			if (property === "animation") {
				setBackgroundAnimationType(value as string);
			}
			return;
		}

		if (colorEditType === "container") {
			if (property === "width") {
				setContentWidth(value as number);
			}
			return;
		}

		setStyles((prev) => {
			if (Array.isArray(prev[colorEditType])) {
				const newArray = [...prev[colorEditType]];
				newArray[index!] = {
					...newArray[index!],
					[property]: value,
				};
				return {
					...prev,
					[colorEditType]: newArray,
				};
			}

			return {
				...prev,
				[colorEditType]: {
					...prev[colorEditType],
					[property]: value,
				},
			};
		});
	};

	const handleStartTitleEdit = () => {
		setEditing(null);
		setIsEditingTitle(true);
		setColorEditType("title");
	};

	const handleEndTitleEdit = (e?: React.KeyboardEvent<HTMLDivElement>) => {
		if (e && e.key !== "Enter") return;
		setIsEditingTitle(false);
	};

	const handleStartEdit = (index: number, field: "days" | "hours") => {
		setIsEditingTitle(false);
		setEditing({ index, field });
		setColorEditType(field);
	};

	const handleEndEdit = (e?: React.KeyboardEvent<HTMLDivElement>) => {
		if (e && e.key !== "Enter") return;
		setEditing(null);
	};

	const handleTextFocus = (type: "title" | "hours" | "days") => {
		setColorEditType(type);
	};

	const getAnimationComponent = (type: string): React.ElementType => {
		switch (type) {
			case "fade":
				return Fade;
			case "slide":
				return Slide;
			case "zoom":
				return Zoom;
			default:
				return Fade;
		}
	};

	const handleRecord = async () => {
		if (!contentRef.current || isRecording) return;

		try {
			setIsRecording(true);

			// Use the custom image if available
			const imageToUse = customBackgroundImage || "/images/zurich.jpg";
			const response = await fetch(imageToUse);
			const blob = await response.blob();
			const reader = new FileReader();
			const base64Image = await new Promise<string>((resolve) => {
				reader.onloadend = () => resolve(reader.result as string);
				reader.readAsDataURL(blob);
			});

			// Create SVG with embedded image
			const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 ${dimensions.width} ${dimensions.height}"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id="viewBox">
              <rect width="${dimensions.width}" height="${dimensions.height}" />
            </clipPath>
          </defs>

          <style>
            :root { background: black; overflow: hidden; }
            svg { background: black; overflow: hidden; }
            .content { font-family: Arial, sans-serif; }
            
            @keyframes fade {
              0% { opacity: 0; }
              100% { opacity: 1; }
            }

            @keyframes slide {
              0% { transform: translateX(-100px); opacity: 0; }
              100% { transform: translateX(0); opacity: 1; }
            }

            @keyframes zoom {
              0% { transform: scale(0); opacity: 0; }
              100% { transform: scale(1); opacity: 1; }
            }

            .title { 
              font-size: ${fontSizes.title}; 
              font-weight: bold; 
              fill: ${styles.title.color};
              animation: ${
								styles.title.animation
							} ${animationDuration}ms ease-in-out forwards;
              font-family: ${styles.title.fontFamily};
            }

            ${schedule
							.map(
								(_, i) => `
              .hours-${i} { 
                font-size: ${fontSizes.hours}; 
                font-weight: 500;
                fill: ${styles.hours[i].color};
                animation: ${styles.hours[i].animation} ${animationDuration}ms ease-in-out forwards;
                font-family: ${styles.hours[i].fontFamily};
              }
              .days-${i} { 
                font-size: ${fontSizes.days};
                fill: ${styles.days[i].color};
                animation: ${styles.days[i].animation} ${animationDuration}ms ease-in-out forwards;
                font-family: ${styles.days[i].fontFamily};
              }
            `
							)
							.join("\n")}

            .divider { 
              stroke: ${styles.divider.color}; 
              stroke-width: 2;
            }

            ${Object.entries(backgroundAnimations)
							.map(([key, value]) => {
								const keyframeStyles = Object.entries(value)
									.map(([percent, style]) => {
										const styleString = Object.entries(style)
											.map(([prop, val]) => `${prop}: ${val};`)
											.join(" ");
										return `${percent} { ${styleString} }`;
									})
									.join("\n");
								return `${key} { ${keyframeStyles} }`;
							})
							.join("\n")}

            .background {
              animation: ${backgroundAnimationType} ${backgroundAnimationDuration}ms infinite ease-in-out;
              transform-origin: center;
            }
          </style>

          <g clip-path="url(#viewBox)">
            <image
              class="background"
              href="${base64Image}"
              width="100%"
              height="100%"
              preserveAspectRatio="xMidYMid slice"
            />
            <g class="content">
              <rect 
                x="${dimensions.width * 0.3}" 
                y="0" 
                width="${dimensions.width * 0.7}" 
                height="100%" 
                fill="rgba(0,0,0,0.6)" 
              />
              <g transform="translate(${dimensions.width * 0.3 + 60}, ${
				dimensions.height * 0.55
			})">
                <text class="title" x="0" y="0">${title}</text>
                <line class="divider" x1="0" y1="30" x2="${
									dimensions.width * 0.65
								}" y2="30" />
                ${schedule
									.map(
										(item, i) => `
                  <text class="hours hours-${i}" x="0" y="${100 + i * 80}">${
											item.hours
										}</text>
                  <text class="days days-${i}" x="0" y="${130 + i * 80}">${
											item.days
										}</text>
                `
									)
									.join("")}
              </g>
            </g>
          </g>
        </svg>`;

			// Create Blob and download
			const svgBlob = new Blob([svgContent], {
				type: "image/svg+xml;charset=utf-8",
			});
			const url = URL.createObjectURL(svgBlob);
			const a = document.createElement("a");
			a.href = url;
			a.download = "hours-animation.svg";
			a.click();
			URL.revokeObjectURL(url);
			setIsRecording(false);
		} catch (error) {
			console.error("Recording failed:", error);
			setIsRecording(false);
		}
	};

	// Update title change handling
	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (value.length > 100) return;
		setTitle(value);
	};

	return (
		<Box>
			<GlobalStyles
				styles={{
					...backgroundAnimations,
				}}
			/>
			<Box
				sx={{
					width: "100vw",
					height: "100vh",
					display: "flex",
					bgcolor: "black",
					overflow: "hidden",
				}}
			>
				{/* Main Content */}
				{qrUrl && (
					<DragElement>
						<Box>
							<QRCode
								size={256}
								fgColor={styles.qr.fgColor}
								bgColor={styles.qr.bgColor}
								style={{
									height: "auto",
									left: 15,
									position: "absolute",
									top: "50%", // Change from 0 to 50%
									transform: "translateY(-50%)", // Add this line
									zIndex: 1000,
								}}
								value={"https://google.com"}
								viewBox={`0 0 256 256`}
							/>
						</Box>
					</DragElement>
				)}
				<Box
					sx={{
						flex: 1,
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						maxWidth: "calc(100vw - 300px)",
						overflow: "hidden",
						paddingBottom: "100px",
					}}
				>
					<Box
						ref={contentRef}
						sx={{
							width: dimensions.width,
							height: dimensions.height,
							position: "relative",
							overflow: "hidden",
						}}
					>
						{/* Background Image */}
						<Box
							component="img"
							src={customBackgroundImage || "/images/zurich.jpg"}
							alt="Background"
							onClick={() => setColorEditType("background")}
							sx={{
								width: "100%",
								height: "100%",
								objectFit: "cover",
								position: "absolute",
								animation:
									!isEditMode && backgroundAnimationType !== "none"
										? `${backgroundAnimationType} ${backgroundAnimationDuration}ms infinite ease-in-out`
										: "none",
								cursor: isEditMode ? "pointer" : "default",
								"&:hover": isEditMode
									? {
											outline: "2px solid rgba(255, 255, 255, 0.5)",
											outlineOffset: "-2px",
									  }
									: {},
							}}
						/>
						// Replace the current Draggable component with:
						{/* Content Container with blur */}
						<Box
							className="content-container"
							sx={{
								position: "absolute",
								top: 0,
								right: 0,
								width: `${contentWidth}%`,
								height: "100%",
								background: "rgba(0, 0, 0, 0.6)",
								backdropFilter: "blur(10px)",
								display: "flex",
								alignItems: "flex-end",
								cursor: isEditMode ? "pointer" : "default",
								transition: "width 0.3s ease",
								"&:hover": isEditMode
									? {
											outline: "2px solid rgba(255, 255, 255, 0.5)",
											outlineOffset: "-2px",
									  }
									: {},
							}}
							onClick={() => setColorEditType("container")}
						>
							{/* Hours Content */}
							<Box
								sx={{
									padding: `${60 * scaleFactor}px`,
									width: "100%",
									height: "100%",
								}}
							>
								<DragElement x={0} y={-100}>
									{isEditingTitle
										? (() => {
												const Component = getAnimationComponent(
													styles.title.animation
												);
												return (
													<Component in timeout={animationDuration}>
														<StyledTextField
															variant="standard"
															value={title}
															onChange={handleTitleChange}
															onKeyDown={(e) =>
																e.key === "Enter" && handleEndTitleEdit(e)
															}
															autoFocus
															fullWidth
															inputProps={{
																style: {
																	fontFamily: styles.title.fontFamily,
																	fontSize: `${
																		styles.title.fontSize! * scaleFactor
																	}px`,
																},
																maxLength: 100,
															}}
															sx={{
																fontSize: fontSizes.title,
																fontWeight: "bold",
																mb: 4,
																"& .MuiInput-root": {
																	color: styles.title.color,
																},
															}}
														/>
													</Component>
												);
										  })()
										: (() => {
												const Component = getAnimationComponent(
													styles.title.animation
												);
												return (
													<Component
														in={isEditMode || (animationTrigger && !isEditMode)}
														timeout={animationDuration}
														appear={true}
													>
														<Typography
															variant="h1"
															onClick={(e) => {
																e.stopPropagation();
																if (isEditMode) {
																	handleStartTitleEdit();
																	handleTextFocus("title");
																}
															}}
															sx={{
																color: styles.title.color,
																fontSize: fontSizes.title,
																fontWeight: "bold",
																mb: 4,
																cursor: isEditMode ? "pointer" : "default",
																"&:hover": isEditMode
																	? {
																			outline:
																				"1px solid rgba(255, 255, 255, 0.5)",
																			outlineOffset: "4px",
																			borderRadius: "4px",
																	  }
																	: {},
																fontFamily: styles.title.fontFamily,
															}}
														>
															{title}
														</Typography>
													</Component>
												);
										  })()}
								</DragElement>
								<DragElement>
									<Divider
										onClick={(e) => {
											e.stopPropagation();
											setColorEditType("divider");
										}}
										sx={{
											borderColor: styles.divider.color,
											mb: 4,
											width: "500px",
											cursor: isEditMode ? "pointer" : "default",
											"&:hover": isEditMode
												? {
														outline: "1px solid rgba(255, 255, 255, 0.5)",
														outlineOffset: "4px",
												  }
												: {},
											borderWidth: "2px",
											borderStyle: "solid",
										}}
									/>
								</DragElement>

								{schedule.map((item, index) => {
									const yIndexMap = {
										0: 50,
										1: 125,
										2: 200,
									};
									return (
										<DragElement x={0} y={yIndexMap[index]}>
											<Box key={index} sx={{ mb: 3 }}>
												{editing?.index === index && editing?.field === "hours"
													? (() => {
															const Component = getAnimationComponent(
																styles.hours[index].animation
															);
															return (
																<Component in timeout={animationDuration}>
																	<StyledTextField
																		variant="standard"
																		value={item.hours}
																		onChange={(e) =>
																			handleEdit(index, "hours", e.target.value)
																		}
																		onKeyDown={(e) =>
																			e.key === "Enter" && handleEndEdit(e)
																		}
																		autoFocus
																		fullWidth
																		sx={{
																			fontSize: fontSizes.hours,
																			fontWeight: 500,
																			"& .MuiInput-root": {
																				color: styles.hours[index].color,
																			},
																		}}
																		inputProps={{
																			style: {
																				fontFamily:
																					styles.hours[index].fontFamily,
																				fontSize: `${
																					styles.hours[index].fontSize! *
																					scaleFactor
																				}px`,
																			},
																			maxLength: 100,
																		}}
																	/>
																</Component>
															);
													  })()
													: (() => {
															const Component = getAnimationComponent(
																styles.hours[index].animation
															);
															return (
																<Component
																	in={
																		isEditMode ||
																		(animationTrigger && !isEditMode)
																	}
																	timeout={animationDuration}
																	appear={true}
																>
																	<Typography
																		onClick={(e) => {
																			e.stopPropagation();
																			if (isEditMode) {
																				handleStartEdit(index, "hours");
																				handleTextFocus("hours");
																			}
																		}}
																		sx={{
																			color: styles.hours[index].color,
																			fontSize: fontSizes.hours,
																			fontWeight: 500,
																			cursor: isEditMode
																				? "pointer"
																				: "default",
																			"&:hover": isEditMode
																				? {
																						outline:
																							"1px solid rgba(255, 255, 255, 0.5)",
																						outlineOffset: "4px",
																						borderRadius: "4px",
																				  }
																				: {},
																			fontFamily:
																				styles.hours[index].fontFamily,
																		}}
																	>
																		{item.hours}
																	</Typography>
																</Component>
															);
													  })()}

												{editing?.index === index && editing?.field === "days"
													? (() => {
															const Component = getAnimationComponent(
																styles.days[index].animation
															);
															return (
																<Component in timeout={animationDuration}>
																	<StyledTextField
																		variant="standard"
																		value={item.days}
																		onChange={(e) =>
																			handleEdit(index, "days", e.target.value)
																		}
																		onKeyDown={(e) =>
																			e.key === "Enter" && handleEndEdit(e)
																		}
																		autoFocus
																		fullWidth
																		inputProps={{
																			style: {
																				fontFamily:
																					styles.hours[index].fontFamily,
																				fontSize: `${
																					styles.days[index].fontSize! *
																					scaleFactor
																				}px`,
																			},
																			maxLength: 100,
																		}}
																		sx={{
																			fontSize: fontSizes.days,
																			"& .MuiInput-root": {
																				color: styles.days[index].color,
																			},
																		}}
																	/>
																</Component>
															);
													  })()
													: (() => {
															const Component = getAnimationComponent(
																styles.days[index].animation
															);
															return (
																<Component
																	in={
																		isEditMode ||
																		(animationTrigger && !isEditMode)
																	}
																	timeout={animationDuration}
																	appear={true}
																>
																	<Typography
																		onClick={(e) => {
																			e.stopPropagation();
																			if (isEditMode) {
																				handleStartEdit(index, "days");
																				handleTextFocus("days");
																			}
																		}}
																		sx={{
																			color: styles.days[index].color,
																			fontSize: fontSizes.days,
																			cursor: isEditMode
																				? "pointer"
																				: "default",
																			"&:hover": isEditMode
																				? {
																						outline:
																							"1px solid rgba(255, 255, 255, 0.5)",
																						outlineOffset: "4px",
																						borderRadius: "4px",
																				  }
																				: {},
																			fontFamily: styles.days[index].fontFamily,
																		}}
																	>
																		{item.days}
																	</Typography>
																</Component>
															);
													  })()}
											</Box>
										</DragElement>
									);
								})}
							</Box>
						</Box>
					</Box>
				</Box>

				{/* Color and Animation Panel */}
				<Box
					sx={{
						width: "300px",
						bgcolor: "rgba(255, 255, 255, 0.1)",
						borderLeft: "1px solid rgba(255, 255, 255, 0.2)",
						p: 3,
						overflow: "scroll",
					}}
				>
					<Box
						sx={{
							display: "flex",
							gap: 1,
							mb: 3,
							borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
							pb: 2,
						}}
					>
						{/* Edit button */}
						<Box
							onClick={() => setIsEditMode(true)}
							sx={{
								width: 40,
								height: 40,
								borderRadius: "50%",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								cursor: "pointer",
								bgcolor: isEditMode
									? "rgba(255, 255, 255, 0.2)"
									: "transparent",
								border: "2px solid rgba(255, 255, 255, 0.5)",
								"&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
							}}
						>
							<Box
								component="span"
								sx={{
									width: 20,
									height: 20,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									color: "white",
								}}
							>
								✏️
							</Box>
						</Box>
						{/* Play button */}
						<Box
							onClick={() => {
								setIsEditMode(false);
								setAnimationTrigger(false);
								setTimeout(() => {
									setAnimationTrigger(true);
								}, animationDuration);
							}}
							sx={{
								width: 40,
								height: 40,
								borderRadius: "50%",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								cursor: "pointer",
								bgcolor: !isEditMode
									? "rgba(255, 255, 255, 0.2)"
									: "transparent",
								border: "2px solid rgba(255, 255, 255, 0.5)",
								"&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
							}}
						>
							<Box
								component="span"
								sx={{
									width: 20,
									height: 20,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									color: "white",
								}}
							>
								▶️
							</Box>
						</Box>
						{/* Download button */}
						<Box
							onClick={handleRecord}
							sx={{
								width: 40,
								height: 40,
								borderRadius: "50%",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								cursor: isRecording ? "not-allowed" : "pointer",
								bgcolor: isRecording ? "rgba(255, 0, 0, 0.2)" : "transparent",
								border: "2px solid rgba(255, 255, 255, 0.5)",
								"&:hover": {
									bgcolor: !isRecording
										? "rgba(255, 255, 255, 0.1)"
										: undefined,
								},
							}}
						>
							<Box
								component="span"
								sx={{
									width: 20,
									height: 20,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									color: "white",
								}}
							>
								{isRecording ? "⏺️" : "📥"}
							</Box>
						</Box>
					</Box>

					{isEditMode && (
						<>
							<Typography
								sx={{
									color: "white",
									mb: 2,
									fontSize: "1.2rem",
									pb: 1,
								}}
							>
								Style Settings
							</Typography>

							{colorEditType === "background" ? (
								<>
									<Typography sx={{ color: "white", mb: 2 }}>
										Background Settings
									</Typography>

									{/* Add selected image name */}
									<Typography
										sx={{
											color: "rgba(255, 255, 255, 0.7)",
											mb: 2,
											fontSize: "0.9rem",
											fontStyle: "italic",
										}}
									>
										Current image:{" "}
										{customBackgroundImage ? uploadedFileName : "zurich.jpg"}
									</Typography>

									{/* Add image upload button */}
									<Box sx={{ mb: 2 }}>
										<input
											accept="image/*"
											style={{ display: "none" }}
											id="background-image-upload"
											type="file"
											onChange={handleImageUpload}
										/>
										<label htmlFor="background-image-upload">
											<Box
												sx={{
													p: 2,
													border: "2px dashed rgba(255, 255, 255, 0.5)",
													borderRadius: 1,
													cursor: "pointer",
													textAlign: "center",
													color: "white",
													"&:hover": {
														bgcolor: "rgba(255, 255, 255, 0.1)",
													},
												}}
											>
												{customBackgroundImage
													? "Change Image"
													: "Upload Custom Image"}
											</Box>
										</label>
									</Box>

									{/* Rest of the background settings */}
									<FormControl fullWidth sx={{ mb: 2 }}>
										<InputLabel sx={{ color: "white" }}>
											Animation Type
										</InputLabel>
										<Select
											value={backgroundAnimationType}
											onChange={(e) =>
												setBackgroundAnimationType(e.target.value)
											}
											sx={{ color: "white" }}
										>
											<MenuItem value="none">None</MenuItem>
											<MenuItem value="kenBurnsZoomIn">Zoom In</MenuItem>
											<MenuItem value="kenBurnsZoomOut">Zoom Out</MenuItem>
											<MenuItem value="kenBurnsRight">Pan Right</MenuItem>
											<MenuItem value="kenBurnsLeft">Pan Left</MenuItem>
											<MenuItem value="kenBurnsUp">Pan Up</MenuItem>
											<MenuItem value="kenBurnsDown">Pan Down</MenuItem>
										</Select>
									</FormControl>
									<FormControl fullWidth sx={{ mb: 2 }}>
										<InputLabel sx={{ color: "white" }}>
											Duration (seconds)
										</InputLabel>
										<Select
											value={backgroundAnimationDuration}
											onChange={(e) =>
												setBackgroundAnimationDuration(Number(e.target.value))
											}
											sx={{ color: "white" }}
										>
											<MenuItem value={5000}>5s</MenuItem>
											<MenuItem value={10000}>10s</MenuItem>
											<MenuItem value={15000}>15s</MenuItem>
											<MenuItem value={20000}>20s</MenuItem>
											<MenuItem value={30000}>30s</MenuItem>
										</Select>
									</FormControl>
									<FormControl fullWidth sx={{ mb: 2 }}>
										<TextField
											fullWidth
											label="QR URL"
											disabled={false}
											value={qrUrl} // Add this state
											onChange={(e) => setQrUrl(e.target.value)} // Add this handler
											sx={{
												mb: 2,
												"& .MuiInputLabel-root": {
													color: "white",
												},
												"& .MuiInputBase-input": {
													color: "white",
												},
												"& .MuiOutlinedInput-root": {
													"& fieldset": {
														borderColor: "rgba(255, 255, 255, 0.23)",
													},
													"&:hover fieldset": {
														borderColor: "rgba(255, 255, 255, 0.5)",
													},
												},
											}}
										/>
									</FormControl>
									<Box
										style={{ display: "flex", flexDirection: "column", gap: 8 }}
									>
										<Box
											style={{
												display: "flex",
												gap: 8,
												flexDirection: "column",
											}}
										>
											<Typography>Qr Background Color</Typography>
											<ChromePicker
												color={styles.qr.bgColor}
												onChange={(color) => handleChangeQrBgColor(color.hex)}
												styles={{
													default: {
														picker: {
															width: "100%",
															backgroundColor: "transparent",
														},
													},
												}}
											/>
										</Box>
										<Box
											style={{
												display: "flex",
												gap: 8,
												flexDirection: "column",
											}}
										>
											<Typography>Qr Foreground Color</Typography>
											<ChromePicker
												color={styles.qr.fgColor}
												onChange={(color) => handleChangeQrFgColor(color.hex)}
												styles={{
													default: {
														picker: {
															width: "100%",
															backgroundColor: "transparent",
														},
													},
												}}
											/>
										</Box>
									</Box>
								</>
							) : colorEditType === "container" ? (
								<>
									<Typography sx={{ color: "white", mb: 2 }}>
										Container Settings
									</Typography>
									<Box sx={{ mb: 3 }}>
										<Typography sx={{ color: "white", mb: 1 }}>
											Width (%)
										</Typography>
										<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
											<Slider
												value={contentWidth}
												onChange={(_, value) =>
													handleStyleChange("width", value as number)
												}
												min={30}
												max={100}
												valueLabelDisplay="auto"
												sx={{
													color: "white",
													"& .MuiSlider-thumb": {
														"&:hover, &.Mui-focusVisible": {
															boxShadow: "0 0 0 8px rgba(255, 255, 255, 0.16)",
														},
													},
													"& .MuiSlider-rail": {
														opacity: 0.28,
													},
												}}
											/>
											<Typography sx={{ color: "white", minWidth: "40px" }}>
												{contentWidth}%
											</Typography>
										</Box>
									</Box>
								</>
							) : colorEditType ? (
								<>
									<Typography sx={{ color: "white", mb: 1 }}>
										{colorEditType === "divider"
											? "Divider Style"
											: `${
													colorEditType.charAt(0).toUpperCase() +
													colorEditType.slice(1)
											  } Style`}
									</Typography>
									<ChromePicker
										color={
											Array.isArray(styles[colorEditType])
												? styles[colorEditType][editing?.index ?? 0].color
												: styles[colorEditType].color
										}
										onChange={(color) =>
											handleStyleChange("color", color.hex, editing?.index)
										}
										styles={{
											default: {
												picker: {
													width: "100%",
													backgroundColor: "transparent",
												},
											},
										}}
									/>

									<Box sx={{ mt: 2 }}>
										<FormControl fullWidth sx={{ mb: 2 }}>
											<InputLabel sx={{ color: "white" }}>
												Animation Type
											</InputLabel>
											<Select
												value={
													Array.isArray(styles[colorEditType])
														? styles[colorEditType][editing?.index ?? 0]
																.animation
														: styles[colorEditType].animation
												}
												onChange={(e) =>
													handleStyleChange(
														"animation",
														e.target.value,
														editing?.index
													)
												}
												sx={{ color: "white" }}
											>
												<MenuItem value="none">None</MenuItem>
												<MenuItem value="fade">Fade</MenuItem>
												<MenuItem value="slide">Slide</MenuItem>
												<MenuItem value="zoom">Zoom</MenuItem>
											</Select>
										</FormControl>

										<FormControl fullWidth>
											<InputLabel sx={{ color: "white" }}>
												Duration (ms)
											</InputLabel>
											<Select
												value={animationDuration}
												onChange={(e) =>
													setAnimationDuration(Number(e.target.value))
												}
												sx={{ color: "white" }}
											>
												<MenuItem value={500}>500ms</MenuItem>
												<MenuItem value={1000}>1000ms</MenuItem>
												<MenuItem value={1500}>1500ms</MenuItem>
												<MenuItem value={2000}>2000ms</MenuItem>
											</Select>
										</FormControl>
									</Box>

									{colorEditType &&
										["title", "hours", "days"].includes(colorEditType) && (
											<>
												<FormControl fullWidth sx={{ mt: 2 }}>
													<Typography sx={{ color: "white", mb: 1 }}>
														Font Size
													</Typography>
													<Slider
														value={Number(
															Array.isArray(styles[colorEditType]) &&
																colorEditType !== "divider"
																? styles[colorEditType][editing?.index ?? 0]
																		.fontSize ?? 64
																: (styles[colorEditType] as StyleType)
																		.fontSize ?? 64
														)}
														onChange={(_, value) =>
															handleStyleChange(
																"fontSize",
																Number(value),
																editing?.index
															)
														}
														min={6}
														max={64}
														valueLabelDisplay="auto"
														sx={{
															color: "white",
															"& .MuiSlider-thumb": {
																"&:hover, &.Mui-focusVisible": {
																	boxShadow:
																		"0 0 0 8px rgba(255, 255, 255, 0.16)",
																},
															},
															"& .MuiSlider-rail": {
																opacity: 0.28,
															},
														}}
													/>
												</FormControl>
												<FormControl fullWidth sx={{ mt: 2 }}>
													<InputLabel sx={{ color: "white" }}>
														Font Family
													</InputLabel>
													<Select
														value={
															colorEditType !== "divider" &&
															(Array.isArray(styles[colorEditType])
																? styles[colorEditType][editing?.index ?? 0]
																		.fontFamily
																: styles[colorEditType].fontFamily)
														}
														onChange={(e) =>
															handleStyleChange(
																"fontFamily",
																e.target.value,
																editing?.index
															)
														}
														sx={{ color: "white" }}
													>
														<MenuItem value="Arial">Arial</MenuItem>
														<MenuItem value="Helvetica">Helvetica</MenuItem>
														<MenuItem value="Times New Roman">
															Times New Roman
														</MenuItem>
														<MenuItem value="Courier New">Courier New</MenuItem>
														<MenuItem value="Verdana">Verdana</MenuItem>
													</Select>
												</FormControl>
											</>
										)}
								</>
							) : (
								<Typography sx={{ color: "white", opacity: 0.7 }}>
									Click any element to edit its style
								</Typography>
							)}
						</>
					)}
				</Box>
			</Box>
		</Box>
	);
};

export default HoursScreen;
