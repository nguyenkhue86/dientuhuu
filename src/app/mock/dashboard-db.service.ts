import { InMemoryDbService } from 'angular-in-memory-web-api';
import {DashboardDb} from './dashboard-db';




export class DashboardDbService implements InMemoryDbService
{
    createDb()
    {
        return {
            // Dashboards
            'dashboard-projects' : DashboardDb.projects,
            'dashboard-widgets'  : DashboardDb.widgets,
            'users-hpl'  : DashboardDb.users
        };
    }
}
