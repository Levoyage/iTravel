// api.js
import axios from 'axios';
import localforage from 'localforage';
import { parseRecommendations, parseContent } from './parser';

const API_URL = process.env.REACT_APP_API_URL;

localforage.config({
    driver: localforage.LOCALSTORAGE,
    name: 'iTravelCache',
    version: 1.0,
    storeName: 'keyvaluepairs',
    description: 'iTravel application cache'
});

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            window.location = '/login';
        }
        return Promise.reject(error);
    }
);

const generateCacheKey = (type, destination, bodyContent) => {
    return `${type}:${destination.toUpperCase()}:${JSON.stringify(bodyContent)}`;
};

const fetchImageUrl = async (query) => {
    try {
        const response = await fetch(`http://100.27.226.64:5000/get_image`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched image URL:", data.image_url);
        return data.image_url || 'https://via.placeholder.com/150';
    } catch (error) {
        console.error('Error fetching image URL:', error);
        return 'https://via.placeholder.com/150';
    }
};



const fetchContentFromBackend = async (destination, type, bodyContent, setLoading, setConversation, setRecommendations, setGuide) => {
    const cacheKey = generateCacheKey(type, destination, bodyContent);
    const cachedResponse = await localforage.getItem(cacheKey);

    if (cachedResponse) {
        if (type === 'recommendations') {
            setRecommendations(cachedResponse);
        } else if (type === 'guide') {
            setGuide(cachedResponse);
        }
        return;
    }

    setLoading(true);
    console.log(`Fetching ${type} for ${destination} with body:`, bodyContent);
    try {
        const response = await api.post(`/api/kimi/${type}`, bodyContent);
        const data = response.data;


        // 添加这行日志来查看原始内容
        console.log("Raw content:", data.choices[0].message.content);

        console.log(`Fetched ${type} data:`, data);

        if (type === 'recommendations') {
            const parsedRecommendations = await parseRecommendations(data.choices[0].message.content, fetchImageUrl);
            setRecommendations(parsedRecommendations);
            await localforage.setItem(cacheKey, parsedRecommendations);
        } else if (type === 'guide') {
            const parsedGuide = parseContent(data.choices[0].message.content);
            setGuide(parsedGuide);
            await localforage.setItem(cacheKey, parsedGuide);
        }

        setConversation(prevConversation => [
            ...prevConversation,
            ...bodyContent.messages,
            { role: 'assistant', content: data.choices[0].message.content }
        ]);

        setLoading(false);
    } catch (error) {
        console.error(`Failed to fetch ${type}:`, error);
        setLoading(false);
    }
};

const savePOI = async (poi) => {
    try {
        console.log('Saving POI:', poi);
        const response = await api.post('/api/pois', poi);
        console.log('POI save response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to save POI:', error.response ? error.response.data : error.message);
        throw error;
    }
};

const saveGuide = async (guide) => {
    try {
        console.log('Saving guide:', guide);
        const response = await api.post('/api/guides/guide', guide);
        console.log('Guide save response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to save guide:', error.response ? error.response.data : error.message);
        throw error;
    }
};

const fetchUserPOIs = async (userId) => {
    try {
        const response = await api.get(`/api/pois/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch user POIs:', error);
        throw error;
    }
};

const fetchUserGuides = async (userId) => {
    try {
        const response = await api.get(`/api/guides/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch user guides:', error);
        throw error;
    }
};

export {
    savePOI,
    saveGuide,
    fetchContentFromBackend,
    fetchImageUrl,
    fetchUserPOIs,
    fetchUserGuides
};