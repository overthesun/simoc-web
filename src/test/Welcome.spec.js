import {mount} from "@vue/test-utils";
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
//https://pinia.vuejs.org/cookbook/testing.html
import { createTestingPinia } from '@pinia/testing'
import Welcome from "@/components/entry/Welcome.vue";

const vuetify = createVuetify({
    components,
    directives,
  });

test('contains proceed button', () => {
    const wrapper = mount(Welcome, {
        global: {
            plugins: [vuetify, createTestingPinia()],
        },
    })
    expect(wrapper.text()).toContain('PROCEED');
});