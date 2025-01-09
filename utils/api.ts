export const fetchData = async (url: string) => {
    const response = await fetch(url);
    if(!response.ok) throw new Error(`Failed to fetch from ${url}`);
    return response.json()
}