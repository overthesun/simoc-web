<template>
    <div class='entry-wrapper'>
        <!-- This sectoin uses absolute positioning and overflow:hidden on the parent to hide it from the user.
        class binding is used to display / hide the warning.  v-if will simply display it or not, and will not activate the
        animation for displaying or hiding
        -->
        <div class='warning-wrapper' :class="{'warning-active': activeWarning}">
            <fa-icon class='fa-icon dismiss-icon' :icon="['fas','times']" @click="dismissWarning"/>
            <div class='warning-item' v-for="(item,index) in activeWarnings" :key="index">
                <!-- removed because of missing pro-light-svg-icon dependency <fa-icon class='fa-icon warning-icon' :icon="['fal','exclamation-circle']"/> -->
                {{activeWarnings[index]}}
            </div>
        </div>
        <!--Uses the BaseEntry component as its and fills in the slots to populate the sections -->
        <BaseEntry>
            <template v-slot:option-items>
                <div class='option-item' :class="{'option-item-active' : 'login'===activeOption}" @click="activateOption('login')"> SIGN IN </div>
                <div class='option-item' :class="{'option-item-active' : 'register'===activeOption}" @click="activateOption('register')"> SIGN UP </div>
            </template>
            <!-- The forms within use class binding to show / hide depending on which one is active. -->
            <template v-slot:entry-main>
                <form @submit.prevent="loginUser" id='login-form' class='entry-form entry-form-login' :class="{'entry-form-active' : 'login'===activeOption}">
                    <input v-model="user.username" type='text' class='input-field-text ' placeholder="Username"/>
                    <input v-model="user.password" type='password' class='input-field-text' placeholder="Password"/>
                </form>
                <form @submit.prevent="registerUser" id='register-form' class='entry-form entry-form-register' :class="{'entry-form-active' : 'register'===activeOption}">
                    <input v-model="register.username" type='text' class='input-field-text' placeholder="Choose Username"/>
                    <input v-model="register.password" type='password' class='input-field-text' placeholder="Enter Password"/>
                    <input v-model="register.confirmPassword" type='password' class='input-field-text' placeholder="Confirm Password"/>
                </form>
            </template>
            <!-- Uses class binding to show / hide the approriate section to the user -->
            <template v-slot:entry-button>
                <div class='btn-wrapper btn-wrapper-login' :class="{'btn-wrapper-active' : 'login'===activeOption}">
                    <button form='login-form' class='btn-warning'>SIGN IN</button>
                </div>
                <div class='btn-wrapper btn-wrapper-register' :class="{'btn-wrapper-active' : 'register'===activeOption}">
                    <button form='register-form' class='btn-warning'>SIGN UP</button>
                </div>
            </template>
            <template v-slot:entry-footer>
                <!--<a class='link link-disabled'>Forgot Password?</a>-->
            </template>
        </BaseEntry>

    </div>
</template>

<script>
import axios from 'axios'
import {BaseEntry} from '../../components/base'
import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'
export default {
    components:{
        'BaseEntry':BaseEntry,
    },

    data(){

        //Initialize all the values that will be used for v-model
        return{
            activeWarning:false, // Used to hidden or display the warning panel
            activeOption:'login', //Which 'option' should be active
            activeWarnings: [], //The current active warnings. This should really be a 'set' so that it only contains unique warnings. Currently will display duplicates.

            user:{
                username:"",
                password:"",
            },

            register:{
                username:"",
                password:"",
                confirmPassword:""
            },
        }
    },
    computed:{
        ...mapGetters(['getUseLocalHost']), //Should I be using the local host or relative.

    },
    methods:{

        // On registration make sure the username + password meet the criteria before attempting to register.
        // Warnings cannot be active before attempting login.
        registerUser: async function() {
            this.dismissWarning()  // clear existing warnings before starting
            // check criteria
            const usernameIsValid = await this.verifyUsername()
            const passwordIsValid = await this.verifyPassword()
            const passwordsMatch = await this.verifyPasswordMatch()
            if (!usernameIsValid) {
                this.addWarning(
                    'Invalid Username: can only contain letters, ' +
                    'numbers, underscores (_), dashes (-), dots (.), ' +
                    'and must be at least 4 characters long.')
            }
            if (!passwordIsValid) {
                this.addWarning('Invalid Password: must be at least 8 characters long.')
            }
            if (!passwordsMatch) {
                this.addWarning('Confirmation password does not match.')
            }
            // if no warnings were present pass in the username object to the register route
            if (!this.activeWarning) {
                const {username, password} = this.register
                const params = {'username': username, 'password': password}
                await this.entryHandler(params, '/register')  // Attempt the route
            }
        },

        //Login the user if the criteria is met.
        loginUser: async function() {
            this.dismissWarning()
            const loginCorrect = await this.verifyLogin()

            if (!loginCorrect) {
                this.addWarning("Invalid username or password")
            }

            if (loginCorrect) {
               const params = this.user
               await this.entryHandler(params,'/login')  // Attempt the route
            }
        },

        //Connection handler for the login / registeration. Takes in the parameters to be used, and the route to be called.
        //This method should be converted over to the try/catch block as seen elsewhere. Simply to reduce the callback hell.
        //It would also need to be made async in that case.
        entryHandler:function(params,route){
            axios.defaults.withCredentials = true;

            //const target = this.getUseLocalHost ? this.getUseLocalHost + route : route
            const localHost = "http://localhost:8000"
            const target = this.getUseLocalHost ? localHost + route : route
            axios.post(target,params).then(response => {
                const {status} = response
                if (response.data.status == 'ERROR') {
                    this.addWarning('Error: ' + response.data.message)
                }
                else if(status === 200){
                    this.$router.push('menu')
                }
            }).catch(error => {
                if (!error.response) {
                    // we didn't get a response from the server
                    this.addWarning('Error: No response from the server')
                }
                else {
                    // we got a response back from the server
                    const {status} = error.response
                    const {message} = error.response.data
                    if (status === 401) {
                        this.addWarning('Login Error: ' + message)
                    }
                    else if (status === 409) {
                        this.addWarning('Registration Error: ' + message)
                    }
                    else {
                        this.addWarning('Error: ' + message)
                    }
                }
            })
        },

        //Make sure that the password and username are at least not empty before proceeding.
        verifyLogin: function() {
            const {username,password} = this.user
            return username.length > 0 && password.length > 0
        },

        verifyUsername: function() {
            const {username} = this.register
            const userRegex = RegExp('^[a-zA-Z0-9_.-]{4,}$')
            return userRegex.test(username)
        },
        verifyPassword: function() {
            const {password} = this.register
            const passRegex = RegExp('.{8,}')
            return passRegex.test(password)
        },

        //Verifies that both the password field and confirm field match and neither is empty
        //Returns the solved boolean value
        verifyPasswordMatch: function() {
            const {password, confirmPassword} = this.register
            return password === confirmPassword
        },

        // add a warning and set the state to true
        addWarning: function(warningsMsg) {
            this.activeWarnings.push(warningsMsg)
            this.activeWarning = true
        },

        //Called when the user closes the warning message popup.
        //Clears all warning entries.
        dismissWarning: function() {
            this.activeWarnings = []
            this.activeWarning = false
        },

        //Used to activate which section the user is under Sign In or Sign Up
        //Called from the above options sections within the HTMl, passes in the
        //name value of the section that should have the active class.
        activateOption: function(sectionName) {
            this.dismissWarning()
            this.activeOption = sectionName
        },
    }
}
</script>

<style lang="scss" scoped>
    .entry-wrapper{
        height:100%;
        width:100%;
        display:flex;
        justify-content:center;
        align-items:center;
        flex-direction:column;
        box-sizing:border-box;
        position:relative;
    }

    .input-field-text{
        height: 36px;
        margin-bottom: 24px;
        outline:none;
        padding: 8px 8px;
        width: 256px;
        border-radius: 8px;
        border:none;
        box-sizing: border-box;
        font-weight: 600;
    }

    .entry-form{
        width:100%;
        position:absolute;
        display:flex;
        justify-content: center;
        align-items:center;
        flex-direction:column;
        transition: left .5s ease;

        &-login{
            left:-100%;
        }

        &-register{
            left:100%;
        }

        &-active{
            left:0;
        }
    }

    .btn-wrapper{
        width:100%;
        position:absolute;
        display:flex;
        justify-content:center;
        align-items:center;
        transition: left .5s ease;

        &-login{
            left:-100%;
        }

        &-register{
            left:100%;
        }

        &-active{
            left:0;
        }
    }

    .warning-wrapper{
        position:absolute;
        left:0;
        top:-256px;
        z-index:99;
        height: auto;
        max-height:256px;
        width:100%;
        background-color:#ff3100;
        transition: top .3s ease;
        padding:10px;
        box-sizing:border-box;
        border-bottom: 1px solid #eee;
        display:flex;
        justify-content:center;
        align-items:center;
        flex-direction:column;
        color:white;

        .warning-item{
            width:100%;
            margin: 4px 0px;
        }

       .warning-icon{
            font-size: 16px;
            //vertical-align: middle;
            margin-right:6px;
        }

        .dismiss-icon{
            position:absolute;
            top:0;
            right:0;
            margin:4px 8px;
            padding:4px;

            &:hover{
                cursor: pointer;
            }
        }
    }

    .warning-active{
        top:0px;
    }
</style>
