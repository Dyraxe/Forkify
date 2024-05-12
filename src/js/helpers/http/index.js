import { TIMEOUT_SECONDS } from '../../config';
import { API_URL } from '../../config';
import { timeout } from '../time';


export async function AJAX(url = '', uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(`${API_URL}${url}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(`${API_URL}${url}`);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SECONDS)]);
    const resData = await res.json();
    if (!res.ok) throw new Error(`${resData.message} (${res.status})`);
    return resData;
  } catch (error) {
    console.error(`HELPER/http: ${error}`);
    throw error;
  }
}
