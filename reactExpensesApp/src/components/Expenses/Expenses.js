import React, {useState} from 'react';
import Card from '../UI/Card';
import './Expenses.css';
import ExpensesFilter from './ExpensesFilter';
import ExpensesList from './ExpensesList';
import ExpensesChart from './ExpensesChart';

const Expenses = (props) => {

  const [selectedYear, setSelectedYear] = useState('2020');

  const setSelectedYearHandler = (selectedYear) => {
    setSelectedYear(selectedYear);
  };

  const filteredExpenses = props.items.filter(eachExpense => (eachExpense.date.getFullYear().toString() === selectedYear));

  return (
    <div className="expenses">
      <ExpensesChart expenses={filteredExpenses}></ExpensesChart>
      <ExpensesFilter selectedYear={selectedYear} onYearSet={setSelectedYearHandler}/>
      <Card>
        <ExpensesList filteredExpenses={filteredExpenses}/>
      </Card>
    </div>
  );
}

export default Expenses;
