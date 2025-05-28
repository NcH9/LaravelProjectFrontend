<template>
    <div>
    <h2 class="flex_center">Register</h2>
    <form @submit.prevent="validateForm" class="register">
        <div class="grid1">
            <div class="flex_center">
                <label for="name">Name:</label>
                <input v-model.lazy="form.name" @blur="validateUsername(form.name)" type="text" id="name" />
            </div>
            <span class="error" v-if="error.username">{{ error.username }}</span>
            <span class="error" v-if="errors.name">{{ errors.name }}</span>
        </div>

        <div class="grid1">
            <div class="flex_center">
                <label for="email">Email:</label>
                <input v-model.lazy="form.email" @blur="validateEmail(form.email)" type="email" id="email" />
            </div>
            <span class="error" v-if="error.email">{{ error.email }}</span>
            <span class="error" v-if="errors.email">{{ errors.email }}</span>
        </div>
        

        <div class="grid1">
            <div class="flex_center">
                <label for="password">Password:</label>
                <input v-model.lazy="form.password" @blur="validatePassword(form.password)" type="password" id="password" />
            </div>
            <span class="error" v-if="error.password">{{ error.password }}</span>
            <span class="error" v-if="errors.password">{{ errors.password }}</span>
        </div>

        <div class="grid1">
            <div class="flex_center">  
                <label for="password_confirmation">Confirm Password:</label>
                <input 
                    v-model.lazy="form.password_confirmation" 
                    @blur="validatePasswordConfirmation(form.password, form.password_confirmation)" 
                    type="password" 
                    id="password_confirmation" 
                />
            </div>
            <span class="error" v-if="error.password_confirmation">{{ error.password_confirmation }}</span>
            <span class="error" v-if="errors.password_confirmation">{{ errors.password_confirmation }}</span>
        </div>

        <button class="flex_center" type="submit" id="registerbtn">Register</button>
        <p class="success" v-if="successMessage">{{ successMessage }}</p>
    </form>
  </div>
</template>
<script>
import { reactive, ref } from 'vue';
import axiosInstance from '@/api/axios.js';
import formValidation from '@/mixins/validator.js';
import router from '@/router/index.js';
export default {
    setup() {
        const form = ref ({
            name: '',
            email: '',
            password: '',
            password_confirmation: ''
        });
        const errors = ref({});
        const successMessage = ref('');

        const { error, validatePassword, validatePasswordConfirmation, validateEmail, resetError, validateUsername } = formValidation();

        function validateForm() {
            resetError();
            validateUsername(form.value.name);
            validateEmail(form.value.email);
            validatePassword(form.value.password);
            if (!error.value.email && !error.value.password && !error.value.name){
                registerUser();
            }
        }

        const registerUser = async () => {
            document.getElementById('registerbtn').disabled = true;
            try {
                errors.value = {};
                successMessage.value = "";

                const response = await axiosInstance.post("/register", form.value);
                successMessage.value = "Registration successful!";

                localStorage.setItem("authToken", response.data.token);

                router.push({ name: 'home' }).then(() => {
                    window.location.reload();
                });
            } catch (error) {
                console.log(error);
                if (error.response && error.response.status === 422) {
                    errors.value = error.response.data.errors;
                } else {
                    console.error("An unexpected error occurred:", error);
                }
            } finally {
                if (successMessage.value !== "Registration successful!") {
                    document.getElementById('registerbtn').disabled = false;
                }
            }
        }

        return {
            form, errors, successMessage, error, 
            registerUser, validatePassword, validatePasswordConfirmation, validateEmail, resetError, validateUsername, validateForm
        }
    },
    
}
</script>