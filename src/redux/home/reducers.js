import { GOT_LOGO_SRC } from './constans';

const initState = {
    message: 'Hello Duck',
    poweredBy: 'thanks for fire！',
    img_src: null,
};
  
export default (state = initState, action) => {
    switch(action.type) {
        case(GOT_LOGO_SRC): {
            return {
                ...state,
                img_src: action.payload,
            };
        }

        default: return state;
    }
};
