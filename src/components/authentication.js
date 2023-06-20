export async function getAuthToken() {
    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: 'Basic <959fab8dac94489ab0fd8dacbf109998:e60f4397f3a54e489cf7f5a03d11d35b>'
            },
            body: 'grant_type=client_credentials'
        });
        const data = await response.json();
        const authToken = data.access_token;
        return authToken;
    } catch (error) {
        console.error('Error obtaining auth token:', error);
        throw error;
    }
}
