import { View, Text, StyleSheet } from 'react-native';
import Input from './Input';
import Button from '../UI/Button';
import { useState } from 'react';

const ExpenseForm = ({ buttonLabel, onSubmit, onCancel, defaultValues }) => {
	const [formValues, setFormValues] = useState({
		amount: defaultValues?.amount?.toString() ?? '',
		date: defaultValues?.date?.toISOString()?.slice(0, 10) ?? '',
		description: defaultValues?.description ?? '',
	});

	const onChangeHandler = (inputLabel, inputValue) => {
		setFormValues((prevState) => ({
			...prevState,
			[inputLabel]: inputValue,
		}));
	};

	const onSubmitHandler = () => {
		const expenseData = {
			description: formValues.description,
			amount: +formValues.amount,
			date: new Date(formValues.date),
		};

		const amountIsValid = !isNaN(expenseData.amount) && expenseData.amount > 0;
		const dateIsValid = expenseData.date.toString() !== 'Invalid Date';
		const descriptionIsValid = expenseData.description.trim().length > 0;

		if (!amountIsValid || !dateIsValid || !descriptionIsValid) {
			return;
		}
		onSubmit(expenseData);
	};

	return (
		<View style={styles.form}>
			<Text style={styles.title}>Your Expense</Text>
			<View style={styles.rowContainer}>
				<Input
					label="Amount"
					textInputConfig={{
						keyboardType: 'decimal-pad',
						onChangeText: onChangeHandler.bind(this, 'amount'),
						value: formValues.amount,
					}}
					style={styles.rowInput}
				/>
				<Input
					label="Date"
					textInputConfig={{
						placeholder: 'YYYY-MM-DD',
						maxLength: 10,
						onChangeText: onChangeHandler.bind(this, 'date'),
						value: formValues.date,
					}}
					style={styles.rowInput}
				/>
			</View>
			<Input
				label="Description"
				textInputConfig={{
					multiline: true,
					onChangeText: onChangeHandler.bind(this, 'description'),
					value: formValues.description,
				}}
			/>
			<View style={styles.buttons}>
				<Button mode="flat" onPress={onCancel} style={styles.button}>
					Cancel
				</Button>
				<Button onPress={onSubmitHandler}>{buttonLabel}</Button>
			</View>
		</View>
	);
};

export default ExpenseForm;

const styles = StyleSheet.create({
	form: {
		marginTop: 40,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: 'white',
		marginVertical: 24,
		textAlign: 'center',
	},
	rowContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	rowInput: { flex: 1 },
	buttons: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	button: {
		minWidth: 120,
		marginHorizontal: 8,
	},
});
