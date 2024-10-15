import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const app = createApp(App);

const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: 'dark'
    }
  });

app.use(vuetify);

app.mount("#app");
