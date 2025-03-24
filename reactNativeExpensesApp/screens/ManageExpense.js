import { useContext, useLayoutEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import IconButton from '../components/UI/IconButton';
import { GlobalStyles } from '../util/styles';
import { ExpensesContext } from '../components/Store/store';
import ExpenseForm from '../components/ManageExpense/ExpenseForm';

function ManageExpense({ route, navigation }) {
	const expenseId = route?.params?.id;
	const isEditing = !!expenseId;
	const expensesCtx = useContext(ExpensesContext);
	const selectedExpense = expensesCtx.expenses.find((expense) => expense.id === expenseId);

	useLayoutEffect(() => {
		navigation.setOptions({
			title: isEditing ? 'Manage Expense' : 'Add Expense',
		});
	}, []);

	const deleteExpenseHandler = () => {
		expensesCtx.deleteExpense(expenseId);
		navigation.goBack();
	};

	const cancelHandler = () => {
		navigation.goBack();
	};

	const confirmHandler = (expenseData) => {
		if (isEditing) {
			expensesCtx.updateExpense(expenseId, expenseData);
		} else {
			expensesCtx.addExpense(expenseData);
		}
		navigation.goBack();
	};

	return (
		<View style={styles.container}>
			<ExpenseForm
				onSubmit={confirmHandler}
				onCancel={cancelHandler}
				defaultValues={selectedExpense}
				buttonLabel={isEditing ? 'Update' : 'Add'}
			/>
			{isEditing && (
				<View style={styles.deleteContainer}>
					<IconButton icon="trash" color={GlobalStyles.colors.error500} size={36} onPress={deleteExpenseHandler} />
				</View>
			)}
		</View>
	);
}

export default ManageExpense;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 24,
		backgroundColor: GlobalStyles.colors.primary800,
	},
	deleteContainer: {
		marginTop: 16,
		paddingTop: 8,
		borderTopWidth: 2,
		borderTopColor: GlobalStyles.colors.primary200,
		alignItems: 'center',
	},
});
