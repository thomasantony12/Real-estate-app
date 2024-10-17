import { defer } from "react-router-dom";
import apiRequest from "./apiRequest"

export const singlePageLoader = async ({request, params}) => {
const res = await apiRequest("/posts/"+params.id);
return res.data;
}

export const listPageLoader = ({request, params}) => {
const query = request.url.split("?")[1];
const resPromise = apiRequest("/posts?"+query);
return defer({
    postResponse: resPromise,
  });
}