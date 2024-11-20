import { defer } from "react-router-dom";
import apiRequest from "./apiRequest"

export const singlePageLoader = async ({request, params}) => {
const res = await apiRequest("/posts/"+params.id);
return res.data;
}

export const listPageLoader = async ({request, params}) => {
const query = request.url.split("?")[1];
const resPromise = await apiRequest("/posts?"+query);
return defer({
    postResponse: resPromise,
  });
}

export const profilePageLoader = async () => {
const resPromise = await apiRequest("/users/profilePosts");
const chatPromise = await apiRequest("/chats/");
console.log(resPromise);
return defer({
  postResponse: resPromise,
  chatResponse: chatPromise,
});
}