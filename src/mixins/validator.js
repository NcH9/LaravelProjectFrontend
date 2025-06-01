import { ref } from "vue";
import {useRoomStore} from "@/stores/roomStore.js";

export default function formValidation() {
    const error = ref({
        email: '',
        password: '',
        password_confirmation: '',
        username: '',
        room: '',
        start: '',
        end: '',
    });
    function resetError(){
        error.value = {
            email: '',
            password: '',
            password_confirmation: '',
            username: '',
            room: '',
            start: '',
            end: '',
        }
    }

    function validateEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            error.value.email = 'Please enter a valid email address.';
        } else {
            error.value.email = '';
        }
    }
    function validateUsername(username){
        if (username.length < 5) {
            error.value.username = 'Username must be at least 5 characters long.';
        } else {
            error.value.username = '';
        }
    }
    function validatePassword(password) {
        if (password.length < 8) {
            error.value.password = 'Password must be at least 8 characters long.';
        } else {
            error.value.password = '';
        }
    }
    function validatePasswordConfirmation(password, password_confirmation) {
        if (password_confirmation.length < 8) {
            error.value.password_confirmation = 'Password must be at least 8 characters long.';
            return;
        }
        if (password !== password_confirmation) {
            error.value.password_confirmation = 'Passwords do not match.';
        } else {
            error.value.password_confirmation = '';
        }
    }

    async function validateRoom(roomNumber) {
        const roomStore = useRoomStore();

        if (roomStore.state.rooms.length === 0) {
            await roomStore.getRooms();
        }
        // console.log(roomStore.state.rooms)
        // return;
        const exists = Object.values(roomStore.state.rooms).some(floor =>
            floor.some(room => room.number === roomNumber)
        )

        if (!exists) {
            error.value.room = 'This room does not exist.';
            return;
        }

        if (roomNumber === '') {
            error.value.room = 'Room is required.';
            return;
        }

        error.value.room = '';
    }
    function validateStart(startDate) {
        if (startDate === '') {
            error.value.start = 'Start date is required.';
            return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const start = new Date(startDate);
        if (start < today) {
            error.value.start = 'Start date must be today or later.';
            console.log('bb');
        } else {
            error.value.start = '';
        }
    } 
    function validateEnd(startDate, endDate) {
        if (startDate === '' || endDate === '') {
            error.value.end = 'Date is required.';
            return;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
      
        if (end <= start) {
            error.value.end = 'End date must be after start date.';
        } else {
            error.value.end = '';
        }
    }
    return {
        error,
        validatePassword, validateEmail, validateUsername, resetError, validatePasswordConfirmation,
        validateRoom, validateStart, validateEnd,
    }
}