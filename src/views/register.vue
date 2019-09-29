<template>
    <div>
        <div class="alerta alerta-éxito alerta-descarte desvanecimiento show" rol="alerta"> ¡
            Con Bootstrap!
            <button type="button" class="close" data-dispats="alert" aria-label="Cerrar">
                <span aria-hidden="true"> & times; </span>
            </button>
        </div>
    </div>
</template>
<script>
    import axios from 'axios';
    export default {
        name: 'register',
        data() {
            return {

                config: {
                    headers: {
                        Authorization: 'token af81d0628ae7af0ea728eb7cdcec5eb69dc2a660'
                    }
                }
            }
        },
        mounted() {
            console.log('Componente listo')
            axios.get("https://bodegaapi.herokuapp.com/api/v1/users/", this.config).then((response) => {
                console.log(response.data)
            })
        },
        methods: {
        }
    }
</script>