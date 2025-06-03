import { ref } from "vue";
import {useRoomStore} from "@/stores/roomStore.js";
import {i18n} from "@/i18n.js";
const {t} = i18n.global;
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
            error.value.email = t('errors.email');
        } else {
            error.value.email = '';
        }
    }
    function validateUsername(username){
        if (username.length < 5) {
            error.value.username = t('errors.username');
        } else {
            error.value.username = '';
        }
    }
    function validatePassword(password) {
        if (password.length < 8) {
            error.value.password = t('errors.password');
        } else {
            error.value.password = '';
        }
    }
    function validatePasswordConfirmation(password, password_confirmation) {
        if (password_confirmation.length < 8) {
            error.value.password_confirmation = t('errors.password');
            return;
        }
        if (password !== password_confirmation) {
            error.value.password_confirmation = t('errors.password_confirmation');
        } else {
            error.value.password_confirmation = '';
        }
    }

    async function validateRoom(roomNumber) {
        const roomStore = useRoomStore();

        if (roomNumber !== 0) {
            if (roomNumber === '') {
                error.value.room = t('errors.room.required');
                return;
            }

            if (roomStore.state.rooms.length === 0) {
                await roomStore.getRooms();
            }

            const exists = Object.values(roomStore.state.rooms).some(floor =>
                floor.some(room => room.number === roomNumber)
            )

            if (!exists) {
                error.value.room = t('errors.room.not_exist');
                return;
            }
        }

        error.value.room = '';
    }
    function validateStart(startDate) {
        if (startDate === '') {
            error.value.start = t('errors.start_date.required');
            return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const start = new Date(startDate);
        if (start < today) {
            error.value.start = t('errors.start_date.today_or_later');
        } else {
            error.value.start = '';
        }
    } 
    function validateEnd(startDate, endDate) {
        if (startDate === '' || endDate === '') {
            error.value.end = t('errors.end_date.required');
            return;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
      
        if (end <= start) {
            error.value.end = t('errors.end_date.later_than_start');
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