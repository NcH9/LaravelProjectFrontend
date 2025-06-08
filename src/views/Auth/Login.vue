<template>
    <div class="grid1">
    <h2 class="flex_center">{{ $t('auth.label') }}</h2>
    <el-form class="login">
        <el-form label-position="top" :model="form" class="form-grid">
            <el-form-item :label="$t('auth.email')" :error="error.email">
                <el-input
                    type="email"
                    v-model.lazy="form.email"
                    @blur="validateEmail(form.email)"
                    placeholder="example@email.com"
                />
            </el-form-item>

            <el-form-item :label="$t('auth.password')" :error="error.password">
                <el-input
                    type="password"
                    v-model.lazy="form.password"
                    @blur="validatePassword(form.password)"
                    show-password
                />
            </el-form-item>
        </el-form>

        <div class="flex_center">
            <el-button id="loginbtn" @click="validateForm">{{ $t('auth.login') }}</el-button>
        </div>
        <p class="error" v-if="errorMsg">{{ errorMsg }}</p>
        <p class="success" v-if="successMessage">{{ successMessage }}</p>
    </el-form>
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