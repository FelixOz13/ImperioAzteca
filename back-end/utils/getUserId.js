// utils.js
const getUserId = () => {
  try {
    const userId = localStorage.getItem('userId');
    return userId ? userId : null; // Conditional return for brevity
  } catch (error) {
    console.error('Error retrieving userId from local storage:', error);
    return null; // Handle error gracefully
  }
};

export default getUserId;
