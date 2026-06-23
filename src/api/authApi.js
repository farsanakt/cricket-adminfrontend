import API from "./axios"


export const loginUser = async (data) => {
  try {
    const res = await API.post("/auth/login", data)
    console.log(res)
    return res.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

export const exitingExercises=async()=>{

   return await API.get('/excercise/existingworkouts')

}

export const getPlayer = (id) => API.get(`/player/${id}`)
export const createReport = (data) => API.post("/report", data)