<template>
    <div class="d-flex flex-column justify-center align-center h-100 w-100">
        <div class="warning-container" :class="{ 'warning-active': activeWarning }">
            <div v-for="(item, index) in activeWarnings" :key="index">
                <v-alert border="start" type="error" title="Error" color="red" closable>
                    {{activeWarnings[index]}}
                </v-alert>
            </div>
        </div>
        <!--Uses the BaseEntry component as its and fills in the slots to populate the sections -->
        <BaseEntry>
            <template #option-items>
                <v-tabs v-model="tab" align-tabs="center" color="green-accent-4">
                    <v-tab value="sign-in"> SIGN IN </v-tab>
                    <v-tab value="sign-up"> SIGN UP </v-tab>
                </v-tabs>
            </template>

            <template #entry-main>
                <v-card class="d-flex flex-column mx-auto" max-width="275" height="400">
                    <div class="flex-grow-1">
                        <v-window v-model="tab">
                            <v-window-item value="sign-in">
                                <div>
                                    <v-form
                                        v-if="!activeGuestLogin"
                                        id="login-form"
                                        ref="login"
                                        @submit.prevent="loginUser">
                                        <v-text-field v-model="username" :rules="usernameRules" label="Username"
                                                      required />
                                        <v-text-field v-model="password" :rules="passwordRules" label="Password"
                                                      type="password" required />
                                    </v-form>
                                    <p v-else class="text-justify">
                                        If you don't want to create an account, you can log in as a Guest.
                                        Guest accounts are temporary and will be deleted on a regular
                                        basis.
                                    </p>
                                </div>
                            </v-window-item>

                            <v-window-item value="sign-up">
                                <div>
                                    <v-form id="register-form" ref="register" @submit.prevent="registerUser">
                                        <v-text-field v-model="username" :rules="usernameRules" label="Username"
                                                      required />
                                        <v-text-field v-model="password" :rules="passwordRules" label="Password"
                                                      type="password" required />
                                        <v-text-field v-model="confirmPassword"
                                                      :rules="[...passwordRules, passwordMatchRule]"
                                                      label="Confirm Password"
                                                      type="password"
                                                      required />
                                    </v-form>
                                </div>
                            </v-window-item>
                        </v-window>
                    </div>

                    <v-card-actions class="justify-center text-center">
                        <div v-if="tab === 'sign-in'" class="d-flex flex-column activeOption ==='login'">
                            <a id="guest-login" class="link mb-2 " @click="showGuestLogin">{{guestLoginLinkText}}</a>
                            <v-btn-menu v-if="!activeGuestLogin" type="submit" form="login-form">SIGN IN</v-btn-menu>
                            <v-btn-menu v-else type="submit" form="register-form" @click="guestLogin">SIGN IN AS GUEST</v-btn-menu>
                        </div>
                        <v-btn-menu v-if="tab === 'sign-up'" class="activeOption === 'register'" type="submit" form="register-form">SIGN UP</v-btn-menu>
                    </v-card-actions>
                </v-card>
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
        const dashboard = useDashboardStore()
        const wizard = useWizardStore()
        const {currentMode, parameters, simLocation} = storeToRefs(dashboard)
        const {setLiveConfig} = wizard
        return {currentMode, parameters, simLocation, setLiveConfig}
    },
    data() {
    // Initialize all the values that will be used for v-model
        return {
            activeOption: 'login', // Used to activate the active class on the options
            activeGuestLogin: false, // true: guest login, false: regular login with user/pass form
            activeWarning: false, // Used to show or hide the warning panel
            // The current active warnings. This should really be a 'set' so that
            // it only contains unique warnings. Currently will display duplicates.
            activeWarnings: [],
            // Below are being used for vuetify form validation
            tab: 'login',
            valid: false,
            username: '',
            password: '',
            confirmPassword: '',
            usernameRules: [
                v => !!v || 'Username is required',
                v => (v && v.length >= 4) || 'Username must be at least 4 characters',
                v => /^[A-Za-z0-9_.-]*$/.test(v)
                    || 'Username can only contain letters, numbers, underscores, dashes, and dots',
            ],
            passwordRules: [
                v => !!v || 'Password is required',
                v => (v && v.length >= 8) || 'Password must be at least 8 characters',
                v => /[0-9]/.test(v) || 'Password must contain at least one number',
                v => /^[\w.\-!@#$%^&*()+=<>?{}[\]~`|\\/:;'",]*$/.test(v)
                    || 'Password can contain letters, numbers, and special characters',
            ],
            confirmPasswordRules: [
                v => !!v || 'Confirm Password is required',
            ],
        }
    },
    computed: {
        guestLoginLinkText() {
            return this.activeGuestLogin ? 'Return to SIGN IN.' : 'Sign in as a Guest.'
        },
        passwordMatchRule() {
            return v => v === this.password || 'Passwords do not match'
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
            this.dismissWarning() // clear existing warnings before starting
            // if no warnings were present pass in the username object to the register route
            if (!this.activeWarning) {
                const {valid} = await this.$refs.register.validate()
                if (valid) {
                    const params = {
                        username: this.username,
                        password: this.password,
                        confirmPassword: this.confirmPassword,
                    }
                    this.entryHandler(params, '/register')
                }
            }
        },
        // Login the user if the criteria is met.
        async loginUser() {
            this.dismissWarning()
            const {valid} = await this.$refs.login.validate()
            console.log(valid)
            if (valid) {
                this.dismissWarning()
                const params = {username: this.username, password: this.password}
                this.entryHandler(params, '/login')
            }
        },
        toLiveDashboard() {
        // duplicated in Menu.vue
            this.currentMode = 'live' // set 'live' mode
            this.parameters = {min_step_num: 0} // create min_step_num parameter
            this.setLiveConfig({duration: {amount: 0}}, this.simLocation) // set duration in wizard store
            this.$router.push('dashboard')
        },
        keyListener(e) {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault() // prevent event from propagating to browser
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
            axios
                    .post(route, params)
                    .then(response => {
                        const {status} = response
                        if (response.data.status === 'ERROR') {
                            const errmsg = `Error: ${response.data.message}`
                            this.$gtag.exception({description: errmsg})
                            this.addWarning(errmsg)
                        } else if (status === 200) {
                            if (this.activeOption === 'login') {
                                if (!this.activeGuestLogin) {
                                    this.$gtag.event('user login', {
                                        event_category: 'signin',
                                        event_label: this.username,
                                    })
                                } else {
                                    this.$gtag.event('guest login', {
                                        event_category: 'signin',
                                        event_label: this.username,
                                    })
                                }
                            } else {
                                this.$gtag.event('new user signup', {
                                    event_category: 'signup',
                                    event_label: this.username,
                                })
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
                    })
                    .catch(error => {
                        if (!error.response) {
                        // we didn't get a response from the server
                            this.addWarning('No response from the server')
                        } else {
                        // we got a response back from the server
                            const {status} = error.response
                            // get the error msg from the server if available, or the generic one
                            const message = error.response.data.message || error.message
                            this.$gtag.exception({description: message})
                            if (status === 401) {
                                this.addWarning(`${message}`)
                            } else if (status === 409) {
                                this.addWarning(`${message}`)
                            } else {
                                this.addWarning(`${message}`)
                            }
                        }
                    })
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
            this.username = rand_userid
            this.password = rand_password
            this.confirmPassword = rand_password

            // in order to sign up as guest the vuetify props need to properly
            // propagate and only happens on tab change and nextrick is used to
            // give the DOM time to update properly. This is a workaround and there
            // is chance that we can reqrite the guest functionality at a later date.
            this.tab='sign-up'
            this.$nextTick(() => {
                this.registerUser()
            })
        },
    },
}
</script>

<style lang="scss" scoped>

.v-tab {
  font-size:24px
}

.input-field-text {
  height: 36px;
  margin-bottom: 24px;
  outline: none;
  padding: 8px 8px;
  width: 256px;
  border-radius: 8px;
  border: none;
  box-sizing: border-box;
  font-weight: 600;
}

#guest-login {
  cursor: pointer;
}

.warning-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
}

.link {
  text-decoration: underline;
  &:visited,
  & {
    color: lightgreen;
  }

  &-disabled {
    color: #999;
  }
}
</style>
