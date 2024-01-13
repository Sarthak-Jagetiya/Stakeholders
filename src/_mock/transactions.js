// import { sample } from 'lodash';
// import { faker } from '@faker-js/faker';
const axios = require('axios');

const fetchTransactionsData = async () => {
  try {
    const response = await axios.get('http://10.0.1.38:3000/api/transaction/');
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions data:', error.message);
    return [];
  }
};

// ----------------------------------------------------------------------

export const getTransactionsData = async () => {
  // Fetch data from the API
  const apiTransactions = await fetchTransactionsData();

  // Map API data to match the structure used in transactions-view code
  const transactions = apiTransactions.map((apiTransaction, index) => ({
    id: index.toString(),
    PRN: apiTransaction.PRN,
    avatarUrl: `/assets/images/avatars/avatar_${index + 1}.jpg`,
    scholarship: apiTransaction.scholarship,
    tuitionfees: apiTransaction.tuitionfees,
    eligibilityregistration: apiTransaction.eligibilityregistration,
    universityfees: apiTransaction.universityfees,
    library: apiTransaction.library,
    other: apiTransaction.other,
    cautionmoney: apiTransaction.cautionmoney,
    signature: apiTransaction.signature,
  }));

  return transactions;
};
