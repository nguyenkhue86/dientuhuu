// Section 1
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { User } from '../models/user.model';

// Section 2
export const CHANGE_TITLE       = '[TITLE] Change';
// export const REMOVE_TUTORIAL    = '[TUTORIAL] Remove'

// Section 3
export class ChangeUser implements Action {
    readonly type = CHANGE_TITLE;

    constructor(public payload: User) {}
}

export type Actions = ChangeUser;
