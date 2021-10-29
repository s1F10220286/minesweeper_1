import React from 'react';
import ReactDOM from 'react-dom';

import {App} from "./app";


export const render=()=>{
	const app = document.getElementById("app");
	ReactDOM.render(<App/>,	app);
}



