import React from "react";
import { Button, Group, rem, Select, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { DatePickerInput } from "@mantine/dates";
import { IconCalendar } from "@tabler/icons-react";
import { fetchNui } from "../utils/fetchNui";

interface Props {
	handleCreate: () => void;
	id: number;
}

const CreateCharacterModal: React.FC<Props> = (props) => {
	const icon = (
		<IconCalendar style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
	);

	const form = useForm({
		initialValues: {
			firstName: "",
			lastName: "",
			nationality: "",
			gender: "",
			birthdate: new Date("2006-12-31"),
		},
	});

	const handleSubmit = async (values: {
		firstName: string;
		lastName: string;
		nationality: string;
		gender: string;
		birthdate: Date;
	}) => {
		const dateString = values.birthdate.toISOString().slice(0, 10);
		props.handleCreate();
		await fetchNui<string>(
			"createCharacter",
			{ cid: props.id, character: { ...values, birthdate: dateString } },
			{ data: "success" }
		);
	};

	return (
		<form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
			<Group grow>
				<TextInput
					data-autofocus
					required
					placeholder='Ditt Fornavn'
					label='Fornavn'
					{...form.getInputProps("firstName")}
				/>

				<TextInput
					required
					placeholder='Ditt Etternavn'
					label='Etternavn'
					{...form.getInputProps("lastName")}
				/>
			</Group>

			<TextInput
				required
				placeholder='Nasjonalitet'
				label='Velg Nasjonalitet'
				{...form.getInputProps("nationality")}
			/>

			<Select
				required
				label='Kjønn'
				placeholder='Velg Kjønn'
				data={["Male", "Female"]}
				defaultValue='Male'
				allowDeselect={false}
				{...form.getInputProps("gender")}
			/>

			<DatePickerInput
				leftSection={icon}
				leftSectionPointerEvents='none'
				label='Velg Fødselsdato'
				placeholder={"YYYY-MM-DD"}
				valueFormat='YYYY-MM-DD'
				defaultValue={new Date("2006-12-31")}
				minDate={new Date("1900-01-01")}
				maxDate={new Date("2006-12-31")}
				{...form.getInputProps("birthdate")}
			/>

			<Group justify='flex-end' mt='sm'>
				<Button color='teal' h={45} fullWidth variant='light' type='submit'>
					Create
				</Button>
			</Group>
		</form>
	);
};

export default CreateCharacterModal;
