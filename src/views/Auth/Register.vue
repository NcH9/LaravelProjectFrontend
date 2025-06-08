<template>
    <div>
    <h2 class="flex_center">{{ $t('auth.register') }}</h2>
    <el-form class="register">
        <el-form-item
            :label="$t('auth.username')"
            :error="error.username || errors.name"
        >
            <el-input
                v-model.lazy="form.name"
                @blur="validateUsername(form.name)"
                type="text"
                id="name"
                placeholder="Ім’я"
            />
        </el-form-item>

        <el-form-item
            :label="$t('auth.email')"
            :error="error.email || errors.email"
        >
            <el-input
                v-model.lazy="form.email"
                @blur="validateEmail(form.email)"
                type="email"
                id="email"
                placeholder="email@example.com"
            />
        </el-form-item>

        <el-form-item
            :label="$t('auth.password')"
            :error="error.password || errors.password"
        >
            <el-input
                v-model.lazy="form.password"
                @blur="validatePassword(form.password)"
                type="password"
                id="password"
                show-password
                placeholder="********"
            />
        </el-form-item>

        <el-form-item
            :label="$t('auth.confirm_password')"
            :error="error.password_confirmation || errors.password_confirmation"
        >
            <el-input
                v-model.lazy="form.password_confirmation"
                @blur="validatePasswordConfirmation(form.password, form.password_confirmation)"
                type="password"
                id="password_confirmation"
                show-password
                placeholder="********"
            />
        </el-form-item>

        <div class="flex_center">
            <el-button class="flex_center" @click="validateForm" id="registerbtn">{{ $t('auth.register') }}</el-button>
        </div>
    </el-form>
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