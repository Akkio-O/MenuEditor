<script>
import './index';
import { mapActions, mapState } from 'vuex';
export default {
    data() {
        return {
            isAuthenticated: false,
            role: null,
            isRegister: false,
            title: true,
            login: '',
            email: '',
            password: '',
            confirmPassword: '',
            placeholderEmail: 'Email',
            placeholderLog: 'Логин',
            placeholderPass: 'Пароль не менее 6 символов',
            placeholderConfPass: 'Повторите пароль',
            isError: {
                login: false,
                email: false,
                password: false,
                confirmPassword: false,
            },
            fetchDataResponse: false,
            DataResponseText: '',
        }
    },
    computed: {
        ...mapState(['isAuthenticated', 'role']),
    },
    methods: {
        ...mapActions(['setAuthenticated', 'setRole']),

        setAuthenticated(value) {
            this.isAuthenticated = value;
            localStorage.setItem('isAuthenticated', value);
        },
        setRole(role) {
            this.role = role;
            localStorage.setItem('userRole', role);
        },
        toggleChange() {
            this.isRegister = !this.isRegister
        },
        validateForm() {
            this.resetErrors();

            let isValid = true;

            if (this.login === '') {
                this.placeholderLog = 'Логин не может быть пустым';
                this.isError.login = true;
                isValid = false;
                this.login = '';
            }
            if (this.password.length < 6) {
                this.placeholderPass = 'Пароль должен содержать не менее 6 символов';
                this.isError.password = true;
                isValid = false;
                this.password = '';
            }
            if (this.isRegister && this.password !== this.confirmPassword) {
                this.placeholderConfPass = 'Пароли не совпадают';
                this.isError.confirmPassword = true;
                isValid = false;
                this.confirmPassword = '';
            }
            if (this.isRegister && !this.email) {
                this.placeholderEmail = 'Email не может быть пустым';
                this.isError.email = true;
                isValid = false;
                this.email = '';
            } else if (this.isRegister && !/\S+@\S+\.\S+/.test(this.email)) {
                this.placeholderEmail = 'Неверный формат email';
                this.isError.email = true;
                isValid = false;
                this.email = '';
            }

            return isValid;
        },
        resetErrors() {
            this.isError.login = false;
            this.isError.email = false;
            this.isError.password = false;
            this.isError.confirmPassword = false;
        },
        handleSubmit() {
            if (this.validateForm()) {
                this.fetchData(this.isRegister ? 'register' : 'login');
            }
        },
        fetchData(type) {
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            };
            {
                requestOptions.body = JSON.stringify({
                    username: this.login,
                    email: this.email,
                    password: this.password,
                });
            }
            fetch(`http://localhost:3000/${type}`, requestOptions)
                .then(response => {
                    if (response.headers.get('Content-Type')?.includes('application/json')) {
                        return response.json();
                    } else {
                        return response.text();
                    }
                })
                .then(data => {
                    this.password = '' ;
                    this.login = '';
                    this.fetchDataResponse = true;
                    this.DataResponseText = data.error;
                    if (data.success) {
                        this.setAuthenticated(true);
                        this.setRole(data.role)
                        this.$router.push('MenuEditor/menu').then(() => {
                            window.location.reload();
                        });
                    }
                })
                .catch(error => console.error("ОШИБКА", error));
        }
    },
    mounted() {
        this.$store.commit('initializeStore');
    },
}

</script>
<template>
    <section>
        <h2>{{ isRegister ? 'Регистрация' : 'Авторизация' }}</h2>
        <h3 v-if="fetchDataResponse">{{ DataResponseText }}</h3>
        <form @submit.prevent="handleSubmit">
            <input :class="isError.login ? 'authorization_error' : ''" v-model="login" type="text"
                :placeholder="isRegister ? placeholderLog : placeholderLog + ' или ' + placeholderEmail" required>
            <input :class="isError.email ? 'authorization_error' : ''" v-if="isRegister" v-model="email" type="email"
                :placeholder="placeholderEmail" required>
            <input :class="isError.password ? 'authorization_error' : ''" v-model="password" type="password"
                :placeholder="placeholderPass" required>
            <input :class="isError.confirmPassword ? 'authorization_error' : ''" v-if="isRegister"
                v-model="confirmPassword" type="password" :placeholder="placeholderConfPass" required>

            <button type="submit" class="authorization_button">{{ isRegister ? 'Создать аккаунт' : 'Войти' }}</button>
            <button type="button" @click="toggleChange()" ref="register" class="authorization_button">{{ isRegister ?
                'Войти' : 'Создать аккаунт' }}</button>
        </form>
    </section>
</template>