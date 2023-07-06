const back_url = "https://gamma-microservice-7bteynlhua-uc.a.run.app/";

export const getPackInfo = async (data) => {
  const response = await fetch(back_url, {
    method: 'POST',
    mode: 'cors', 
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data) 
  });
  
  return response.json();
}