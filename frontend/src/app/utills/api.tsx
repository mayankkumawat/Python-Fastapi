import { toast } from "react-toastify";

const API_URL = "http://127.0.0.1:8000"; // Your FastAPI backend URL

export async function fetchUsers() {
    const response = await fetch(`${API_URL}/users/`);
    if (!response.ok) {
        throw new Error("Failed to fetch users");
    }
    return await response.json();
}

export async function fetchUser(userId:any) {
    const response = await fetch(`${API_URL}/users/${userId}`);
    if (!response.ok) {
        throw new Error("Failed to fetch user");
    }
    return await response.json();
}

export async function createUser(user:any) {
    const response = await fetch(`${API_URL}/users/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    });
    if (!response.ok) {
        throw new Error("Failed to create user");
    }
    return await response.json();
}

export async function fetchItems(user_id:number) {
    const response = await fetch(`${API_URL}/items/${user_id}`);
    if (!response.ok) {
        throw new Error("Failed to fetch items");
    }
    return await response.json();
}

export async function createItem(item:any, userId:any) {
    const response = await fetch(`${API_URL}/items?user_id=${userId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
    });
    if (!response.ok) {
        const err = await response.json()
        toast.error(err.detail)
        throw new Error("Failed to create item");
    }
    return await response.json();
}

export async function delItem(userId:number, itemId:number) {
    const response = await fetch(`${API_URL}/items/${userId}/${itemId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        throw new Error("Failed to create item");
    }
    return await response.json();
}

export async function updateItem(itemId:any, userId:any, item:any) {
    const response = await fetch(`${API_URL}/items/${userId}/${itemId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
    });
    if (!response.ok) {
        const err = await response.json()
        toast.error(err.detail)
        throw new Error("Failed to update item");
    }
    return await response.json();
}