import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material';

@Injectable()
export class MatSidenavHelperService
{
    sidenavInstances: MatSidenav[];

    constructor()
    {
        this.sidenavInstances = [];
    }

    setSidenav(id, instance)
    {
        this.sidenavInstances[id] = instance;
    }

    getSidenav(id)
    {
        return this.sidenavInstances[id];
    }
}
