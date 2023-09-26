import { createSlice } from "@reduxjs/toolkit";


const slice = createSlice({

  name: "slotbattles",
  initialState: {

    defs: {
      LINES: {
        '1': ['Sulfur', 'Charcoal', 'Gunpowder', 'Sulfur', 'Charcoal', 'Gunpowder', 'Sulfur', 'Charcoal', 'Gunpowder', 'Sulfur', 'Charcoal', 'Gunpowder'],
        '2': ['Sulfur', 'Charcoal', 'Gunpowder', 'Sulfur', 'Charcoal', 'Gunpowder', 'Sulfur', 'Charcoal', 'Gunpowder', 'Sulfur', 'Charcoal', 'Gunpowder'],
        '3': ['Sulfur', 'Charcoal', 'Gunpowder', 'Sulfur', 'Charcoal', 'Gunpowder', 'Sulfur', 'Charcoal', 'Gunpowder', 'Sulfur', 'Charcoal', 'Gunpowder']
      },
      COMBINATIONS: {}
    },

    filter: {
      status: 'ALL',
      orderByDescending: true,
    },

    createPopupVisible: false,
    selectedRoomId: null,

    rooms: [],
    roomsOrdered: [],

    history: []

  },
  reducers: {
    init: (state, action) => {
      const { slotLines, combinations, rooms } = action.payload;
      state.defs.LINES = slotLines;
      state.defs.COMBINATIONS = combinations;
      state.rooms = rooms;
    },
    pushRoom: (state, action) => {
      state.rooms.push(action.payload);
    },
    pushPlayer: (state, action) => {
      const { roomId, team, teamSeatOffset, seat } = action.payload;
      let room = state.rooms.find(room => room.id == roomId);
      if (!room) return;
      room.teams[team].members[teamSeatOffset] = seat;
    },
    destroyRoom: (state, action) => {
      const { roomId } = action.payload;
      if (state.selectedRoomId == roomId) state.selectedRoomId = null;
      state.rooms = state.rooms.filter(room => room.id !== roomId);
    },
    updateRoom: (state, action) => {
      const { roomId, newRoomData } = action.payload;
      for (let i in state.rooms) {
        if (state.rooms[i].id == roomId) state.rooms[i] = newRoomData;
      }
      /*
      let room = state.rooms.find(room => room.id !== roomId);
      if (!room) return;
      room = newRoomData;
      */
    },
    updateWinningVariables: (state, action) => {

    },
    setSelectedRoomId: (state, action) => {
      state.selectedRoomId = action.payload;
    },
    setCreatePopupVisible(state, action) {
      state.createPopupVisible = action.payload;
    },
    setFilterValue(state, action) {
      const { key, value } = action.payload;
      state.filter[key] = value;
    },
    orderRooms(state, action) {
      let rooms = state.rooms.filter(el => (state.filter.status == 'ALL' ? true : el.state == 'ACTIVE'));
      if (rooms.length > 0) {
        rooms = rooms.sort((a, b) => {
          if (state.filter.orderByDescending) return b.betAmount - a.betAmount;
          else return a.betAmount - b.betAmount;
        });
        rooms = rooms.sort((a, b) => {
          const aValue = a.state == 'ACTIVE' ? 1 : 0;
          const bValue = b.state == 'ACTIVE' ? 1 : 0;
          return bValue - aValue;
        });
      }
      state.roomsOrdered = rooms;
    },
    updateSlotVariables(state, action) {
      const { roomId, newTeams, currentSpinOffset, lastUpdate } = action.payload;
      let room = state.rooms.find(room => room.id == roomId);
      if (!room) return;
      room.currentSpinOffset = currentSpinOffset;
      room.teams = newTeams;
      room.lastUpdate = lastUpdate;
    },
    updateRoomState(state, action) {
      const { roomId, newState } = action.payload;
      let room = state.rooms.find(room => room.id == roomId);
      if (!room) return;
      room.state = newState;
    },

  },
  extraReducers: {},
});

export const {
  init,
  pushRoom,
  pushPlayer,
  updateRoom,
  destroyRoom,
  setSelectedRoomId,
  setCreatePopupVisible,
  setFilterValue,
  orderRooms,
  updateSlotVariables,
  updateRoomState
} = slice.actions;

export default slice.reducer;
