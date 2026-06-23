import api from './api.js'

export const getReservations  = (params)     => api.get('/reservations', { params })
export const cancelReservation = (id)        => api.patch(`/reservations/${id}/cancel`)
export const modifyReservation = (id, data)  => api.patch(`/reservations/${id}`, data)
export const getTables         = ()          => api.get('/tables')
export const toggleTableService = (id)      => api.patch(`/tables/${id}/out-of-service`)
