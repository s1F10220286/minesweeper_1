import * as vue from "../vue/index";
import * as react from "../tsx/index";
import * as pureTS from "./index";

export const UsingLibrary = {
	Pure: "pure",
	React: "react",
	Vue: "vue"
} as const;

export type UsingLibrary = typeof UsingLibrary[keyof typeof UsingLibrary];

const url = new URL(document.URL);
const isReact = url.searchParams.has(UsingLibrary.React);
const isVue = url.searchParams.has(UsingLibrary.Vue);

if (isVue) {
	vue.render();
} else if (isReact) {
	react.render();
} else {
	pureTS.render();
}
