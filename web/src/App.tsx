import { useState } from "react";
import "./App.css";
import { isEnvBrowser } from "./utils/misc";
import {
	Badge,
	Group,
	Transition,
	Text,
	Button,
	Divider,
	SimpleGrid,
	Title,
	Modal,
	ScrollArea,
	UnstyledButton,
	ActionIcon, // Import ActionIcon
} from "@mantine/core";
import { useNuiEvent } from "./hooks/useNuiEvent";
import {
	IconPlayerPlay,
	IconPlus, // Use IconPlus for Create Button
	IconTrash,
	IconUsersGroup,
} from "@tabler/icons-react";
import InfoCard from "./components/InfoCard";
import { fetchNui } from "./utils/fetchNui";
import { useDisclosure } from "@mantine/hooks";
import CreateCharacterModal from "./components/CreateCharacterModal";
import { modals } from "@mantine/modals";

type CharacterMetadata = Array<{ key: string; value: string }>;

interface Character {
	citizenid: string;
	name: string;
	metadata: CharacterMetadata;
	cid: number;
}

const DEBUG_CHARACTERS: Character[] = [
	{
		citizenid: "Whatever12",
		name: "Jenna Doe",
		metadata: [
			{
				key: "job",
				value: "Police",
			},
			{
				key: "nationality",
				value: "Denmark",
			},
			{
				key: "bank",
				value: "100.0000",
			},
			{
				key: "cash",
				value: "430.000",
			},
			{
				key: "birthdate",
				value: "12-10-1899",
			},
			{
				key: "gender",
				value: "Male",
			},
		],
		cid: 2,
	},
	{
		citizenid: "Hallo",
		name: "Jake long",
		metadata: [
			{
				key: "job",
				value: "Police",
			},
			{
				key: "nationality",
				value: "Denmark",
			},
			{
				key: "bank",
				value: "100.0000",
			},
			{
				key: "cash",
				value: "430.000",
			},
			{
				key: "birthdate",
				value: "12-10-1899",
			},
			{
				key: "gender",
				value: "Male",
			},
		],
		cid: 3,
	},
];

function App() {
	const [visible, setVisible] = useState(isEnvBrowser() ? true : false);
	const [characters, setCharacters] = useState<Character[]>(
		isEnvBrowser() ? DEBUG_CHARACTERS : []
	);
	const [isSelected, setIsSelected] = useState(-1);
	const [createCharacterId, setCreateCharacterId] = useState(-1);
	const [opened, { open, close }] = useDisclosure(false);
	const [allowedCharacters, setAllowedCharacters] = useState(
		isEnvBrowser() ? 3 : 0
	);

	useNuiEvent<{ characters: Character[]; allowedCharacters: number }>(
		"showMultiChar",
		(data) => {
			setCharacters(data.characters);
			setAllowedCharacters(data.allowedCharacters);
			setVisible(true);
		}
	);

	const HandleSelect = async (key: number, citizenid: string) => {
		await fetchNui<number>(
			"selectCharacter",
			{ citizenid: citizenid },
			{ data: 1 }
		);
		setIsSelected(key);
	};

	const HandlePlay = async (citizenid: string) => {
		setVisible(false);
		setCharacters([]);
		setIsSelected(-1);
		await fetchNui<number>(
			"playCharacter",
			{ citizenid: citizenid },
			{ data: 1 }
		);
	};

	const HandleDelete = async (citizenid: string) => {
		setVisible(false);
		setCharacters([]);
		setIsSelected(-1);
		await fetchNui<number>(
			"deleteCharacter",
			{ citizenid: citizenid },
			{ data: 1 }
		);
	};

	const HandleCreate = () => {
		close();
		setVisible(false);
		setCharacters([]);
		setIsSelected(-1);
	};

	const openDeleteModal = (citizenid: string) =>
		modals.openConfirmModal({
			title: "Delete your character",
			centered: true,
			children: (
				<Text size='sm'>Are you sure you want to delete your character?</Text>
			),
			labels: { confirm: "Delete character", cancel: "Cancel" },
			confirmProps: { color: "red"},
			onCancel: () => console.log("Cancel"),
			onConfirm: () => HandleDelete(citizenid),
		});

	return (
		<>
			<Modal
				opened={opened}
				onClose={close}
				title={"Create Character " + (createCharacterId + 1)}
				centered
			>
				<CreateCharacterModal
					id={createCharacterId + 1}
					handleCreate={HandleCreate}
				/>
			</Modal>

			<div className={`app-container`}>
				<div className='container'>
					{visible && (
						<div className='character-selector-top'>
							<Title order={1} fz={32} c={"white"}>
								ELEMENT ROLLESPILL
							</Title>
							<Text fw={500} fz={15} c={"white"}>
								VELG KARAKTER
							</Text>
						</div>
					)}

					<Transition transition='slide-up' mounted={visible}>
						{(style) => (
							<ScrollArea style={{ ...style }} w={1650}>
								<div className='multichar'>
									{[...Array(allowedCharacters)].map((_, index) => {
										const character = characters[index];
										return character ? (
											<UnstyledButton
												key={character.citizenid}
												onClick={() => HandleSelect(character.cid, character.citizenid)}
											>
												<div className='character-card'>
													<Group justify='space-between'>
														<Text fw={500}>{character.name}</Text>
														<Badge
															color='gray'
															variant='light'
															radius='xs'
														>
															{character.citizenid}
														</Badge>
													</Group>

													<div
														className={
															isSelected === character.cid ? "show" : "hide"
														}
													>
														<SimpleGrid cols={2} spacing={3}>
															{character.metadata &&
																character.metadata.length > 0 &&
																character.metadata.map((metadata) => (
																	<InfoCard
																		key={metadata.key}
																		icon={metadata.key}
																		label={metadata.value}
																	/>
																))}
														</SimpleGrid>

														<div className='character-card-actions'>
															<Button
																color='teal'
																variant='light'
																fullWidth
																radius="xs"
																leftSection={<IconPlayerPlay size={14} />}
																h={45}
																onClick={() => {
																	HandlePlay(character.citizenid);
																}}
															>
																Play
															</Button>

															<Button
																color='red'
																variant='light'
																radius="xs"
																fullWidth
																leftSection={<IconTrash size={14} />}
																h={45}
																onClick={() => {
																	openDeleteModal(character.citizenid);
																}}
															>
																Delete
															</Button>
														</div>
													</div>
												</div>
											</UnstyledButton>
										) : null;
									})}
								</div>
							</ScrollArea>
						)}
					</Transition>

					{/* Action Icon for Create Character */}
					{visible && (
					<ActionIcon
						variant="filled"
						color="dark"
						onClick={open}
						style={{
							position: "absolute",
							top: "10px",
							right: "10px",
						}}
						size={50}
					>
						<IconPlus size={30} />
					</ActionIcon>
					)}
				</div>
			</div>
		</>
	);
}

export default App;
