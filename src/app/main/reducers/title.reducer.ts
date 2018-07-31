import { Action } from '@ngrx/store';
import { Title } from '../models/title.model';
import * as TitleActions from '../actions/title.actions';

// Section 1
const initialState: Title = {
    name: 'Initial Tutorial',
    icon: 'mail'
};

// Section 2
export function reducerTitle(state: Title[] = [initialState] , action: TitleActions.Actions) {

    // Section 3
    switch (action.type) {
        case TitleActions.CHANGE_TITLE:
            return [action.payload];
        default:
            return state;
    }
}
