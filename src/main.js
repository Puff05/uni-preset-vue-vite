import {
	createSSRApp
} from "vue";
import App from "./App.vue";
// import './assets/test-tailwind.css'
export function createApp() {
	const app = createSSRApp(App);
	return {
		app,
	};
}
