import api from './api.js'

export const getAvailability = (date, partySize) =>
  api.get('/availability', { params: { date, partySize } })

export const createReservation = (payload) =>
  api.post('/reservations', payload)
