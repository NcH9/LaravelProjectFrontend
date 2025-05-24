<template>
    <div class="grid1">
    <h2 class="flex_center">Login</h2>
    <form @submit.prevent="validateForm" class="login">
        <div class="grid1">
            <div class="flex_center">
                <label for="email">Email:</label>
                <input type="email" id="email" v-model.lazy="form.email" @blur="validateEmail(form.email)" />
            </div>
            <span class="error" v-if="error.email">{{ error.email }}</span>
        </div>

        <div class="grid1">
            <div class="flex_center">
                <label for="password">Password:</label>
                <input type="password" id="password" v-model.lazy="form.password" @blur="validatePassword(form.password)"/>
            </div>
            <span class="error" v-if="error.password">{{ error.password }}</span>
        </div>

        <div class="flex_center">
            <button id="loginbtn" type="submit">Login</button>
        </div>
        <p class="error" v-if="errorMsg">{{ errorMsg }}</p>
        <p class="success" v-if="successMessage">{{ successMessage }}</p>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import axiosInstance from '@/api/axios.js';
import formValidation from '@/mixins/validator.js';
import router from '@/router/index.js';
export default {
    name: 'Login',
    mixins: [formValidation],
    setup() {
        const form = ref ({
            email: '',
            password: '',
        });
        const errorMsg = ref('');
        const successMessage = ref('');
        const { error, validatePassword, validateEmail, resetError } = formValidation();

        function validateForm() {
            resetError();
            validateEmail(form.value.email);
            validatePassword(form.value.password);
            if (!error.value.email && !error.value.password){
                loginUser();
            }
        }

        const loginUser = async () => {
            document.getElementById('loginbtn').disabled = true;
            try {
                errorMsg.value = '';
                successMessage.value = "";

                const response = await axiosInstance.post("/login", form.value);
                successMessage.value = "Login successful!";
                localStorage.setItem('authToken', response.data.token);

                router.push({ name: 'home' }).then(() => {
                    window.location.reload();
                });
            } catch (error) {
                if (error.response && error.response.status === 422) {
                    errorMsg.value = error.response.data.message;
                } else {
                    console.error("An unexpected error occurred:", error);
                }
            } finally {
                if (successMessage.value !== "Login successful!") {
                    document.getElementById('loginbtn').disabled = false;
                }
            }
        }

        return {
            form, errorMsg, successMessage, error,
            loginUser, validateForm, validatePassword, validateEmail, resetError
        }
    },
    
}
</script>