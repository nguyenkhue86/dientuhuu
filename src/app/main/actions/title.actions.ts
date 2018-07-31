// Section 1
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Title } from '../models/title.model';

// Section 2
export const CHANGE_TITLE       = '[TITLE] Change';
// export const REMOVE_TUTORIAL    = '[TUTORIAL] Remove'

// Section 3
export class ChangeTitle implements Action {
    readonly type = CHANGE_TITLE;

    constructor(public payload: Title) {}
}

// export class RemoveTutorial implements Action {
//     readonly type = REMOVE_TUTORIAL

//     constructor(public payload: number) {}
// }

// Section 4
export type Actions = ChangeTitle;
