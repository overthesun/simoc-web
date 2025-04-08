<template>
    <div class="entry-wrapper">
        <!-- This section uses absolute positioning and overflow:hidden on the parent to hide
             it from the user.  class binding is used to display / hide the warning.
             v-if will simply display it or not, and will not activate the animation
             for displaying or hiding
        -->
        <div :class="{'warning-active': activeWarning}" class="warning-wrapper">
            <fa-icon :icon="['fa-solid','xmark']" class="fa-icon dismiss-icon" @click="dismissWarning" />
            <div v-for="(item,index) in activeWarnings" :key="index" class="warning-item">
                <!-- removed because of missing pro-light-svg-icon dependency
                     <fa-icon class='fa-icon warning-icon' :icon="['fal','exclamation-circle']"/> -->
                {{activeWarnings[index]}}
            </div>
        </div>
        <!--Uses the BaseEntry component as its and fills in the slots to populate the sections -->
        <BaseEntry>
            <template #option-items>
                <div :class="{'option-item-active': 'login'===activeOption}" class="option-item"
                     @click="activateOption('login')"> SIGN IN </div>
                <div :class="{'option-item-active': 'register'===activeOption}" class="option-item"
                     @click="activateOption('register')"> SIGN UP </div>
            </template>
            <!-- The forms within use class binding to show / hide depending on which one is active. -->
            <template #entry-main>
                <section :class="{'entry-form-active': activeOption==='login'}" class="entry-form entry-form-login">
                    <form v-if="!activeGuestLogin" id="login-form" @submit.prevent="loginUser">
                        <input id="username" v-model="user.username" type="text"
                               class="input-field-text" autocomplete="on" placeholder="Username">
                        <input id="password" v-model="user.password" type="password"
                               class="input-field-text" placeholder="Password">
                    </form>
                    <p v-else>If you don't want to create an account, you can log in as a Guest.
                        Guest accounts are temporary and will be deleted on a regular basis.</p>
                    <a id="guest-login" class="link" @click="showGuestLogin">{{guestLoginLinkText}}</a>
                </section>
                <section :class="{'entry-form-active': activeOption==='register'}"
                         class="entry-form entry-form-register">
                    <form id="register-form" @submit.prevent="registerUser">
                        <input id="new-username" v-model="register.username" type="text"
                               class="input-field-text" placeholder="Choose Username">
                        <input id="new-password" v-model="register.password" type="password"
                               class="input-field-text" placeholder="Enter Password">
                        <input id="confirm-password" v-model="register.confirmPassword" type="password"
                               class="input-field-text" placeholder="Confirm Password">
                    </form>
                </section>
            </template>
            <!-- Uses class binding to show / hide the approriate section to the user -->
            <template #entry-button>
                <div :class="{'btn-wrapper-active': activeOption==='login'}"
                     class="btn-wrapper btn-wrapper-login">
                    <button v-if="activeGuestLogin" form="register-form" class="btn-normal"
                            @click="guestLogin">SIGN IN AS GUEST</button>
                    <button v-else form="login-form" class="btn-normal">SIGN IN</button>
                </div>
                <div :class="{'btn-wrapper-active': activeOption==='register'}"
                     class="btn-wrapper btn-wrapper-register">
                    <button form="register-form" class="btn-normal">SIGN UP</button>
                </div>
            </template>
            <!--<template v-slot:entry-footer>
                <a class='link link-disabled'>Forgot Password?</a>
            </template>-->
        </BaseEntry>

    </div>
</template>

<script>
import axios from 'axios'
import {storeToRefs} from 'pinia'
import {useDashboardStore} from '../../store/modules/DashboardStore'
import {useWizardStore} from '../../store/modules/WizardStore'
import {BaseEntry} from '../base'

export default {
    components: {
        BaseEntry,
    },
    setup() {
        const wizard = useWizardStore()
        const {currentMode, parameters, simLocation} = useDashboardStore()
        const {setLiveConfig} = wizard
        return {currentMode, parameters, simLocation, setLiveConfig}
    },
    data() {
        // Initialize all the values that will be used for v-model
        return {
            activeOption: 'login', // Which 'option' should be active
            activeGuestLogin: false, // true: guest login, false: regular login with user/pass form
            activeWarning: false, // Used to show or hide the warning panel
            // The current active warnings. This should really be a 'set' so that
            // it only contains unique warnings. Currently will display duplicates.
            activeWarnings: [],

            user: {
                username: '',
                password: '',
            },

            register: {
                username: '',
                password: '',
                confirmPassword: '',
            },
        }
    },
    computed: {
        guestLoginLinkText() {
            return this.activeGuestLogin ? 'Return to SIGN IN.' : 'Sign in as a Guest.'
        },
    },
    mounted() {
        window.addEventListener('keydown', this.keyListener)
    },
    beforeUnmount() {
        window.removeEventListener('keydown', this.keyListener)
    },
    methods: {

        // On registration make sure the username + password
        // meet the criteria before attempting to register.
        // Warnings cannot be active before attempting login.
        async registerUser() {
            this.dismissWarning()  // clear existing warnings before starting
            // check criteria
            const usernameIsValid = await this.verifyUsername()
            const passwordIsValid = await this.verifyPassword()
            const passwordsMatch = await this.verifyPasswordMatch()
            if (!usernameIsValid) {
                this.addWarning(
                    'Invalid Username: can only contain letters, ' +
                    'numbers, underscores (_), dashes (-), dots (.), ' +
                    'and must be at least 4 characters long.'
                )
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
                const params = {username, password}
                await this.entryHandler(params, '/register')  // Attempt the route
            }
        },

        // Login the user if the criteria is met.
        async loginUser() {
            this.dismissWarning()
            const loginCorrect = await this.verifyLogin()

            if (!loginCorrect) {
                this.addWarning('Invalid username or password')
            }

            if (loginCorrect) {
                const params = this.user
                await this.entryHandler(params, '/login')  // Attempt the route
            }
        },
        toLiveDashboard() {
            // duplicated in Menu.vue
            this.currentMode = 'live'  // set 'live' mode
            this.parameters = {min_step_num: 0}  // create min_step_num parameter
            this.setLiveConfig({duration: {amount: 0}}, this.simLocation)  // set duration in wizard store
            this.$router.push('dashboard')
        },
        keyListener(e) {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault()  // prevent event from propagating to browser
                this.toLiveDashboard()
            }
        },

        // Connection handler for the login / registration.
        // Takes in the parameters to be used, and the route to be called.
        // This method should be converted over to the try/catch block as seen elsewhere.
        // Simply to reduce the callback hell.
        // It would also need to be made async in that case.
        entryHandler(params, route) {
            axios.defaults.withCredentials = true
            axios.post(route, params).then(response => {
                const {status} = response
                if (response.data.status === 'ERROR') {
                    const errmsg = `Error: ${response.data.message}`
                    this.$gtag.exception({description: errmsg})
                    this.addWarning(errmsg)
                } else if (status === 200) {
                    if (this.activeOption === 'login') {
                        if (!this.activeGuestLogin) {
                            this.$gtag.event('user login', {event_category: 'signin',
                                                            event_label: this.user.username})
                        } else {
                            this.$gtag.event('guest login', {event_category: 'signin',
                                                             event_label: this.register.username})
                        }
                    } else {
                        this.$gtag.event('new user signup', {event_category: 'signup',
                                                             event_label: this.register.username})
                    }
                    /*
                    this.$gtag.event('login', { method: 'Google' })
                    this.$gtag.pageview({'page_title': '(debug) guest/regular entry',
                                         'page_path': '/entry'})
                    this.$gtag.event(<action>, {
                        'event_category': <category>,
                        'event_label': <label>,
                        'value': <value>
                    })
                    */
                    this.$router.push('menu')
                }
            }).catch(error => {
                if (!error.response) {
                    // we didn't get a response from the server
                    this.addWarning('Error: No response from the server')
                } else {
                    // we got a response back from the server
                    const {status} = error.response
                    // get the error msg from the server if available, or the generic one
                    const message = error.response.data.message || error.message
                    this.$gtag.exception({description: message})
                    if (status === 401) {
                        this.addWarning(`Login Error: ${message}`)
                    } else if (status === 409) {
                        this.addWarning(`Registration Error: ${message}`)
                    } else {
                        this.addWarning(`Error: ${message}`)
                    }
                }
            })
        },

        // Make sure that the password and username are at least not empty before proceeding.
        verifyLogin() {
            const {username, password} = this.user
            return username.length > 0 && password.length > 0
        },

        verifyUsername() {
            const {username} = this.register
            const userRegex = /^[a-zA-Z0-9_.-]{4,}$/
            return userRegex.test(username)
        },
        verifyPassword() {
            const {password} = this.register
            const passRegex = /.{8,}/
            return passRegex.test(password)
        },

        // Verifies that both the password field and confirm field match and neither is empty
        // Returns the solved boolean value
        verifyPasswordMatch() {
            const {password, confirmPassword} = this.register
            return password === confirmPassword
        },

        // add a warning and set the state to true
        addWarning(warningsMsg) {
            this.activeWarnings.push(warningsMsg)
            this.activeWarning = true
        },

        // Called when the user closes the warning message popup.
        // Clears all warning entries.
        dismissWarning() {
            this.activeWarnings = []
            this.activeWarning = false
        },

        // Used to activate which section the user is under Sign In or Sign Up
        // Called from the above options sections within the HTMl, passes in the
        // name value of the section that should have the active class.
        activateOption(sectionName) {
            this.dismissWarning()
            this.activeOption = sectionName
        },
        showGuestLogin() {
            // swap between guest login and regular login
            this.activeGuestLogin = !this.activeGuestLogin
        },
        guestLogin() {
            // create a random user/pass and use them to login as guest
            const date = Date.now().toString(36)
            const rand_str = Math.random().toString(36).substring(2, 15)
            const rand_userid = `guest-${date}-${rand_str}`
            const rand_password = Math.random().toString(36).substring(2, 15)
            this.register.username = rand_userid
            this.register.password = rand_password
            this.register.confirmPassword = rand_password
        },
    },
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
    .entry-form-login {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        height: 100%;
    }
    .entry-form form {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    .entry-form p {
        width: 256px;
        text-align: justify;
        margin: 0;
        padding: 0;
    }
    #guest-login {
        cursor: pointer;
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
