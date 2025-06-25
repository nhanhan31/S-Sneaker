

export const getAllOrder = async () => {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch('https://api-for-be.onrender.com/api/get-all-order', {
            method: 'GET',

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },

        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching transactions:', error);
        throw error;
    }
};
export const getStatusOrderGHN = async (orderId) => {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`https://api-for-be.onrender.com/api/ghn/order-status/${orderId}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching transactions:', error);
        throw error;
    }
};