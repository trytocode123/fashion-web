import axios from "axios";

const apiUrl = import.meta.env.VITE_API_BASE_URL;
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
const apiUrlGoogle = import.meta.env.VITE_API_AUTH_GOOGLE_URL;

export async function logIn(account) {
    try {
        const res = await axios.post(`${apiUrl}/login`, account);
        return res.data;
    } catch (e) {
        const errData = e.response?.data;
        return {
            message: (typeof errData === 'string') ? errData : (errData?.message || "Login failed"),
        };
    }
}

export function logInGoogle() {
    try {
        const params = new URLSearchParams({
            client_id: clientId,
            redirect_uri: redirectUri,
            response_type: "code",
            scope: "openid email profile",
            access_type: "offline",
            prompt: "consent"
        });
        window.location.href = `https://accounts.google.com/o/oauth2/auth?${params.toString()}`;
    } catch (e) {
        console.error(e.message);
    }
}

export async function dataFromGoogle(code) {
    if (code) {
        try {
            const res = await axios.post(`${apiUrlGoogle}/auth/google`, { code });
            return res.data;
        } catch (e) {
            console.error(e.message);
        }
    }
}

export async function addAccount(data) {
    try {
        const res = await axios.post(`${apiUrl}/register`, data);
        return res.data;
    } catch (e) {
        const errData = e.response?.data;
        throw new Error((typeof errData === 'string') ? errData : (errData?.message || "Registration failed"));
    }
}

export async function verifyEmail(token) {
    try {
        const res = await axios.get(`${apiUrl}/verify-email`, { params: { token } });
        return res.data;
    } catch (e) {
        const errData = e.response?.data;
        const msg = (typeof errData === 'string') ? errData : (errData?.message || "Verification failed");
        throw new Error(msg);
    }
}

export async function getProfile(token) {
    try {
        const res = await axios.get(`${apiUrl}/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
    } catch (e) {
        throw new Error(e.response?.data || "Failed to fetch profile");
    }
}

export async function updateProfile(data, token) {
    try {
        const res = await axios.put(`${apiUrl}/profile`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
    } catch (e) {
        throw new Error(e.response?.data || "Failed to update profile");
    }
}
