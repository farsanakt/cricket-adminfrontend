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

export const fetchALLPlayers=async()=>{

  return await API.get('/player/allplayers')

}

export const getAllInjuryData=async()=>{

  return await API.get('/player/allinjury')

}

export const getPlayer = (id) => API.get(`/player/${id}`)
export const createReport = (data) => API.post("/report", data)

export const createRehabProgram = async (data) => {
  try {
    const res = await API.post("/rehab", data)
    return res.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

export const getRehabProgramsByPlayer = async (playerId) => {
  try {
    const res = await API.get(`/rehab/player/${playerId}`)
    return res.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

export const getRehabProgramById = async (programId) => {
  try {
    const res = await API.get(`/rehab/${programId}`)
    return res.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

export const updateRehabProgram = async (programId, data) => {
  try {
    const res = await API.put(`/rehab/${programId}`, data)
    return res.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

export const deleteRehabProgram = async (programId) => {
  try {
    const res = await API.delete(`/rehab/${programId}`)
    return res.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

export const addRehabSession = async (programId, data) => {
  try {
    const res = await API.post(`/rehab/${programId}/session`, data)
    return res.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

export const updateRehabSession = async (programId, sessionId, data) => {
  try {
    const res = await API.put(`/rehab/${programId}/session/${sessionId}`, data)
    return res.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

export const deleteRehabSession = async (programId, sessionId) => {
  try {
    const res = await API.delete(`/rehab/${programId}/session/${sessionId}`)
    return res.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}