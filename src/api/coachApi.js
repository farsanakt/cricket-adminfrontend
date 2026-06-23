import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});


export const getAllCoaches = async () => {

    console.log('jooope')
  return await API.get("/coach/all");

};

export const createCoach=async(data)=>{

}



export const getCoachLocations = async () => {

  return await API.get("/coach/locations");

};