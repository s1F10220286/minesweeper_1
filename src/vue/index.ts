import { createApp } from "vue";
import App from "./app.vue";

export const render=()=> {
	const app = createApp(App);
	app.mount("#app");
}
