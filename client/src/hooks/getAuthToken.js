const getAuthToken = () => {
  return localStorage.getItem("token");
};

export default getAuthToken;
