/**
 * Send a request to the backend to change a bots name
 * @param token The user token
 * @param id The id of the bot
 * @param name The new name of the bot
 * @returns The created bot
 * @throws Error if the request fails
 */
export async function changeName(token: string, id: string, name: string): Promise<Bot> {
    const res = await fetch(`/api/v1/bots/${id}/name/${name}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token,
        },
    });

    const data: BasicAPIResponse<Bot> = await res.json();
    if (data.type === "error") throw new Error(data.error)
    return data.data;
}