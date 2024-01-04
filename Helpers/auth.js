import axios from 'axios';
import { encode } from 'base-64';

const BaseAPI = 'https://dev.veri-fuel.com/qamobileapi/FuelConnectApi';
const BaseDevApiUrl = "https://dev.veri-fuel.com/IH.API/VeriFuel";

const USERNAME = 'test'; // Replace with your username
const PASSWORD = 'test'; // Replace with your password


const authHeader = 'Basic ' + encode(`${USERNAME}:${PASSWORD}`);
const headers = {
    'Content-Type': 'application/json',
    Authorization: authHeader,
};


export const ValidateUser = async (data) => {
    try {
        const response = await axios.post(`${BaseAPI}/Login`, data);
        return response;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const GetSyncData = async (postData) => {
    const url = `${BaseDevApiUrl}/GetSyncData`;
    try {
        const response = await axios.post(url, postData, { headers });
        if (response.status === 200) {
            //console.log('Server Response:', response.data);
            return response.data;
        }
    } catch (error) {
        if (error.response) {
            throw new Error('Server Error: ' + error.response.data);
        } else if (error.request) {
            throw new Error('No Response');
        } else {
            throw new Error('Request Error: ' + error.message);
        }
    }
};

export const SaveTruckGPSDetails = async (postData) => {
    const url = `${BaseDevApiUrl}/SaveTruckGPSDetails`;

    try {
        const response = await axios.post(url, postData, { headers });
        if (response.status === 200) {
            //console.log('Server Response:', response.data);
            return response.data;
        }
    } catch (error) {
        if (error.response) {
            throw new Error('Server Error: ' + error.response.data);
        } else if (error.request) {
            throw new Error('No Response');
        } else {
            throw new Error('Request Error: ' + error.message);
        }
    }
};

export const GetCustomers = async (postData) => {
    const url = `${BaseDevApiUrl}/GetCustomers`;
    try {
        const response = await axios.post(url, postData, { headers });
        if (response.status === 200) {
            //console.log('Server Response:', response.data);
            return response.data;
        }
    } catch (error) {
        if (error.response) {
            throw new Error('Server Error: ' + error.response.data);
        } else if (error.request) {
            throw new Error('No Response');
        } else {
            throw new Error('Request Error: ' + error.message);
        }
    }
};

export const GetShipTos = async (postData) => {
    const url = `${BaseDevApiUrl}/GetShipTos`;
    try {
        const response = await axios.post(url, postData, { headers });
        if (response.status === 200) {
            //console.log('Server Response:', response.data);
            return response.data;
        }
    } catch (error) {
        if (error.response) {
            throw new Error('Server Error: ' + error.response.data);
        } else if (error.request) {
            throw new Error('No Response');
        } else {
            throw new Error('Request Error: ' + error.message);
        }
    }
};

export const GetShipToServiceTypes = async (postData) => {
    const url = `${BaseDevApiUrl}/GetShipToServiceSchedule`;
    try {
        const response = await axios.post(url, postData, { headers });
        if (response.status === 200) {
            //console.log('Server Response:', response.data);
            return response.data;
        }
    } catch (error) {
        if (error.response) {
            throw new Error('Server Error: ' + error.response.data);
        } else if (error.request) {
            throw new Error('No Response');
        } else {
            throw new Error('Request Error: ' + error.message);
        }
    }
};

export const GetShipToAssets = async (postData) => {
    const url = `${BaseDevApiUrl}/GetShipToAssets`;
    try {
        const response = await axios.post(url, postData, { headers });
        if (response.status === 200) {
            //console.log('Server Response:', response.data);
            return response.data;
        }
    } catch (error) {
        if (error.response) {
            throw new Error('Server Error: ' + error.response.data);
        } else if (error.request) {
            throw new Error('No Response');
        } else {
            throw new Error('Request Error: ' + error.message);
        }
    }
};

export const GetUserDetails = async (postData) => {

    const url = `${BaseDevApiUrl}/GetUserDetailsMobile`;

    console.log('GetUserDetails Request:', postData);

    try {
        const response = await axios.post(url, postData, { headers });
        if (response.status === 200) {
            //console.log('GetUserDetails Server Response:', response.data);
            return response.data;
        }
    } catch (error) {
        if (error.response) {
            throw new Error('GetUserDetails Server Error: ' + error.response.data);
        } else if (error.request) {
            throw new Error(' GetUserDetails No Response');
        } else {
            throw new Error('GetUserDetails Request Error: ' + error.message);
        }
    }
};


export const GetMobileBuyerDeals = async (postData) => {
    const url = `${BaseDevApiUrl}/GetMobileBuyerDeals`;
    try {
        const response = await axios.post(url, postData, { headers });
        if (response.status === 200) {
            //console.log('Server Response:', response.data);
            return response.data;
        }
    } catch (error) {
        if (error.response) {
            throw new Error('Server Error: ' + error.response.data);
        } else if (error.request) {
            throw new Error('No Response');
        } else {
            throw new Error('Request Error: ' + error.message);
        }
    }
};

export const ChatBot = async (postData) => {
    const url = `${BaseDevApiUrl}/ChatBot`;
    try {
        const response = await axios.post(url, postData, { headers });
        if (response.status === 200) {
            //console.log('Server Response:', response.data);
            return response.data;
        }
    } catch (error) {
        if (error.response) {
            throw new Error('Server Error: ' + error.response.data);
        } else if (error.request) {
            throw new Error('No Response');
        } else {
            throw new Error('Request Error: ' + error.message);
        }
    }
};

export const GetPricingBasis = async (postData) => {
    const url = `${BaseDevApiUrl}/GetPricingBasis`;
    try {
        const response = await axios.post(url, postData, { headers });
        if (response.status === 200) {
            //console.log('Server Response:', response.data);
            return response.data;
        }
    } catch (error) {
        if (error.response) {
            throw new Error('Server Error: ' + error.response.data);
        } else if (error.request) {
            throw new Error('No Response');
        } else {
            throw new Error('Request Error: ' + error.message);
        }
    }
};

export const GetIndexProducts = async (postData) => {
    const url = `${BaseDevApiUrl}/GetIndexProducts`;
    try {
        const response = await axios.post(url, postData, { headers });
        if (response.status === 200) {
            //console.log('Server Response:', response.data);
            return response.data;
        }
    } catch (error) {
        if (error.response) {
            throw new Error('Server Error: ' + error.response.data);
        } else if (error.request) {
            throw new Error('No Response');
        } else {
            throw new Error('Request Error: ' + error.message);
        }
    }
};

export const SaveToDealDesk = async (postData) => {
    const url = `${BaseDevApiUrl}/SaveToDealDesk`;
    try {
        const response = await axios.post(url, postData, { headers });
        if (response.status === 200) {
            //console.log('Server Response:', response.data);
            return response.data;
        }
    } catch (error) {
        if (error.response) {
            throw new Error('Server Error: ' + error.response.data);
        } else if (error.request) {
            throw new Error('No Response');
        } else {
            throw new Error('Request Error: ' + error.message);
        }
    }
};



