import axios from "../../api/axios";

export const getUserTweets = (userId) => {
  return axios.get(`/tweets/all-tweets/${userId}`);
};

export const addTweet = (content) => {
  return axios.post(`/tweets/create-tweet`, {content});
};

export const updateTweet = (tweetId, content) => { 
  return axios.patch(`/tweets/t/${tweetId}`, {
    content,
  });
  
};

export const deleteTweet = (tweetId) => { 
  return axios.delete(`/tweets/d/${tweetId}`);
};

