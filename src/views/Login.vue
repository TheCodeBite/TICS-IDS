<template>
    <div class="materialContainer">
        <div class="box">
            <div class="titleLogin">LOGIN</div>
            </br></br>
            <div>
                <v-form>
                    <v-container>
                        <v-row>
                            <v-text-field
                                :rules="[rules.required]" 
                                label="Usuario"
                                outlined
                                v-model="username">
                            </v-text-field>
                            <v-text-field 
                                :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                                :rules="[rules.required, rules.min]" 
                                :type="show2 ? 'text' : 'password'"
                                label="Contraseña"
                                class="input-group--focused" 
                                @click:append="show2 = !show2"
                                outlined
                                v-model="password">
                            </v-text-field>
                        </v-row>
                        <v-btn color="#5CD5C6" @click="iniciarSesion()">
                            Entrar
                        </v-btn>
                    </v-container>
                </v-form>
            </div>
        </div>
    </div>

</template>
<script>
    import axios from 'axios';
    export default {
        name: 'login',
        data() {
            return {
                show2: false,
                password: '',
                username: '',
                url:"https://bodegaapi.herokuapp.com/api/v1/",
                rules: {
                    required: value => !!value || 'Campo requerido.',
                    min: value => value.length >= 8 || 'Min 8 carácteres',
                    email: value => {
                        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                        return pattern.test(value) || 'Correo invalido.'
                    }
                },
                config: {
                    headers: {
                        Authorization: 'token af81d0628ae7af0ea728eb7cdcec5eb69dc2a660'
                    }
                }
            }
        },
        mounted() {
            console.log('Componente listo')
            axios.get(this.url+"users/", this.config).then((response) => {
                console.log(response.data)
            })
        },
        methods: {
            iniciarSesion() {
                let params={ "username":this.username, "password":this.password }
                axios.post(this.url+"rest-auth/login/",params).then((response) => {
                    localStorage.setItem('token', JSON.stringify(response.data["key"]));
                    window.location.href = '/' 
                })
            }
        }
    }
</script>
<style>
    .box {
        position: relative;
        top: 0;
        opacity: 1;
        float: left;
        padding: 60px 50px 40px 50px;
        width: 100%;
        background: #fff;
        border-radius: 10px;
        transform: scale(1);
        -webkit-transform: scale(1);
        -ms-transform: scale(1);
        z-index: 5;
    }

    .box.back {
        transform: scale(.95);
        -webkit-transform: scale(.95);
        -ms-transform: scale(.95);
        top: -20px;
        opacity: .8;
        z-index: -1;
    }

    .materialContainer:before {
        content: "";
        width: 100%;
        height: 30px;
        border-radius: 10px;
        position: absolute;
        top: -10px;
        background: rgba(92, 213, 198);
        left: 0;
        transform: scale(.95);
        -webkit-transform: scale(.95);
        -ms-transform: scale(.95);
        z-index: -1;
    }
    .titleLogin {
        line-height: 46px!important;
        font-size: 34px!important;
        font-weight: 700!important;
        letter-spacing: 2px!important;
        width: 100%;
        float: left;
        color: #5CD5C6;
        position: relative;
    }

    .titleLogin:before {
        content: "";
        width: 5px;
        height: 100%;
        position: absolute;
        top: 0;
        left: -50px;
        background: #5CD5C6;
    }

    .input,
    .input label,
    .input input,
    .input .spin,


    .material-button,
    .alt-2,
    .material-button .shape,
    .alt-2 .shape,
    .box {
        transition: 400ms cubic-bezier(.4, 0, .2, 1);
        -webkit-transition: 400ms cubic-bezier(.4, 0, .2, 1);
        -ms-transition: 400ms cubic-bezier(.4, 0, .2, 1);
        box-shadow: 2px 4px 10px;
    }

    .input,
    .input label,
    .input input,
    .input .spin,
    .button,
    .button button {
        width: 100%;
        float: left;
    }

    .input,
    .button {
        margin-top: 30px;
        height: 70px;
    }

    .input,
    .input input,
    .button,
    .button button {
        position: relative;
    }

    .input input {
        height: 60px;
        top: 10px;
        border: none;
        background: transparent;
    }

    .input input,
    .input label,
    .button button {
        font-family: 'Roboto', sans-serif;
        font-size: 24px;
        color: rgba(0, 0, 0, 0.8);
        font-weight: 300;
    }

    .input:before,
    .input .spin {
        width: 100%;
        height: 1px;
        position: absolute;
        bottom: 0;
        left: 0;
    }

    .input:before {
        content: "";
        background: rgba(0, 0, 0, 0.1);
        z-index: 3;
    }

    .input .spin {
        background: #5CD5C6;
        z-index: 4;
        width: 0;
    }

    .input label {
        position: absolute;
        top: 10px;
        left: 0;
        z-index: 2;
        cursor: pointer;
        line-height: 60px;
    }

    .button.login {
        width: 60%;
        left: 20%;
    }

    .button.login button,
    .button button {
        width: 100%;
        line-height: 64px;
        left: 0%;
        background-color: transparent;
        border: 3px solid rgba(0, 0, 0, 0.1);
        font-weight: 900;
        font-size: 18px;
        color: rgba(0, 0, 0, 0.2);
    }

    .button.login {
        margin-top: 30px;
    }

    .button {
        margin-top: 20px;
    }

    .button button {
        background-color: #fff;
        color: #5CD5C6;
        border: none;
    }

    .button.login button.active {
        border: 3px solid transparent;
        color: #fff !important;
    }

    .button.login button.active span {
        opacity: 0;
        transform: scale(0);
        -webkit-transform: scale(0);
        -ms-transform: scale(0);
    }

    .button.login button.active i.fa {
        opacity: 1;
        transform: scale(1) rotate(-0deg);
        -webkit-transform: scale(1) rotate(-0deg);
        -ms-transform: scale(1) rotate(-0deg);
    }

    .button.login button i.fa {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        line-height: 60px;
        transform: scale(0) rotate(-45deg);
        -webkit-transform: scale(0) rotate(-45deg);
        -ms-transform: scale(0) rotate(-45deg);
    }

    .button.login button:hover {
        color: #5CD5C6;
        border-color: #5CD5C6;
    }

    .button {
        margin: 40px 0;
        overflow: hidden;
        z-index: 2;
    }

    .button button {
        cursor: pointer;
        position: relative;
        z-index: 2;
    }

    .pass-forgot {
        width: 100%;
        float: left;
        text-align: center;
        color: rgba(0, 0, 0, 0.4);
        font-size: 18px;
    }

    .click-efect {
        position: absolute;
        top: 0;
        left: 0;
        background: #5CD5C6;
        border-radius: 50%;
    }
    .material-button,
    .alt-2 {
        width: 140px;
        height: 140px;
        border-radius: 50%;
        background: #5CD5C6;
        position: absolute;
        top: 40px;
        right: -70px;
        cursor: pointer;
        z-index: 100;
        transform: translate(0%, 0%);
        -webkit-transform: translate(0%, 0%);
        -ms-transform: translate(0%, 0%);
    }

    .material-button .shape,
    .alt-2 .shape {
        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
    }

    body {
        background-image: url(https://lh4.googleusercontent.com/-XplyTa1Za-I/VMSgIyAYkHI/AAAAAAAADxM/oL-rD6VP4ts/w1184-h666/Android-Lollipop-wallpapers-Google-Now-Wallpaper-2.png)!important;
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        min-height: 100vh;
        font-family: 'Roboto', sans-serif;
    }

    body,
    html {
        overflow: hidden;
    }

    .materialContainer {
        width: 100%;
        max-width: 460px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        -webkit-transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
    }

    *,
    *:after,
    *::before {
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        text-decoration: none;
        list-style-type: none;
        outline: none;
    }
</style>