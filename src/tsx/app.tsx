import React, {FC,Fragment} from 'react';

import {Setting} from "./setting";
import { Board } from "./board";
import swal from 'sweetalert';

export const App:FC = () => {

  const board = React.createRef<Board>();
  const setting = React.createRef<Setting>();

  const onclick = ()=>{
    if(board.current && setting.current){
      try{
        const scale = setting.current.state;
        board.current.generateBoard(scale.width, scale.height, scale.mines);
      }catch(e){
        console.log(e);
        console.log(setting.current.state);
      }
      
    }
  };

  return (
		<Fragment>
			<Setting ref = {setting} generate={onclick} />
			<Board ref = {board} />
		</Fragment>
	);
};