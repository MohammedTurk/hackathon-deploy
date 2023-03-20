import { useSWRMutation, type MutationFetcher } from "lib/swr";
import axios from "lib/axios";
import { getAuthorizationHeader } from "utils";

const myFetcher = async (url, method, options) => {
  try {
    const response = await axios({
      url,
      method,
      ...options,
      headers: { ...getAuthorizationHeader() },
    });
    console.log(response.data);
    
    return response.data;
  } catch (error) {
   console.log(error);
    
  }
};

export const useSWRMutationHook = (
  url,
  method = "get",
  options = {}
) => {
  const {trigger, data, error, isMutating } = useSWRMutation(
    [url, method, options],
    () => myFetcher(url, method, options)
  );
  return { trigger , data , error, isMutating };
};

export default useSWRMutationHook;