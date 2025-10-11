import axios from "axios"

const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0",
    "Referer": "https://bacakomik.my/",
    "Origin": "https://bacakomik.my",
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const fetchPage = async (url) => {
    try {
        const response = await axios.get(url, {
            headers: {
                ...headers,
            },
        })
        await delay(1000)
        return response.data
    } catch (error) {
        console.error(`Error fetching URL: ${url}`, error.message)
        console.error("Error Response Headers:", error.response?.headers)
        throw error
    }
}
