import axios from "../../api/axios";

export const toggleSubscription = (channelId) => {
  return axios.post(`/subscriptions/t/${channelId}`);
};

export const getChannelSubscribers = (channelId) => {
  return axios.get(`/subscriptions/s/${channelId}`);
};

export const getSubscribedChannels = () => {
  return axios.get("/subscriptions/SubscribedChannels");
};

